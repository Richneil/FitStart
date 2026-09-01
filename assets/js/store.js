import { demoProfile } from "./data/demo-profile.js";
import { demoAssessments } from "./data/demo-assessments.js";
import { scoreAssessment } from "./services/priority-service.js";

const KEY = "fitstartPrototypeV1";
const listeners = new Set();
let storageAvailable = true;
let storageCorrupt = false;

const initial = () => ({
  version:1, profile:null, assessments:[], draftAssessment:null, draftSurvey:null, latestResult:null,
  ui:{onboardingComplete:false,lastRoute:"#/welcome",dismissedNotices:[],recentMetrics:[],research:{viewedFirst:null,startedAt:null,answers:{}}}
});

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial();
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1 || !parsed.ui) throw new Error("Incompatible data");
    return parsed;
  } catch (error) {
    storageCorrupt = true;
    return initial();
  }
}

let state = read();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (error) { storageAvailable = false; }
}

export const store = {
  get: () => structuredClone(state),
  meta: () => ({storageAvailable,storageCorrupt}),
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  update(updater, persistChange=true) {
    const draft = structuredClone(state);
    state = updater(draft) || draft;
    if (persistChange) persist();
    listeners.forEach(fn => fn(store.get()));
  },
  loadDemo(twoAssessments=false) {
    const assessments = structuredClone(twoAssessments ? demoAssessments : [demoAssessments[1]]);
    const result = scoreAssessment(assessments.at(-1), demoProfile);
    state = {...initial(),profile:structuredClone(demoProfile),assessments,latestResult:{assessmentId:assessments.at(-1).id,generatedAt:new Date().toISOString(),mainFocusMetricId:result.mainFocus?.id,priorityMetricIds:[result.mainFocus,...result.priorities].filter(Boolean).map(x=>x.id),explanations:{}},ui:{...initial().ui,onboardingComplete:true,lastRoute:"#/dashboard"}};
    persist(); listeners.forEach(fn => fn(store.get()));
  },
  confirmAssessment(assessment) {
    store.update(draft => {
      const confirmed = {...assessment,verified:true,id:`assessment-${Date.now()}`};
      draft.assessments = [...draft.assessments,confirmed].slice(-2);
      draft.draftAssessment = null;
      return draft;
    });
  },
  generateResult() {
    store.update(draft => {
      const assessment = draft.assessments.at(-1);
      const result = scoreAssessment(assessment,draft.profile);
      draft.latestResult = {assessmentId:assessment?.id,generatedAt:new Date().toISOString(),mainFocusMetricId:result.mainFocus?.id||null,priorityMetricIds:[result.mainFocus,...result.priorities].filter(Boolean).map(x=>x.id),explanations:{}};
      return draft;
    });
  },
  clear() { state=initial(); storageCorrupt=false; try{localStorage.removeItem(KEY)}catch(error){storageAvailable=false} listeners.forEach(fn=>fn(store.get())); }
};
