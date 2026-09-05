import { sampleAssessments } from "../assets/js/data/fitmao-metrics.js";
import { rankFocusAreas } from "../assets/js/services/ranking-service.js";
import * as views from "../assets/js/views/all-views.js";

const profile={
  id:"local-member",
  displayName:"Alex",
  primaryGoal:"fat-loss",
  secondaryGoal:"understand-results",
  fitnessExperience:"new",
  assessmentFamiliarity:"not-familiar"
};
const assessments=structuredClone(sampleAssessments);
const ranking=rankFocusAreas(assessments.at(-1),profile);
const full={version:3,session:{signedIn:true,authMethod:"test-session"},profile,assessments,draftAssessment:{...assessments.at(-1),verified:false},latestResult:{assessmentId:assessments.at(-1).id,ranking},ui:{onboardingStep:1,onboardingComplete:true,researchMode:true}};
const empty={...full,assessments:[],draftAssessment:null,latestResult:null,ui:{...full.ui,researchMode:false}};

const pages=[
  views.welcomeView(),views.authView(),views.onboardingView(empty),views.dashboardView(empty),views.dashboardView(full),views.assessmentAddView(),
  views.manualEntryView({...empty,draftAssessment:null}),views.assessmentReviewView(full),views.contextView(full),views.processingView(),
  views.resultsView(full),views.historyResultView(full,assessments[0].id),views.focusDetailView(full,"bodyFat"),views.summaryView(full),views.fullReportView(full),
  views.glossaryView(),views.glossaryDetailView(full,"pbf"),views.compareView(full),views.profileView(full),
  views.researchView(full),views.notFoundView()
];

for(const [index,html] of pages.entries()){
  if(!/<h1\b/i.test(html))throw new Error(`Screen ${index+1} has no H1.`);
  if(/Explore Demo|Sample workspace|Continue with Google|Email address|Password|Write down one question|Quick Wins|First Steps|AI is thinking/i.test(html))throw new Error(`Screen ${index+1} contains confusing or excluded copy.`);
  if(/TODO|href="#"(?:\s|>)/i.test(html))throw new Error(`Screen ${index+1} contains unfinished or dead UI.`);
}
if(ranking.mainFocus?.id!=="bodyFat")throw new Error(`Expected body fat as the starting point, received ${ranking.mainFocus?.id}.`);
if(ranking.mainFocus.supporting.filter(item=>["Under","Over"].includes(item.status)).length<2)throw new Error("Body-fat supporting evidence is incomplete.");
if(views.assessmentAddView().includes("Type the values yourself"))throw new Error("Manual report entry still appears in the main journey.");
if(!views.welcomeView().includes("Scan or upload your report")||!views.welcomeView().includes("Confirm or correct them"))throw new Error("Welcome does not explain the scan, review, and confirmation flow.");
if(!views.assessmentReviewView(full).includes("Does this look right?"))throw new Error("Imported details do not ask for confirmation.");
if(!views.compareView(empty).includes("second FitMao assessment"))throw new Error("Locked comparison state is missing.");
if(!views.dashboardView(full).includes("Assessment history")||!views.dashboardView(full).includes("View interpreted results"))throw new Error("Assessment history is missing from Home.");
if(!views.historyResultView(full,assessments[0].id).includes("Earlier saved assessment"))throw new Error("Saved assessment results cannot be reopened.");
console.log(`${pages.length} screens rendered; test-user wording and deterministic ranking passed.`);
