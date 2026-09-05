import { sampleAssessments } from "../assets/js/data/fitmao-metrics.js";
import { fictionalDemoProfile, fictionalDemoMember } from "../assets/js/data/demo-data.js";
import { rankFocusAreas } from "../assets/js/services/ranking-service.js";
import { createImportDraft, validateReportFile } from "../assets/js/services/report-import-service.js";
import { simulateExtraction, assessmentFromExtraction } from "../assets/js/services/extraction-service.js";
import { matchRoute } from "../assets/js/router.js";
import * as views from "../assets/js/views/all-views.js";

const profile={...fictionalDemoProfile};
const assessments=structuredClone(sampleAssessments).map((assessment,index)=>({...assessment,assessedAt:index?"2026-09-05":"2026-08-05",demographics:{...fictionalDemoMember,assessmentDate:index?"2026-09-05":"2026-08-05"}}));
const importDraft=simulateExtraction(createImportDraft("demo","Fictional FitMao demonstration report"),0);
const draftAssessment={...assessmentFromExtraction(importDraft),verified:true};
const ranking=rankFocusAreas(assessments.at(-1),profile);
const full={version:3,session:{mode:"guest-demo",signedIn:false,authMethod:null},profile,importDraft,draftAssessment,assessments,latestResult:{assessmentId:assessments.at(-1).id,ranking},ui:{personalizationComplete:true,lastRoute:"#/results",researchMode:true,importStep:3,dismissedNotices:[]}};
const empty={...full,profile:null,importDraft:null,draftAssessment:null,assessments:[],latestResult:null,ui:{...full.ui,personalizationComplete:false,researchMode:false}};
const camera={...empty,importDraft:createImportDraft("qr-scan","FitMao QR source")};
const failed={...empty,importDraft:{...createImportDraft("image-upload","unreadable.png"),extractionStatus:"failed",errorMessage:"We could not read this report clearly."}};

const pages=[
  views.welcomeView(),views.assessmentAddView(empty),views.assessmentAddView(camera),views.assessmentAddView(failed),views.importingView(full),
  views.manualEntryView(empty),views.assessmentReviewView(full),views.personalizationView(full),views.contextView(full),views.processingView(),
  views.resultsView(full),views.authView(full),views.dashboardView(empty),views.dashboardView(full),views.historyResultView(full,assessments[0].id),
  views.focusDetailView(full,"bodyFat"),views.summaryView(full),views.fullReportView(full),views.glossaryView(),views.glossaryDetailView(full,"pbf"),
  views.compareView(full),views.profileView(full),views.researchView(full),views.notFoundView()
];

for(const [index,html] of pages.entries()){
  if(!/<h1\b/i.test(html))throw new Error(`Screen ${index+1} has no H1.`);
  if(/Sample workspace|Write down one question|Quick Wins|First Steps|AI is thinking|TODO|href="#"(?:\s|>)/i.test(html))throw new Error(`Screen ${index+1} contains excluded, unfinished, or dead copy.`);
}

const welcome=views.welcomeView();
if(!welcome.includes("Scan FitMao QR")||!welcome.includes("Upload FitMao Report"))throw new Error("Welcome does not expose both automatic-first actions.");
if(welcome.includes("Start my assessment review")||welcome.includes("Create My Profile"))throw new Error("Welcome still forces a generic start action.");
if(!welcome.includes("Having trouble? Enter values manually")||!welcome.includes("fictional demo report"))throw new Error("Welcome recovery or demo path is missing.");
if(!views.importingView(full).includes("Reading Report")||!views.importingView(full).includes("Ready to Review"))throw new Error("Automatic extraction progress is incomplete.");
if(!views.assessmentReviewView(full).includes("I reviewed these values")||!views.assessmentReviewView(full).includes("Captured report details"))throw new Error("Review verification or demographics are missing.");
if(!views.personalizationView(full).includes("primary fitness goal")||views.personalizationView(full).includes("What should we call you"))throw new Error("Personalization asks the wrong questions.");
if(!views.contextView(full).includes("Yes, Create My Results"))throw new Error("Final context confirmation is missing.");
if(!views.authView(full).includes("simulated")||!views.authView(full).includes("Continue without saving"))throw new Error("Optional authentication disclosure is incomplete.");
if(ranking.mainFocus?.id!=="bodyFat")throw new Error(`Expected body fat as the starting point, received ${ranking.mainFocus?.id}.`);
if(ranking.mainFocus.supporting.filter(item=>["Under","Over"].includes(item.status)).length<2)throw new Error("Body-fat supporting evidence is incomplete.");
if(!views.compareView(full).includes("two newest confirmed reports"))throw new Error("Two-report comparison is missing.");
if(!views.dashboardView(full).includes("Assessment history")||!views.dashboardView(full).includes("View interpreted results"))throw new Error("Assessment history is missing from Dashboard.");
if(validateReportFile({type:"text/plain",size:20}).ok)throw new Error("Unsupported report files are accepted.");
if(!validateReportFile({type:"image/png",size:1024}).ok)throw new Error("Valid report files are rejected.");
if(matchRoute("#/assessment/importing").name!=="assessment-importing"||matchRoute("#/personalize").name!=="personalize")throw new Error("New sequence routes are not connected.");

console.log(`${pages.length} screens rendered; automatic-first flow, verification gates, and deterministic ranking passed.`);
