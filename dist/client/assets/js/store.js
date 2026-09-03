import { scoreAssessment } from "./services/priority-service.js";

const KEY = "fitstartPrototypeV2";
const LEGACY_KEY = "fitstartPrototypeV1";
const listeners = new Set();
let storageAvailable = true;
let storageCorrupt = false;

const initial = () => ({
  version:2, profile:null, assessments:[], draftAssessment:null, draftSurvey:null, latestResult:null,
  ui:{onboardingComplete:false,lastRoute:"#/welcome",dismissedNotices:[],recentMetrics:[],research:{viewedFirst:null,startedAt:null,answers:{}}}
});

function read() {
  try {
    localStorage.removeItem(LEGACY_KEY);
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial();
    const parsed = JSON.parse(raw);
    if (parsed.version !== 2 || !parsed.ui) throw new Error("Incompatible data");
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
  clear() { state=initial(); storageCorrupt=false; try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY)}catch(error){storageAvailable=false} listeners.forEach(fn=>fn(store.get())); }
};
