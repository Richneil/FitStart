import { store } from "./store.js";
import { startRouter, matchRoute, go } from "./router.js";
import { appShell } from "./components/app-shell.js";
import { modal, toast, escapeHtml, label } from "./components/ui.js";
import { metricDefinitions, createSampleAssessment } from "./data/fitmao-metrics.js";
import * as views from "./views/all-views.js";

const app=document.querySelector("#app");
let processingTimer=null,previewObjectUrl=null,dirty=false,corruptionShown=false;
const titles={welcome:"Welcome",auth:"Before You Begin", "profile-setup":"Profile Setup",dashboard:"Home","assessment-add":"Add Report","assessment-manual":"Type Report Values","assessment-review":"Check Report","context-confirm":"Check Details",processing:"Preparing Results",results:"Your Starting Point",history:"Assessment History","focus-detail":"Result Explanation",summary:"Trainer Guide",report:"All Report Values",compare:"Compare Reports",glossary:"Learn Terms","glossary-detail":"Learn Terms",profile:"My Profile",research:"Researcher Tools","not-found":"Page Not Found"};
const publicRoutes=["welcome","auth"];

function guardedRoute(route,state){
  if(publicRoutes.includes(route.name))return route;
  if(!state.session.signedIn){go("#/welcome");return null}
  if((!state.profile||!state.ui.onboardingComplete)&&route.name!=="profile-setup"){go("#/profile/setup");return null}
  if(state.profile&&state.ui.onboardingComplete&&route.name==="profile-setup"){go("#/dashboard");return null}
  if(["results","focus-detail","summary"].includes(route.name)&&!state.latestResult){go("#/dashboard");return null}
  if(route.name==="report"&&!state.assessments.length){go("#/dashboard");return null}
  return route;
}

function render(){
  clearTimeout(processingTimer);dirty=false;
  const state=store.get(),route=guardedRoute(matchRoute(),state);if(!route)return;
  const map={welcome:()=>views.welcomeView(),auth:()=>views.authView(),"profile-setup":()=>views.onboardingView(state),dashboard:()=>views.dashboardView(state),"assessment-add":()=>views.assessmentAddView(),"assessment-manual":()=>views.manualEntryView(state),"assessment-review":()=>views.assessmentReviewView(state),"context-confirm":()=>views.contextView(state),processing:()=>views.processingView(),results:()=>views.resultsView(state),history:()=>views.historyResultView(state,route.params[0]),"focus-detail":()=>views.focusDetailView(state,route.params[0]),summary:()=>views.summaryView(state),report:()=>views.fullReportView(state),glossary:()=>views.glossaryView(),"glossary-detail":()=>views.glossaryDetailView(state,route.params[0]),compare:()=>views.compareView(state),profile:()=>views.profileView(state),research:()=>views.researchView(state),"not-found":()=>views.notFoundView()};
  const content=(map[route.name]||map["not-found"])();
  app.innerHTML=publicRoutes.includes(route.name)||route.name==="profile-setup"?content:appShell(content,route.name,state,titles[route.name]);
  document.title=`${titles[route.name]||"FITSTART"} — FITSTART`;window.scrollTo(0,0);requestAnimationFrame(()=>document.querySelector("#main-content")?.focus({preventScroll:true}));
  if(route.name==="processing")runProcessing();
  const meta=store.meta();
  if(meta.storageCorrupt&&!corruptionShown){corruptionShown=true;setTimeout(()=>modal({title:"Saved data needs a safe reset",body:"<p>FITSTART could not read the saved prototype data. You can safely remove it and restart.</p>",confirmText:"Safe Reset",danger:true,onConfirm:()=>{store.clear();go("#/welcome")}}),0)}
  if(!meta.storageAvailable)setTimeout(()=>toast("Browser storage is unavailable. Changes may last only for this session."),0);
}

const formValue=(form,name)=>form.elements[name]?.value?.trim?.()??form.elements[name]?.value??"";
const formError=(form,key,message)=>{const target=form.querySelector(`[data-error="${key}"]`);if(target)target.textContent=message;if(message)target.focus?.()};
const onboardingPatch=(form,step)=>step===1?{displayName:formValue(form,"displayName")}:step===2?{primaryGoal:formValue(form,"primaryGoal"),secondaryGoal:formValue(form,"secondaryGoal")}:step===3?{fitnessExperience:formValue(form,"fitnessExperience")}: {assessmentFamiliarity:formValue(form,"assessmentFamiliarity")};
function draftFromSample(sourceType,fileName=""){const a=createSampleAssessment("draft",new Date().toISOString().slice(0,10));return {...a,id:"draft",sourceType,fileName,verified:false}}
function blankDraft(){return{id:"draft",assessedAt:new Date().toISOString().slice(0,10),sourceType:"manual",verified:false,metrics:metricDefinitions.map(m=>({...m,value:"",status:"Not provided",available:false}))}}
function saveManual(form,navigate=true){const existing=store.get().draftAssessment||blankDraft();existing.metrics=existing.metrics.map(metric=>{const raw=formValue(form,metric.id);const numeric=metric.unit!=="—"&&!['segmental-fat','body-type'].includes(metric.id);return{...metric,value:raw===""?"":numeric?Number(raw):raw,status:raw===""?"Not provided":metric.status||"Not provided",available:raw!==""}});store.update(d=>{d.draftAssessment=existing;return d});toast("Manual draft saved on this device.");if(navigate)go("#/assessment/review")}

document.addEventListener("submit",event=>{
  const form=event.target;dirty=false;
  if(form.id==="session-start-form"){event.preventDefault();store.startSession("test-session");go(store.get().profile?"#/dashboard":"#/profile/setup")}
  if(form.id==="onboarding-form"){event.preventDefault();const step=Number(form.dataset.step),patch=onboardingPatch(form,step);if(step===1&&!patch.displayName)return formError(form,"onboarding","Enter a name or nickname to continue.");if(step===2&&!patch.primaryGoal)return formError(form,"onboarding","Choose your main goal to continue.");if(step===2&&patch.secondaryGoal===patch.primaryGoal)return formError(form,"onboarding","Choose a different secondary goal or leave it blank.");if(step===3&&!patch.fitnessExperience)return formError(form,"onboarding","Choose your experience level.");if(step===4&&!patch.assessmentFamiliarity)return formError(form,"onboarding","Choose how familiar you are with assessment terms.");store.update(d=>{d.profile={id:"local-member",...(d.profile||{}),...patch};if(step<4)d.ui.onboardingStep=step+1;else{d.ui.onboardingComplete=true;d.ui.onboardingStep=1}return d});step<4?render():go("#/dashboard")}
  if(form.id==="manual-form"){event.preventDefault();const required=["weight","pbf","smm"].filter(id=>formValue(form,id)==="");if(required.length)return formError(form,"manual","Enter body weight, body fat percentage, and muscle mass before continuing.");saveManual(form,true)}
  if(form.id==="review-form"){event.preventDefault();const state=store.get(),draft=structuredClone(state.draftAssessment);draft.metrics=draft.metrics.map(metric=>{const raw=formValue(form,`metric-${metric.id}`),numeric=typeof metric.value==="number";return{...metric,value:raw===""?"":numeric?Number(raw):raw,status:formValue(form,`status-${metric.id}`),available:raw!==""}});const missing=["weight","pbf","smm"].filter(id=>!draft.metrics.find(m=>m.id===id)?.available);if(missing.length)return formError(form,"review","Body weight, body fat percentage, and muscle mass are required.");if(!form.elements.reviewed.checked)return formError(form,"review","Confirm that you reviewed the values against your report.");const commit=()=>{store.confirmAssessment(draft);toast("Report confirmed.");if(previewObjectUrl){URL.revokeObjectURL(previewObjectUrl);previewObjectUrl=null}go("#/context/confirm")};if(state.assessments.length>=10&&!draft.editingAssessmentId)modal({title:"Replace the oldest saved report?",body:"<p>FITSTART keeps your 10 newest reports on this device. Continuing removes the oldest one.</p>",confirmText:"Replace oldest report",onConfirm:commit});else commit()}
  if(form.id==="context-form"){event.preventDefault();const state=store.get(),primary=formValue(form,"primaryGoal"),secondary=formValue(form,"secondaryGoal");if(primary===secondary&&secondary)return toast("Choose a different secondary goal.");const save=()=>{store.update(d=>{d.profile.primaryGoal=primary;d.profile.secondaryGoal=secondary;return d});toast("Context updated.");render()};if(primary!==state.profile.primaryGoal)modal({title:"Goal Update Notice",body:`<p>Your main goal changed from <strong>${label(state.profile.primaryGoal)}</strong> to <strong>${label(primary)}</strong>. FITSTART will recalculate your priorities using your new goal.</p>`,confirmText:"Confirm Goal Change",onConfirm:save});else save()}
  if(form.id==="profile-form"){event.preventDefault();const state=store.get(),updated={displayName:formValue(form,"displayName"),primaryGoal:formValue(form,"primaryGoal"),secondaryGoal:formValue(form,"secondaryGoal"),fitnessExperience:formValue(form,"fitnessExperience"),assessmentFamiliarity:formValue(form,"assessmentFamiliarity")};if(!updated.displayName)return formError(form,"profile","Enter a name or nickname.");if(updated.primaryGoal===updated.secondaryGoal&&updated.secondaryGoal)return formError(form,"profile","Choose a different secondary goal.");const save=()=>{store.update(d=>{Object.assign(d.profile,updated);return d});if(state.latestResult)store.generateResult();toast("Profile saved and results recalculated.");render()};if(updated.primaryGoal!==state.profile.primaryGoal)modal({title:"Goal Update Notice",body:"<p>Changing your main goal recalculates the order of your focus areas. Your confirmed report values will not change.</p>",confirmText:"Save and Recalculate",onConfirm:save});else save()}
});

document.addEventListener("change",event=>{
  if(event.target.closest("form"))dirty=true;
  if(event.target.id==="report-upload"){const file=event.target.files?.[0],button=document.querySelector('[data-action="use-upload"]');if(!file)return;if(previewObjectUrl)URL.revokeObjectURL(previewObjectUrl);previewObjectUrl=URL.createObjectURL(file);button.disabled=false;button.textContent=`Continue with ${file.name}`;button.dataset.fileName=file.name;toast("Screenshot selected. Continue when ready.")}
  if(event.target.matches('[data-action="toggle-research"]')){store.update(d=>{d.ui.researchMode=event.target.checked;return d});toast(`Research Mode ${event.target.checked?"enabled":"disabled"}.`);render()}
});
document.addEventListener("input",event=>{if(event.target.closest("form"))dirty=true;if(event.target.id==="glossary-search")filterGlossary()});

document.addEventListener("click",event=>{
  const link=event.target.closest("a[href^='#/']");if(link&&dirty&&!confirm("Leave this form? Unsaved changes may be lost.")){event.preventDefault();return}
  const action=event.target.closest("[data-action]")?.dataset.action;
  if(action==="open-boundaries")modal({title:"What FITSTART does and does not do",body:"<p><strong>FITSTART does:</strong> capture confirmed FitMao values, group related measurements, connect them with your stated goal, and explain what information to review first.</p><p><strong>FITSTART does not:</strong> diagnose, predict disease, prescribe workouts or diets, manage gym membership, or replace a qualified professional.</p>",confirmText:"I Understand"})
  if(action==="onboarding-back"){store.update(d=>{d.ui.onboardingStep=Math.max(1,d.ui.onboardingStep-1);return d});render()}
  if(action==="use-qr"){store.update(d=>{d.draftAssessment=draftFromSample("qr");return d});go("#/assessment/review")}
  if(action==="use-upload"){const fileName=event.target.closest("[data-action]").dataset.fileName||"report-screenshot.png",draft=draftFromSample("screenshot",fileName);draft.previewUrl=previewObjectUrl;store.update(d=>{d.draftAssessment=draft;return d},false);go("#/assessment/review")}
  if(action==="save-manual")saveManual(event.target.closest("form"),false)
  if(action==="edit-latest-assessment"){const state=store.get(),draft=structuredClone(state.assessments.at(-1));draft.editingAssessmentId=draft.id;draft.verified=false;store.update(d=>{d.draftAssessment=draft;return d});go("#/assessment/review")}
  if(action==="generate-results"){store.generateResult();go("#/processing")}
  if(action==="print-summary")window.print()
  if(action==="sign-out")modal({title:"End this test session?",body:"<p>Your test data will stay in this browser so you can continue later.</p>",confirmText:"End session",onConfirm:()=>{store.signOut();go("#/welcome")}})
  if(action==="clear-data")modal({title:"Clear this test session?",body:"<p>This removes the locally saved profile, assessments, and settings from this browser.</p>",confirmText:"Clear Test Data",danger:true,onConfirm:()=>{store.clear();go("#/welcome")}})
  const filter=event.target.closest("[data-glossary-filter]");if(filter){document.querySelectorAll("[data-glossary-filter]").forEach(button=>button.classList.toggle("is-active",button===filter));filterGlossary()}
  const researchTab=event.target.closest("[data-research-tab]");if(researchTab){const id=researchTab.dataset.researchTab;document.querySelectorAll("[data-research-tab]").forEach(button=>button.classList.toggle("is-active",button===researchTab));document.querySelectorAll("[data-research-panel]").forEach(panel=>panel.classList.toggle("is-active",panel.dataset.researchPanel===id))}
});

function filterGlossary(){const q=(document.querySelector("#glossary-search")?.value||"").toLowerCase(),category=document.querySelector("[data-glossary-filter].is-active")?.dataset.glossaryFilter||"all";let count=0;document.querySelectorAll("[data-glossary-card]").forEach(card=>{const show=(!q||card.dataset.name.includes(q))&&(category==="all"||card.dataset.category===category);card.hidden=!show;if(show)count++});const empty=document.querySelector("#glossary-empty");if(empty)empty.hidden=count>0}
function runProcessing(){let index=0;const tick=()=>{const items=[...document.querySelectorAll("[data-process]")];items.forEach((item,i)=>item.classList.toggle("is-done",i<index));if(index>items.length){store.generateResult();go("#/results");return}index++;processingTimer=setTimeout(tick,260)};tick()}

window.addEventListener("beforeunload",event=>{if(dirty){event.preventDefault();event.returnValue=""}});
window.addEventListener("error",()=>{if(!app.innerHTML.trim())app.innerHTML='<main class="fallback" id="main-content"><h1>FITSTART could not display this page.</h1><p>Return to <a href="#/dashboard">Dashboard</a>. Your saved data has not been removed.</p></main>'});
startRouter(render);
