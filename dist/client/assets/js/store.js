import { rankFocusAreas } from "./services/ranking-service.js";
import { createStorageService } from "./services/storage-service.js";

const KEY="fitstartPrototypeV3";
const LEGACY_KEYS=["fitstartPrototypeV2","fitstartTestUserV3"];
const storage=createStorageService(KEY);
let corrupt=false;
const listeners=new Set();

const initial=()=>({
  version:3,
  session:{mode:"guest-demo",signedIn:false,authMethod:null},
  profile:null,
  importDraft:null,
  draftAssessment:null,
  resultAssessment:null,
  readiness:{answers:{},completed:false,hasPositive:false,completedAt:null},
  assessments:[],
  latestResult:null,
  ui:{personalizationComplete:false,lastRoute:"#/welcome",researchMode:false,importStep:0,dismissedNotices:[],authIntent:null}
});

function read(){
  try{LEGACY_KEYS.forEach(key=>localStorage.removeItem(key))}catch(error){}
  const raw=storage.read();
  if(!raw)return initial();
  try{
    const value=JSON.parse(raw);
    if(value.version!==3||!value.session||!value.ui)throw new Error("Invalid state");
    return {...initial(),...value,ui:{...initial().ui,...value.ui}};
  }catch(error){corrupt=true;return initial()}
}

let state=read();
const persist=()=>storage.write(JSON.stringify(state));

export const store={
  get:()=>structuredClone(state),
  meta:()=>({storageAvailable:storage.available(),storageCorrupt:corrupt}),
  subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
  update(fn,save=true){const draft=structuredClone(state);state=fn(draft)||draft;if(save)persist();listeners.forEach(fn=>fn(store.get()))},
  setImportDraft(importDraft){store.update(d=>{d.importDraft=importDraft;d.draftAssessment=null;d.resultAssessment=null;d.readiness=initial().readiness;d.ui.personalizationComplete=false;d.ui.importStep=0;return d})},
  verifyDraft(assessment,importDraft){store.update(d=>{d.draftAssessment={...assessment,verified:true};d.importDraft={...importDraft,memberVerified:true};d.readiness=initial().readiness;d.ui.personalizationComplete=false;return d})},
  completeReadiness(answers){store.update(d=>{d.readiness={answers:{...answers},completed:true,hasPositive:Object.values(answers).includes("yes"),completedAt:new Date().toISOString()};return d})},
  prepareResult(assessment){store.update(d=>{const confirmed={...assessment,verified:true,id:assessment.editingAssessmentId||`assessment-${Date.now()}`};delete confirmed.editingAssessmentId;delete confirmed.previewUrl;d.resultAssessment=confirmed;d.draftAssessment=null;d.importDraft=null;d.latestResult=null;return d})},
  saveCurrentAssessment(){let saved=null;store.update(d=>{const current=d.resultAssessment;if(!current||!d.session.signedIn)return d;saved={...current};const index=d.assessments.findIndex(item=>item.id===current.id);if(index>=0)d.assessments[index]=saved;else d.assessments=[...d.assessments,saved].slice(-2);d.ui.authIntent=null;return d});return saved},
  confirmAssessment(assessment){store.prepareResult(assessment)},
  generateResult(){store.update(d=>{const assessment=d.resultAssessment||d.assessments.at(-1);const ranking=rankFocusAreas(assessment,d.profile);d.latestResult={assessmentId:assessment?.id||null,generatedAt:new Date().toISOString(),ranking};return d})},
  startSession(method="prototype-email"){store.update(d=>{d.session={mode:"saved-account",signedIn:true,authMethod:method};return d})},
  continueAsGuest(){store.update(d=>{d.session={mode:"guest-demo",signedIn:false,authMethod:null};return d})},
  signOut(){store.update(d=>{d.session={mode:"guest-demo",signedIn:false,authMethod:null};return d})},
  clear(){state=initial();corrupt=false;storage.remove();try{LEGACY_KEYS.forEach(key=>localStorage.removeItem(key))}catch(error){}listeners.forEach(fn=>fn(store.get()))}
};
