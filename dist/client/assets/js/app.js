import { store } from "./store.js";
import { startRouter, matchRoute, go } from "./router.js";
import { validateProfile, validateAssessment } from "./validation.js";
import { appShell } from "./components/navigation.js";
import { escapeHtml, toast, modal } from "./components/ui.js";
import { formValue, formValues } from "./components/forms.js";
import { welcomeView, profileSetupView, dashboardView, assessmentImportView, assessmentReviewView, surveyView, confirmView, processingView, resultsView, metricDetailView, compareView, learnView, learnMetricView, profileView, researchView, notFoundView, blankMetrics, demoAssessments } from "./views/pages.js";

const app=document.querySelector("#app");
let processingTimer=null;
let corruptionShown=false;

const titles={"profile-setup":"Profile Setup",dashboard:"Dashboard","assessment-import":"New Assessment","assessment-review":"Review Assessment",survey:"Context Survey",confirm:"Confirm",processing:"Preparing Results",results:"Results","result-metric":"Priority Detail",compare:"Compare",learn:"Learn","learn-metric":"Metric Guide",profile:"Profile",research:"Research Comparison","not-found":"Not Found"};

function render(){
  clearTimeout(processingTimer);
  const route=matchRoute(); const state=store.get();
  if(!state.profile && !["welcome","profile-setup","learn","learn-metric"].includes(route.name)){go("#/profile/setup");return;}
  let content="";
  switch(route.name){
    case "welcome": content=welcomeView();break;
    case "profile-setup": content=profileSetupView(state);break;
    case "dashboard": content=dashboardView(state);break;
    case "assessment-import": content=assessmentImportView(state);break;
    case "assessment-review": content=assessmentReviewView(state);break;
    case "survey": content=surveyView(state,route.params[0]);break;
    case "confirm": content=confirmView(state);break;
    case "processing": content=processingView();break;
    case "results": content=resultsView(state);break;
    case "result-metric": content=metricDetailView(state,route.params[0]);break;
    case "compare": content=compareView(state);break;
    case "learn": content=learnView(state);break;
    case "learn-metric": content=learnMetricView(state,route.params[0]);rememberMetric(route.params[0]);break;
    case "profile": content=profileView(state);break;
    case "research": content=researchView(state);recordResearchFirst();break;
    default: content=notFoundView();
  }
  app.innerHTML=route.name==="welcome"?content:appShell(content,route.name,state,titles[route.name]);
  document.title=`${titles[route.name]||"FITSTART"} — FITSTART`;
  window.scrollTo(0,0);
  if(route.name==="processing")runProcessing();
  const meta=store.meta();
  if(meta.storageCorrupt&&!corruptionShown){corruptionShown=true;setTimeout(()=>modal({title:"Stored demo data could not be read",body:"<p>FITSTART opened safely without the incompatible data. Reset the demo store to continue.</p>",confirmText:"Reset Demo Data",danger:true,onConfirm:()=>{store.clear();go("#/welcome")}}),0);}
  if(!meta.storageAvailable)setTimeout(()=>toast("Local storage is unavailable. Your current session can continue, but changes may not persist."),0);
  document.querySelector("#main-content")?.focus({preventScroll:true});
}

function rememberMetric(id){const state=store.get();if(state.ui.recentMetrics?.[0]===id)return;store.update(draft=>{draft.ui.recentMetrics=[id,...(draft.ui.recentMetrics||[]).filter(x=>x!==id)].slice(0,3);return draft;});}
function recordResearchFirst(){const state=store.get();if(state.ui.research?.viewedFirst)return;store.update(draft=>{draft.ui.research={...(draft.ui.research||{}),viewedFirst:"original",startedAt:new Date().toISOString(),answers:{}};return draft;});}

function profileFromForm(form,base={}){return {...base,displayName:formValue(form,"displayName"),primaryGoal:formValue(form,"primaryGoal"),secondaryGoal:formValue(form,"secondaryGoal"),experience:formValue(form,"experience"),activities:formValues(form,"activities"),availability:formValue(form,"availability"),expectations:formValues(form,"expectations"),barriers:formValues(form,"barriers")};}
function showErrors(form,errors){form.querySelectorAll("[data-error]").forEach(el=>el.textContent=errors[el.dataset.error]||"");const first=Object.keys(errors)[0];if(first)form.querySelector(`[name="${first}"]`)?.focus();}
function sourceLabel(category){return category==="higher-attention"?"Demo: Higher Attention":category==="attention"?"Demo: Needs Review":"Demo: Within Reference Range";}

document.addEventListener("submit",event=>{
  const form=event.target;
  if(form.id==="profile-setup-form"){
    event.preventDefault();const profile=profileFromForm(form,{});const errors=validateProfile(profile);showErrors(form,errors);if(Object.keys(errors).length)return;
    store.update(d=>{d.profile={id:"local-member",...profile,confidence:"low"};d.ui.onboardingComplete=true;return d;});toast("Profile saved on this device.");go("#/dashboard");
  }
  if(form.id==="assessment-review-form"){
    event.preventDefault();const state=store.get();const draft=structuredClone(state.draftAssessment);if(!draft)return;
    draft.metrics=draft.metrics.map(metric=>{const input=form.elements[`metric-${metric.id}`];const category=formValue(form,`category-${metric.id}`)||metric.sourceCategory;return {...metric,value:input?.disabled?null:input?.value??metric.value,sourceCategory:category,sourceCategoryLabel:sourceLabel(category)};});
    const errors=validateAssessment(draft);if(!form.elements.reviewed.checked)errors.reviewed="Confirm that you reviewed every available value.";showErrors(form,errors);if(Object.keys(errors).length)return;
    draft.assessedAt=new Date().toISOString().slice(0,10);store.confirmAssessment(draft);toast("Assessment confirmed. Original values are preserved.");go("#/survey/1");
  }
  if(form.id==="survey-form"){
    event.preventDefault();const step=Number(form.dataset.step);const answers={};
    if(step===1){answers.primaryGoal=formValue(form,"primaryGoal");answers.secondaryGoal=formValue(form,"secondaryGoal");if(!answers.primaryGoal){showErrors(form,{survey:"Choose a primary goal to continue."});return}if(answers.secondaryGoal===answers.primaryGoal){showErrors(form,{survey:"The secondary goal must be different from the primary goal."});return}}
    if(step===2){answers.experience=formValue(form,"experience");answers.confidence=formValue(form,"confidence")||"medium";if(!answers.experience){showErrors(form,{survey:"Choose your experience level to continue."});return}}
    if(step===3)answers.activities=formValues(form,"activities");
    if(step===4){answers.availability=formValue(form,"availability");if(!answers.availability){showErrors(form,{survey:"Choose a realistic availability to continue."});return}}
    if(step===5){answers.expectations=formValues(form,"expectations");answers.barriers=formValues(form,"barriers")}
    store.update(d=>{d.draftSurvey={...(d.draftSurvey||{}),...answers};return d;});go(step===5?"#/confirm":`#/survey/${step+1}`);
  }
  if(form.id==="profile-update-form"){
    event.preventDefault();const state=store.get();const updated=profileFromForm(form,state.profile);const errors=validateProfile(updated);if(Object.keys(errors).length){showErrors(form,{profile:Object.values(errors)[0]});return}
    const save=()=>{store.update(d=>{d.profile=updated;return d;});if(state.latestResult)store.generateResult();toast("Profile changes saved and priorities recalculated.");render()};
    if(updated.primaryGoal!==state.profile.primaryGoal)modal({title:"Goal Update Notice",body:`<p>Your main goal changed from <strong>${escapeHtml(state.profile.primaryGoal.replaceAll("-"," "))}</strong> to <strong>${escapeHtml(updated.primaryGoal.replaceAll("-"," "))}</strong>. FITSTART will recalculate your priorities using your new goal.</p>`,confirmText:"Confirm Goal Change",onConfirm:save});else save();
  }
});

document.addEventListener("click",event=>{
  const action=event.target.closest("[data-action]")?.dataset.action;
  if(location.hash==="#/confirm"&&event.target.closest('a[href="#/assessment/review"]')){event.preventDefault();store.update(d=>{d.draftAssessment=structuredClone(d.assessments.at(-1));return d;});go("#/assessment/review");return;}
  if(!action)return;
  if(action==="explore-demo"){store.loadDemo(true);toast("Maria’s fictional demo scenario is ready.");go("#/dashboard")}
  if(action==="open-boundaries")modal({title:"What FITSTART does not do",body:"<p>FITSTART is not a medical application, automated trainer, meal planner, gym-management system, or long-term fitness tracker.</p><p>It does not diagnose, predict disease risk, generate workouts or meal plans, verify professionals, or claim that a measured change proves improvement.</p>",confirmText:"I understand",cancelText:"Close"});
  if(action==="clear-data")modal({title:"Clear all demo data?",body:"<p>This removes the fictional profile, assessments, survey drafts, recent library items, and research responses saved on this device.</p>",confirmText:"Clear Demo Data",danger:true,onConfirm:()=>{store.clear();toast("Demo data cleared.");go("#/welcome")}});
  if(action==="use-demo-assessment")startAssessment("demo");
  if(action==="use-manual-assessment")startAssessment("manual");
  if(action==="simulate-screenshot"){const file=document.querySelector("#report-upload")?.files?.[0];if(!file){toast("Choose a screenshot file to preview first.");return}toast(`${file.name} selected. Extraction is simulated; review every value.`);startAssessment("screenshot",file.name)}
  if(action==="simulate-qr"){toast("QR scan simulated. Review every captured value.");startAssessment("qr")}
  if(action==="toggle-unavailable"){const id=event.target.closest("[data-id]").dataset.id;store.update(d=>{const m=d.draftAssessment.metrics.find(x=>x.id===id);if(m.value===null){const original=demoAssessments.at(-1).metrics.find(x=>x.id===id);m.value=original?.value??""}else m.value=null;return d;});render()}
  if(action==="reset-metric"){const id=event.target.closest("[data-id]").dataset.id;store.update(d=>{const m=d.draftAssessment.metrics.find(x=>x.id===id);const original=demoAssessments.at(-1).metrics.find(x=>x.id===id);Object.assign(m,structuredClone(original));return d;});toast("Metric reset to the captured demo value.");render()}
  if(action==="confirm-and-generate"){const state=store.get();store.update(d=>{d.profile={...d.profile,...d.draftSurvey};d.draftSurvey=null;return d;});store.generateResult();go("#/processing")}
  if(action==="view-full-assessment")showFullAssessment();
  if(action==="clear-search"){const input=document.querySelector("#metric-search");if(input){input.value="";filterLibrary()}}
  if(action==="begin-comprehension"){const area=document.querySelector("#comprehension");area.hidden=false;event.target.textContent="Questions started";event.target.disabled=true;area.scrollIntoView({behavior:"smooth"})}
  if(action==="save-comprehension"){const focus=document.querySelector('input[name="research-main-focus"]:checked')?.value||"";const replaced=document.querySelector('input[name="research-replace"]:checked')?.value||"";store.update(d=>{d.ui.research.answers={mainFocus:focus,replaced};d.ui.research.completedAt=new Date().toISOString();return d;});toast("Research responses saved locally.")}
});

document.addEventListener("input",event=>{if(event.target.id==="metric-search")filterLibrary()});
document.addEventListener("click",event=>{const filter=event.target.closest("[data-filter]");if(filter){document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("is-active",x===filter));filterLibrary()}const tab=event.target.closest("[data-research-tab]");if(tab){const id=tab.dataset.researchTab;document.querySelectorAll("[data-research-tab]").forEach(x=>x.setAttribute("aria-selected",String(x===tab)));document.querySelectorAll("[data-research-panel]").forEach(x=>x.classList.toggle("is-active",x.dataset.researchPanel===id));}});

function startAssessment(sourceType,fileName=""){const metrics=sourceType==="manual"?structuredClone(blankMetrics):structuredClone(demoAssessments.at(-1).metrics);store.update(d=>{d.draftAssessment={id:"draft",assessedAt:new Date().toISOString().slice(0,10),sourceType,fileName,verified:false,metrics};return d;});go("#/assessment/review")}
function showFullAssessment(){const state=store.get();const assessment=state.assessments.at(-1);if(!assessment)return;modal({title:"Complete unprocessed assessment",body:`<p class="supporting">${escapeHtml(assessment.assessedAt)} · Original confirmed values</p><div class="table-wrap spacer-top"><table class="data-table"><tbody>${assessment.metrics.map(m=>`<tr><td>${escapeHtml(m.name)}</td><td><strong>${m.value===null?"Unavailable":`${escapeHtml(m.value)} ${escapeHtml(m.unit)}`}</strong></td><td>${escapeHtml(m.sourceCategoryLabel)}</td></tr>`).join("")}</tbody></table></div><p class="supporting spacer-top">Fictional demo report. No values were rewritten by FITSTART.</p>`,confirmText:"Done",cancelText:"Close"})}
function filterLibrary(){const query=(document.querySelector("#metric-search")?.value||"").trim().toLowerCase();const category=document.querySelector("[data-filter].is-active")?.dataset.filter||"all";let shown=0;document.querySelectorAll("[data-library-card]").forEach(card=>{const visible=(!query||card.dataset.name.includes(query))&&(category==="all"||card.dataset.category===category);card.hidden=!visible;if(visible)shown++});const empty=document.querySelector("#library-empty");if(empty)empty.hidden=shown>0}
function runProcessing(){let index=0;const advance=()=>{const steps=[...document.querySelectorAll("[data-process-step]")];if(!steps.length)return;steps.forEach((step,i)=>{step.classList.toggle("is-done",i<index);step.classList.toggle("is-active",i===index);if(i<index)step.querySelector(".processing-dot").textContent="✓"});if(index>=steps.length){processingTimer=setTimeout(()=>go("#/results"),200);return}index++;processingTimer=setTimeout(advance,340)};advance()}

window.addEventListener("error",()=>{if(!app.innerHTML.trim())app.innerHTML='<main class="fallback" id="main-content"><h1>FITSTART could not display this screen.</h1><p>Your saved demo data has not been removed. Return to <a href="#/dashboard">Dashboard</a> or use Clear Demo Data from Profile.</p></main>'});
store.subscribe(()=>{});
startRouter(render);
