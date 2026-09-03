import { demoProfile } from "../assets/js/data/demo-data.js";
import { demoAssessments } from "../assets/js/data/fitmao-metrics.js";
import { rankFocusAreas } from "../assets/js/services/ranking-service.js";
import * as views from "../assets/js/views/all-views.js";

const profile=structuredClone(demoProfile);
const assessments=structuredClone(demoAssessments);
const ranking=rankFocusAreas(assessments.at(-1),profile);
const full={version:2,session:{signedIn:true},profile,assessments,draftAssessment:{...assessments.at(-1),verified:false},latestResult:{assessmentId:assessments.at(-1).id,ranking},ui:{onboardingStep:1,researchMode:true,isDemo:false}};
const empty={...full,assessments:[],draftAssessment:null,latestResult:null,ui:{...full.ui,researchMode:false}};

const pages=[
  views.welcomeView(),views.authView(),views.onboardingView(empty),views.dashboardView(empty),views.assessmentAddView(),
  views.manualEntryView({...empty,draftAssessment:null}),views.assessmentReviewView(full),views.contextView(full),views.processingView(),
  views.resultsView(full),views.focusDetailView(full,"bodyFat"),views.summaryView(full),views.fullReportView(full),
  views.glossaryView(),views.glossaryDetailView(full,"pbf"),views.compareView(full),views.profileView(full),
  views.researchView(full),views.notFoundView()
];

for(const [index,html] of pages.entries()){
  if(!/<h1\b/i.test(html))throw new Error(`Screen ${index+1} has no H1.`);
  if(/Write down one question|Quick Wins|First Steps|AI is thinking/i.test(html))throw new Error(`Screen ${index+1} contains excluded copy.`);
  if(/TODO|href="#"(?:\s|>)/i.test(html))throw new Error(`Screen ${index+1} contains unfinished or dead UI.`);
}
if(ranking.mainFocus?.id!=="bodyFat")throw new Error(`Expected Body Fat Main Focus, received ${ranking.mainFocus?.id}.`);
if(ranking.mainFocus.supporting.filter(item=>["Under","Over"].includes(item.status)).length<2)throw new Error("Body Fat supporting evidence is incomplete.");
if(!views.assessmentAddView().includes("Enter Values Manually"))throw new Error("Manual entry option is missing.");
if(!views.compareView(empty).includes("second FitMao assessment"))throw new Error("Locked comparison state is missing.");
console.log(`${pages.length} screens rendered; deterministic focus ranking passed.`);
