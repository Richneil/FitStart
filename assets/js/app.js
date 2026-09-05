import { store } from "./store.js?v=9";
import { startRouter, matchRoute, go } from "./router.js?v=9";
import { appShell, guidedShell } from "./components/navigation.js?v=9";
import { modal, toast, label } from "./components/ui.js";
import { metricDefinitions } from "./data/fitmao-metrics.js";
import { fictionalDemoProfile } from "./data/demo-data.js?v=9";
import { createImportDraft, validateReportFile } from "./services/report-import-service.js?v=9";
import { simulateExtraction, assessmentFromExtraction } from "./services/extraction-service.js?v=9";
import * as views from "./views/all-views.js?v=9";

const app=document.querySelector("#app");
let processingTimer=null,importTimer=null,previewObjectUrl=null,previewZoom=1,dirty=false,corruptionShown=false;
const guidedRoutes=["assessment-add","assessment-importing","assessment-review","assessment-manual","personalize","context-confirm","processing"];
const titles={welcome:"Welcome","assessment-add":"Add Report","assessment-importing":"Reading Report","assessment-review":"Review Report","assessment-manual":"Manual Entry",personalize:"Personalize","context-confirm":"Final Check",processing:"Preparing Results",results:"Your Starting Point",auth:"Optional Sign In",dashboard:"Dashboard",history:"Assessment History","focus-detail":"Result Explanation",summary:"Trainer Guide",report:"Full FitMao Report",compare:"Compare",glossary:"Glossary","glossary-detail":"Glossary",profile:"Profile",research:"Research Comparison","not-found":"Page Not Found"};

function guardedRoute(route,state){
  if(route.name==="assessment-importing"){
    if(!state.importDraft){go("#/welcome");return null}
    if(state.importDraft.extractionStatus==="failed"){go("#/assessment/add");return null}
    if(["complete","partial"].includes(state.importDraft.extractionStatus)&&state.draftAssessment){go("#/assessment/review");return null}
  }
  if(route.name==="assessment-review"&&!state.draftAssessment){go(state.importDraft?.extractionStatus==="failed"?"#/assessment/add":"#/welcome");return null}
  if(route.name==="personalize"&&!state.draftAssessment?.verified){go("#/assessment/review");return null}
  if(route.name==="context-confirm"&&(!state.draftAssessment?.verified||!state.ui.personalizationComplete)){go(state.draftAssessment?.verified?"#/personalize":"#/assessment/review");return null}
  if(route.name==="processing"&&!state.assessments.length){go("#/context/confirm");return null}
  if(["results","focus-detail","summary"].includes(route.name)&&!state.latestResult){go(state.assessments.length?"#/dashboard":"#/welcome");return null}
  if(["report","history"].includes(route.name)&&!state.assessments.length){go("#/welcome");return null}
  if(["profile","research"].includes(route.name)&&!state.profile){go("#/welcome");return null}
  return route;
}

function render(){
  clearTimeout(processingTimer);clearTimeout(importTimer);dirty=false;
  const state=store.get(),route=guardedRoute(matchRoute(),state);if(!route)return;
  const map={
    welcome:()=>views.welcomeView(),
    "assessment-add":()=>views.assessmentAddView(state),
    "assessment-importing":()=>views.importingView(state,previewObjectUrl),
    "assessment-review":()=>views.assessmentReviewView(state,previewObjectUrl),
    "assessment-manual":()=>views.manualEntryView(state),
    personalize:()=>views.personalizationView(state),
    "context-confirm":()=>views.contextView(state),
    processing:()=>views.processingView(),
    results:()=>views.resultsView(state),
    auth:()=>views.authView(state),
    dashboard:()=>views.dashboardView(state),
    history:()=>views.historyResultView(state,route.params[0]),
    "focus-detail":()=>views.focusDetailView(state,route.params[0]),
    summary:()=>views.summaryView(state),
    report:()=>views.fullReportView(state),
    compare:()=>views.compareView(state),
    glossary:()=>views.glossaryView(),
    "glossary-detail":()=>views.glossaryDetailView(state,route.params[0]),
    profile:()=>views.profileView(state),
    research:()=>views.researchView(state),
    "not-found":()=>views.notFoundView()
  };
  const content=(map[route.name]||map["not-found"])();
  app.innerHTML=route.name==="welcome"||route.name==="auth"?content:guidedRoutes.includes(route.name)?guidedShell(content,route.name,titles[route.name],state):appShell(content,route.name,state,titles[route.name]);
  if(route.name==="auth"&&!state.profile?.email){const email=app.querySelector("#auth-email");if(email){email.value="";email.placeholder="you@example.com"}}
  document.title=`${titles[route.name]||"FITSTART"} — FITSTART`;
  window.scrollTo(0,0);
  requestAnimationFrame(()=>document.querySelector("h1")?.focus({preventScroll:true}));
  if(route.name==="assessment-importing")runImporting();
  if(route.name==="processing")runProcessing();
  const meta=store.meta();
  if(meta.storageCorrupt&&!corruptionShown){corruptionShown=true;setTimeout(()=>modal({title:"Saved data needs a safe reset",body:"<p>FITSTART could not read the saved prototype data. You can safely remove it and restart.</p>",confirmText:"Safe Reset",danger:true,onConfirm:()=>{store.clear();go("#/welcome")}}),0)}
  if(!meta.storageAvailable)setTimeout(()=>toast("Browser storage is unavailable. Changes may last only for this session."),0);
}

const formValue=(form,name)=>form.elements[name]?.value?.trim?.()??form.elements[name]?.value??"";
const formError=(form,key,message)=>{const target=form.querySelector(`[data-error="${key}"]`);if(target){target.textContent=message;target.focus?.()} };
const metricIsNumeric=metric=>metric.unit!=="—"&&!['segmental-fat','body-type'].includes(metric.id);
const blankDraft=()=>({id:"draft",assessedAt:new Date().toISOString().slice(0,10),sourceType:"manual",verified:false,demographics:{displayName:"",age:"",gender:"",height:"",assessmentDate:new Date().toISOString().slice(0,10)},metrics:metricDefinitions.map(metric=>({...metric,value:"",status:"Not provided",available:false,captureStatus:"manual"}))});

function releasePreview(){if(previewObjectUrl){URL.revokeObjectURL(previewObjectUrl);previewObjectUrl=null}previewZoom=1}

function beginImport(importDraft){store.setImportDraft(importDraft);go(importDraft.extractionStatus==="camera-ready"?"#/assessment/add":"#/assessment/importing")}

function privacyDisclosure(onConfirm,confirmText){modal({title:"Before you use your report",body:"<p>A FitMao report can contain personal assessment information.</p><p>In this frontend prototype, uploaded image bytes remain only in the current browser session and are not sent to a real server. Automatic reading is simulated.</p>",confirmText,cancelText:"Not now",onConfirm})}

function handleReportFile(file){
  const validation=validateReportFile(file);
  if(!validation.ok){const failed=createImportDraft("image-upload",file?.name||"");failed.extractionStatus="failed";failed.errorType="file-validation";failed.errorMessage=validation.message;store.setImportDraft(failed);go("#/assessment/add");return}
  releasePreview();previewObjectUrl=URL.createObjectURL(file);beginImport(createImportDraft("image-upload",file.name));
}

function saveManual(form,navigate){
  const draft=store.get().draftAssessment||blankDraft();
  draft.demographics={displayName:formValue(form,"displayName"),age:formValue(form,"age"),gender:formValue(form,"gender"),height:formValue(form,"height"),assessmentDate:formValue(form,"assessmentDate")};
  draft.assessedAt=draft.demographics.assessmentDate;
  draft.metrics=draft.metrics.map(metric=>{const raw=formValue(form,metric.id),numeric=metricIsNumeric(metric);return{...metric,value:raw===""?"":numeric?Number(raw):raw,status:raw===""?"Not provided":metric.status||"Not provided",available:raw!=="",captureStatus:"manual"}});
  const importDraft={...createImportDraft("manual","Manual entry"),extractionStatus:"complete",demographics:{...draft.demographics},metrics:draft.metrics.map(metric=>({...metric}))};
  store.update(state=>{state.draftAssessment=draft;state.importDraft=importDraft;return state});
  toast("Manual draft saved on this device.");if(navigate)go("#/assessment/review");
}

function completeExtraction(){
  const state=store.get(),extraction=simulateExtraction(state.importDraft,state.assessments.length);
  if(extraction.extractionStatus==="failed"){store.setImportDraft(extraction);go("#/assessment/add");return}
  const assessment=assessmentFromExtraction(extraction);
  store.update(d=>{d.importDraft=extraction;d.draftAssessment=assessment;if(extraction.sourceType==="demo"&&!d.profile)d.profile={...fictionalDemoProfile};return d});
  go("#/assessment/review");
}

function runImporting(){
  const state=store.get(),draft=state.importDraft;if(!draft)return;
  if(draft.extractionStatus==="queued")store.update(d=>{d.importDraft.extractionStatus="extracting";d.ui.importStep=0;return d});
  importTimer=setTimeout(()=>{const current=store.get(),step=current.ui.importStep||0;if(step<4){store.update(d=>{d.ui.importStep=step+1;return d});render()}else completeExtraction()},300);
}

function runProcessing(){
  const items=[...document.querySelectorAll("[data-process]")];let index=0;
  const tick=()=>{items.forEach((item,i)=>item.classList.toggle("is-done",i<index));if(index>items.length){store.generateResult();go("#/results");return}index++;processingTimer=setTimeout(tick,260)};tick();
}

document.addEventListener("submit",event=>{
  const form=event.target;dirty=false;
  if(form.id==="auth-form"){
    event.preventDefault();if(!form.reportValidity())return;store.startSession(form.dataset.mode==="signin"?"prototype-email-signin":"prototype-email-create");toast("Prototype account access enabled.");go(store.get().latestResult?"#/dashboard":"#/welcome");
  }
  if(form.id==="manual-form"){
    event.preventDefault();const required=["displayName","assessmentDate","weight","pbf","smm"].filter(name=>formValue(form,name)==="");if(required.length)return formError(form,"manual","Enter the member name, assessment date, body weight, body fat percentage, and muscle mass.");const invalid=["weight","pbf","smm"].some(name=>!Number.isFinite(Number(formValue(form,name))));if(invalid)return formError(form,"manual","Enter valid numbers for body weight, body fat percentage, and muscle mass.");saveManual(form,true);
  }
  if(form.id==="review-form"){
    event.preventDefault();const state=store.get(),draft=structuredClone(state.draftAssessment),source=state.importDraft;
    const details={displayName:formValue(form,"displayName"),age:formValue(form,"age"),gender:formValue(form,"gender"),height:formValue(form,"height"),assessmentDate:formValue(form,"assessmentDate")};
    if(!details.displayName||!details.assessmentDate)return formError(form,"review","Check the member name and assessment date before continuing.");
    let invalidMetric="";
    draft.metrics=draft.metrics.map(metric=>{const raw=formValue(form,`metric-${metric.id}`),numeric=metricIsNumeric(metric);if(raw!==""&&numeric&&!Number.isFinite(Number(raw)))invalidMetric=metric.name;const original=source?.metrics?.find(item=>item.id===metric.id);const changed=String(original?.value??"")!==String(raw)||String(original?.status??"")!==String(formValue(form,`status-${metric.id}`));return{...metric,value:raw===""?"":numeric?Number(raw):raw,status:formValue(form,`status-${metric.id}`),available:raw!=="",captureStatus:raw===""?"missing":changed?"corrected":metric.captureStatus||"extracted"}});
    if(invalidMetric)return formError(form,"review",`Enter a valid number for ${invalidMetric}.`);
    const missing=["weight","pbf","smm"].filter(id=>!draft.metrics.find(metric=>metric.id===id)?.available);if(missing.length)return formError(form,"review","Body weight, body fat percentage, and muscle mass are required.");
    if(!form.elements.reviewed.checked)return formError(form,"review","Confirm that you reviewed the values against your FitMao report.");
    draft.demographics=details;draft.assessedAt=details.assessmentDate;const editedMetricIds=draft.metrics.filter(metric=>metric.captureStatus==="corrected").map(metric=>metric.id);store.verifyDraft(draft,{...source,demographics:details,metrics:draft.metrics,editedMetricIds});go("#/personalize");
  }
  if(form.id==="personalization-form"){
    event.preventDefault();const primary=formValue(form,"primaryGoal"),secondary=formValue(form,"secondaryGoal"),experience=formValue(form,"fitnessExperience"),familiarity=formValue(form,"assessmentFamiliarity");
    if(!primary||!experience||!familiarity)return formError(form,"personalization","Choose a primary goal, experience level, and explanation preference.");
    if(primary===secondary&&secondary)return formError(form,"personalization","Choose a different secondary goal or leave it blank.");
    const details=store.get().draftAssessment.demographics||{};store.update(d=>{d.profile={...(d.profile||{}),id:d.profile?.id||"local-member",displayName:details.displayName,email:d.profile?.email||"",primaryGoal:primary,secondaryGoal:secondary,fitnessExperience:experience,assessmentFamiliarity:familiarity};d.ui.personalizationComplete=true;return d});go("#/context/confirm");
  }
  if(form.id==="profile-form"){
    event.preventDefault();const state=store.get(),updated={displayName:formValue(form,"displayName"),primaryGoal:formValue(form,"primaryGoal"),secondaryGoal:formValue(form,"secondaryGoal"),fitnessExperience:formValue(form,"fitnessExperience"),assessmentFamiliarity:formValue(form,"assessmentFamiliarity")};if(!updated.displayName)return formError(form,"profile","Enter a name or nickname.");if(updated.primaryGoal===updated.secondaryGoal&&updated.secondaryGoal)return formError(form,"profile","Choose a different secondary goal.");const save=()=>{store.update(d=>{Object.assign(d.profile,updated);return d});store.generateResult();toast("Profile saved and results recalculated.");render()};if(updated.primaryGoal!==state.profile.primaryGoal)modal({title:"Goal Update Notice",body:`<p>Your main goal changed from <strong>${label(state.profile.primaryGoal)}</strong> to <strong>${label(updated.primaryGoal)}</strong>. FITSTART will recalculate your priorities using your new goal.</p>`,confirmText:"Save and Recalculate",onConfirm:save});else save();
  }
});

document.addEventListener("change",event=>{
  if(event.target.closest("form"))dirty=true;
  if(["report-upload","welcome-report-upload"].includes(event.target.id)){const file=event.target.files?.[0];if(file)handleReportFile(file)}
  if(event.target.matches("[data-review-confirm]")){const button=document.querySelector("[data-confirm-review]");if(button)button.disabled=!event.target.checked}
  if(event.target.matches('[data-action="toggle-research"]')){store.update(d=>{d.ui.researchMode=event.target.checked;return d});toast(`Research Mode ${event.target.checked?"enabled":"disabled"}.`);render()}
});

document.addEventListener("input",event=>{if(event.target.closest("form"))dirty=true;if(event.target.id==="glossary-search")filterGlossary()});

document.addEventListener("click",async event=>{
  const link=event.target.closest("a[href^='#/']");if(link&&dirty&&!confirm("Leave this form? Unsaved changes may be lost.")){event.preventDefault();return}
  const sectionLink=event.target.closest('a[href="#how-it-works"]');if(sectionLink){event.preventDefault();document.querySelector("#how-it-works")?.scrollIntoView({behavior:"smooth"});return}
  const control=event.target.closest("[data-action]");const action=control?.dataset.action;
  if(action==="open-boundaries")modal({title:"What FITSTART does and does not do",body:"<p><strong>FITSTART does:</strong> import verified FitMao values, group related measurements, connect them with your stated goal, and explain what to review first.</p><p><strong>FITSTART does not:</strong> diagnose, predict disease, prescribe workouts or diets, manage gym membership, or replace a qualified professional.</p>",confirmText:"I understand"});
  if(action==="request-upload"){const inputId=control.dataset.uploadInput||"report-upload";privacyDisclosure(()=>document.getElementById(inputId)?.click(),"Choose report")}
  if(action==="request-qr")privacyDisclosure(()=>beginImport(createImportDraft("qr-scan","FitMao QR source")),"Continue to camera")
  if(action==="explore-demo"){releasePreview();beginImport(createImportDraft("demo","Fictional FitMao demonstration report"))}
  if(action==="begin-camera"){
    try{if(!navigator.mediaDevices?.getUserMedia)throw new Error("Camera unavailable");const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});stream.getTracks().forEach(track=>track.stop());store.update(d=>{d.importDraft.extractionStatus="queued";return d});go("#/assessment/importing")}catch(error){store.update(d=>{d.importDraft.extractionStatus="failed";d.importDraft.errorType="camera-denied";d.importDraft.errorMessage="Camera access was not available. Enable camera permission in your browser, upload the report, or use manual entry.";return d});render()}
  }
  if(action==="use-simulated-qr"){store.update(d=>{d.importDraft.extractionStatus="queued";return d});go("#/assessment/importing")}
  if(action==="qr-not-found"){store.update(d=>{d.importDraft.extractionStatus="failed";d.importDraft.errorType="qr-not-found";d.importDraft.errorMessage="No valid FitMao QR code was found. Try scanning again, upload the report, or use manual entry.";return d});render()}
  if(action==="cancel-import"||action==="retry-report"){releasePreview();store.update(d=>{d.importDraft=null;d.draftAssessment=null;d.ui.importStep=0;return d});go("#/assessment/add")}
  if(action==="save-manual")saveManual(control.closest("form"),false)
  if(action==="edit-assessment"){store.update(d=>{d.draftAssessment.verified=false;if(d.importDraft)d.importDraft.memberVerified=false;return d});go("#/assessment/review")}
  if(action==="create-results"){
    const state=store.get(),draft=structuredClone(state.draftAssessment);const commit=()=>{store.confirmAssessment(draft);store.generateResult();releasePreview();go("#/processing")};if(state.assessments.length>=2&&!draft.editingAssessmentId)modal({title:"Replace the oldest report?",body:"<p>This prototype compares only your two newest assessments. Continuing replaces the oldest saved report.</p>",confirmText:"Replace oldest report",onConfirm:commit});else commit();
  }
  if(action==="preview-zoom-in"||action==="preview-zoom-out"){previewZoom=Math.min(2,Math.max(.75,previewZoom+(action==="preview-zoom-in" ? .25 : -.25)));const preview=document.querySelector("[data-report-preview]");if(preview)preview.style.transform=`scale(${previewZoom})`;const zoomLabel=document.querySelector("[data-zoom-label]");if(zoomLabel)zoomLabel.textContent=`${Math.round(previewZoom*100)}%`}
  if(action==="auth-tab"){}
  const authTab=event.target.closest("[data-auth-tab]");if(authTab){document.querySelectorAll("[data-auth-tab]").forEach(button=>button.classList.toggle("is-active",button===authTab));const form=document.querySelector("#auth-form");if(form){form.dataset.mode=authTab.dataset.authTab;form.querySelector('button[type="submit"]').textContent=authTab.dataset.authTab==="signin"?"Sign In to Prototype":"Create Prototype Account"}}
  if(action==="prototype-google"){store.startSession("prototype-google");toast("Simulated Google access enabled.");go(store.get().latestResult?"#/dashboard":"#/welcome")}
  if(action==="forgot-password")modal({title:"Prototype notice",body:"<p>Password recovery is not connected in this frontend prototype.</p>",confirmText:"Close"})
  if(action==="continue-guest"){store.continueAsGuest();go(store.get().latestResult?"#/dashboard":"#/welcome")}
  if(action==="print-summary")window.print();
  if(action==="sign-out"){store.signOut();go("#/welcome")}
  if(action==="clear-data")modal({title:"Clear Demo Data?",body:"<p>This removes the locally saved profile, reports, and settings from this browser.</p>",confirmText:"Clear Demo Data",danger:true,onConfirm:()=>{releasePreview();store.clear();go("#/welcome")}})
  const filter=event.target.closest("[data-glossary-filter]");if(filter){document.querySelectorAll("[data-glossary-filter]").forEach(button=>button.classList.toggle("is-active",button===filter));filterGlossary()}
  const researchTab=event.target.closest("[data-research-tab]");if(researchTab){const id=researchTab.dataset.researchTab;document.querySelectorAll("[data-research-tab]").forEach(button=>button.classList.toggle("is-active",button===researchTab));document.querySelectorAll("[data-research-panel]").forEach(panel=>panel.classList.toggle("is-active",panel.dataset.researchPanel===id))}
});

function filterGlossary(){const q=(document.querySelector("#glossary-search")?.value||"").toLowerCase(),category=document.querySelector("[data-glossary-filter].is-active")?.dataset.glossaryFilter||"all";let count=0;document.querySelectorAll("[data-glossary-card]").forEach(card=>{const show=(!q||card.dataset.name.includes(q))&&(category==="all"||card.dataset.category===category);card.hidden=!show;if(show)count++});const empty=document.querySelector("#glossary-empty");if(empty)empty.hidden=count>0}

window.addEventListener("beforeunload",event=>{if(dirty){event.preventDefault();event.returnValue=""}});
window.addEventListener("error",()=>{if(!app.innerHTML.trim())app.innerHTML='<main class="fallback" id="main-content"><h1>FITSTART could not display this page.</h1><p>Return to <a href="#/welcome">Welcome</a>. Your saved data has not been removed.</p></main>'});
startRouter(render);
