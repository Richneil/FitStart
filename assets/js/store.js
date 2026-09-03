import { rankFocusAreas } from "./services/ranking-service.js";
import { createStorageService } from "./services/storage-service.js";
import { demoProfile } from "./data/demo-data.js";
import { demoAssessments } from "./data/fitmao-metrics.js";

const KEY="fitstartPrototypeV2";
const storage=createStorageService(KEY);
let corrupt=false;
const listeners=new Set();
const initial=()=>({version:2,session:{signedIn:false,authMethod:null},profile:null,assessments:[],draftAssessment:null,latestResult:null,ui:{onboardingComplete:false,onboardingStep:1,lastRoute:"#/welcome",researchMode:false,dismissedNotices:[],isDemo:false}});
function read(){const raw=storage.read();if(!raw)return initial();try{const value=JSON.parse(raw);if(value.version!==2||!value.session||!value.ui)throw new Error("Invalid state");return value}catch(error){corrupt=true;return initial()}}
let state=read();
const persist=()=>storage.write(JSON.stringify(state));

export const store={
  get:()=>structuredClone(state),meta:()=>({storageAvailable:storage.available(),storageCorrupt:corrupt}),
  subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
  update(fn,save=true){const draft=structuredClone(state);state=fn(draft)||draft;if(save)persist();listeners.forEach(fn=>fn(store.get()))},
  startSession(method="email-demo"){store.update(d=>{d.session={signedIn:true,authMethod:method};return d})},
  loadDemo(){state=initial();state.session={signedIn:true,authMethod:"explore-demo"};state.profile=structuredClone(demoProfile);state.assessments=structuredClone(demoAssessments);state.ui={...state.ui,onboardingComplete:true,isDemo:true};const ranked=rankFocusAreas(state.assessments.at(-1),state.profile);state.latestResult={assessmentId:state.assessments.at(-1).id,generatedAt:new Date().toISOString(),ranking:ranked};persist();listeners.forEach(fn=>fn(store.get()))},
  confirmAssessment(assessment){store.update(d=>{const confirmed={...assessment,verified:true,id:assessment.editingAssessmentId||`assessment-${Date.now()}`};delete confirmed.editingAssessmentId;const index=d.assessments.findIndex(item=>item.id===confirmed.id);if(index>=0)d.assessments[index]=confirmed;else d.assessments=[...d.assessments,confirmed].slice(-2);d.draftAssessment=null;d.latestResult=null;return d})},
  generateResult(){store.update(d=>{const assessment=d.assessments.at(-1);const ranking=rankFocusAreas(assessment,d.profile);d.latestResult={assessmentId:assessment?.id||null,generatedAt:new Date().toISOString(),ranking};return d})},
  signOut(){store.update(d=>{d.session={signedIn:false,authMethod:null};return d})},
  clear(){state=initial();corrupt=false;storage.remove();listeners.forEach(fn=>fn(store.get()))}
};
