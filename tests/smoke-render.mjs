import { sampleAssessments } from "../assets/js/data/fitmao-metrics.js";
import { fictionalDemoProfile, fictionalDemoMember } from "../assets/js/data/demo-data.js";
import { rankFocusAreas } from "../assets/js/services/ranking-service.js";
import { createImportDraft, validateReportFile } from "../assets/js/services/report-import-service.js";
import { simulateExtraction, assessmentFromExtraction } from "../assets/js/services/extraction-service.js";
import { matchRoute } from "../assets/js/router.js";
import * as views from "../assets/js/views/all-views.js";
import { welcomeView } from "../assets/js/views/welcome-view.js";
import { readinessView } from "../assets/js/views/readiness-view.js";
import { resultActionsView } from "../assets/js/views/result-actions-view.js";
import { assessmentAddView } from "../assets/js/views/assessment-add-view.js";
import { readinessQuestions, readinessGuidance } from "../assets/js/data/readiness-questions.js";
import { guidedShell, guestShell } from "../assets/js/components/navigation.js";

const profile={...fictionalDemoProfile};
const assessments=structuredClone(sampleAssessments).map((assessment,index)=>({...assessment,assessedAt:index?"2026-09-05":"2026-08-05",demographics:{...fictionalDemoMember,assessmentDate:index?"2026-09-05":"2026-08-05"}}));
const importDraft=simulateExtraction(createImportDraft("demo","Fictional FitMao demonstration report"),0);
const draftAssessment={...assessmentFromExtraction(importDraft),verified:true};
const ranking=rankFocusAreas(assessments.at(-1),profile);
const readiness={answers:Object.fromEntries(readinessQuestions.map(question=>[question.id,"no"])),completed:true,hasPositive:false,completedAt:"2026-09-05T00:00:00.000Z"};
const full={version:3,session:{mode:"saved-account",signedIn:true,authMethod:"prototype-email"},profile,importDraft,draftAssessment,resultAssessment:assessments.at(-1),readiness,assessments,latestResult:{assessmentId:assessments.at(-1).id,ranking},ui:{personalizationComplete:true,lastRoute:"#/results",researchMode:true,importStep:3,dismissedNotices:[],authIntent:null}};
const empty={...full,session:{mode:"guest-demo",signedIn:false,authMethod:null},profile:null,importDraft:null,draftAssessment:null,resultAssessment:null,readiness:{answers:{},completed:false,hasPositive:false,completedAt:null},assessments:[],latestResult:null,ui:{...full.ui,personalizationComplete:false,researchMode:false}};
const guestResult={...full,session:{mode:"guest-demo",signedIn:false,authMethod:null},assessments:[],resultAssessment:assessments.at(-1)};
const camera={...empty,importDraft:createImportDraft("qr-scan","FitMao QR source")};
const failed={...empty,importDraft:{...createImportDraft("image-upload","unreadable.png"),extractionStatus:"failed",errorMessage:"We could not read this report clearly."}};

const pages=[
  welcomeView(),assessmentAddView(empty),assessmentAddView(camera),assessmentAddView(failed),views.importingView(full),
  views.assessmentReviewView(full),readinessView(full),views.personalizationView(full),views.contextView(full),views.processingView(),
  views.resultsView(full),views.authView(full),views.dashboardView(empty),views.dashboardView(full),views.historyResultView(full,assessments[0].id),
  views.focusDetailView(full,"bodyFat"),views.summaryView(full),views.fullReportView(full),views.glossaryView(),views.glossaryDetailView(full,"pbf"),
  views.compareView(full),views.profileView(full),views.researchView(full),views.notFoundView()
];

for(const [index,html] of pages.entries()){
  if(!/<h1\b/i.test(html))throw new Error(`Screen ${index+1} has no H1.`);
  if(/Sample workspace|Write down one question|Quick Wins|First Steps|AI is thinking|TODO|href="#"(?:\s|>)/i.test(html))throw new Error(`Screen ${index+1} contains excluded, unfinished, or dead copy.`);
}

const welcome=welcomeView();
if(!welcome.includes("Scan FitMao QR")||!welcome.includes("Upload FitMao Report"))throw new Error("Welcome does not expose both automatic-first actions.");
if(welcome.includes("Start my assessment review")||welcome.includes("Create My Profile"))throw new Error("Welcome still forces a generic start action.");
if(welcome.includes("Enter values manually")||welcome.includes("Maria")||welcome.includes("fictional demo"))throw new Error("Welcome still exposes removed manual or demo choices.");
if([assessmentAddView(empty),assessmentAddView(camera),assessmentAddView(failed)].some(html=>/Enter values manually|Maria|fictional demo/i.test(html)))throw new Error("Report entry still exposes removed manual or demo choices.");
if(!views.importingView(full).includes("Reading Report")||!views.importingView(full).includes("Ready to Review"))throw new Error("Automatic extraction progress is incomplete.");
if(!views.assessmentReviewView(full).includes("I reviewed these values")||!views.assessmentReviewView(full).includes("Captured report details"))throw new Error("Review verification or demographics are missing.");
const readinessHtml=readinessView(full);
if((readinessHtml.match(/class="card readiness-question"/g)||[]).length!==7||(readinessHtml.match(/required/g)||[]).length!==14||!readinessHtml.includes("PAR-Q-style")||!readinessHtml.includes("does not change how FITSTART ranks")||!readinessGuidance.includes("healthcare provider"))throw new Error("The seven-question readiness check or its limits are incomplete.");
if(!views.personalizationView(full).includes("primary fitness goal")||views.personalizationView(full).includes("What should we call you"))throw new Error("Personalization asks the wrong questions.");
if(!views.contextView(full).includes("Yes, Create My Results"))throw new Error("Final context confirmation is missing.");
if(!views.authView(guestResult).includes("simulated")||!views.authView(guestResult).includes("Continue without saving"))throw new Error("Optional authentication disclosure is incomplete.");
if(ranking.mainFocus?.id!=="bodyFat")throw new Error(`Expected body fat as the starting point, received ${ranking.mainFocus?.id}.`);
if(ranking.mainFocus.supporting.filter(item=>["Under","Over"].includes(item.status)).length<2)throw new Error("Body-fat supporting evidence is incomplete.");
if(!views.compareView(full).includes("two newest confirmed reports"))throw new Error("Two-report comparison is missing.");
const dashboard=views.dashboardView(full);
if(!dashboard.includes("dashboard-member-hero")||!dashboard.includes("Hi, Test Member")||!dashboard.includes("Current goal"))throw new Error("The simplified member-and-goal Dashboard hero is missing.");
if(dashboard.includes("Save this result?")||dashboard.includes("dashboard-tools"))throw new Error("Removed Dashboard panels are still present.");
if(!dashboard.includes("Assessment history")||!dashboard.includes("View interpreted results"))throw new Error("Assessment history is missing from Dashboard.");
if(validateReportFile({type:"text/plain",size:20}).ok)throw new Error("Unsupported report files are accepted.");
if(!validateReportFile({type:"image/png",size:1024}).ok)throw new Error("Valid report files are rejected.");
const guestActions=resultActionsView(guestResult);
if(!guestActions.includes("Save My Assessment for History")||!guestActions.includes("Export / Print for Trainer")||guestActions.includes("Open Dashboard")||guestActions.includes("View Complete FitMao Report"))throw new Error("Guest result actions expose the wrong features.");
if(!guidedShell("<h1>Readiness</h1>","readiness","Readiness Check",guestResult).includes("Step 4 of 7")||!guestShell("<h1>Result</h1>","Your Starting Point",guestResult).includes("Viewing as guest"))throw new Error("Guided or guest navigation does not match the new access flow.");
if(matchRoute("#/assessment/importing").name!=="assessment-importing"||matchRoute("#/readiness").name!=="readiness"||matchRoute("#/personalize").name!=="personalize"||matchRoute("#/assessment/manual").name!=="not-found")throw new Error("The guided sequence routes are not connected correctly.");

console.log(`${pages.length} screens rendered; readiness, guest access, verification gates, and deterministic ranking passed.`);
