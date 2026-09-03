import { rankFocusAreas } from "./services/ranking-service.js";
import { createStorageService } from "./services/storage-service.js";
const KEY="fitstartTestUserV3";
const LEGACY_KEY="fitstartPrototypeV2";
const storage=createStorageService(KEY);
let corrupt=false;
const listeners=new Set();
const initial=()=>({version:3,session:{signedIn:false,authMethod:null},profile:null,assessments:[],draftAssessment:null,latestResult:null,ui:{onboardingComplete:false,onboardingStep:1,lastRoute:"#/welcome",researchMode:false,dismissedNotices:[]}});
function read(){try{localStorage.removeItem(LEGACY_KEY)}catch(error){}const raw=storage.read();if(!raw)return initial();try{const value=JSON.parse(raw);if(value.version!==3||!value.session||!value.ui)throw new Error("Invalid state");return value}catch(error){corrupt=true;return initial()}}
let state=read();
const persist=()=>storage.write(JSON.stringify(state));

export const store={
  get:()=>structuredClone(state),meta:()=>({storageAvailable:storage.available(),storageCorrupt:corrupt}),
  subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
  update(fn,save=true){const draft=structuredClone(state);state=fn(draft)||draft;if(save)persist();listeners.forEach(fn=>fn(store.get()))},
  startSession(method="test-session"){store.update(d=>{d.session={signedIn:true,authMethod:method};return d})},
  confirmAssessment(assessment){store.update(d=>{const confirmed={...assessment,verified:true,id:assessment.editingAssessmentId||`assessment-${Date.now()}`};delete confirmed.editingAssessmentId;delete confirmed.notice;delete confirmed.previewUrl;const index=d.assessments.findIndex(item=>item.id===confirmed.id);if(index>=0)d.assessments[index]=confirmed;else d.assessments=[...d.assessments,confirmed].slice(-10);d.draftAssessment=null;d.latestResult=null;return d})},
  generateResult(){store.update(d=>{const assessment=d.assessments.at(-1);const ranking=rankFocusAreas(assessment,d.profile);d.latestResult={assessmentId:assessment?.id||null,generatedAt:new Date().toISOString(),ranking};return d})},
  signOut(){store.update(d=>{d.session={signedIn:false,authMethod:null};return d})},
  clear(){state=initial();corrupt=false;storage.remove();try{localStorage.removeItem(LEGACY_KEY)}catch(error){}listeners.forEach(fn=>fn(store.get()))}
};
