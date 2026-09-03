import { demoAssessments } from "../assets/js/data/demo-assessments.js";
import {
  welcomeView,
  profileSetupView,
  dashboardView,
  assessmentImportView,
  assessmentReviewView,
  resultsView,
  metricDetailView,
  learnView,
  learnMetricView,
  profileView
} from "../assets/js/views/ux-pages.js";

const profile = {
  id: "local-member",
  displayName: "Alex",
  primaryGoal: "fat-loss",
  secondaryGoal: "",
  experience: "new",
  activities: [],
  availability: "",
  expectations: [],
  barriers: []
};

const assessment = structuredClone(demoAssessments.at(-1));
assessment.id = "assessment-test";
assessment.sourceType = "screenshot";
assessment.fileName = "assessment.png";

const emptyState = {profile, assessments:[], draftAssessment:null, latestResult:null, ui:{recentMetrics:[]}};
const reviewState = {...emptyState, draftAssessment:assessment};
const resultState = {...emptyState, assessments:[assessment], latestResult:{assessmentId:assessment.id}};

const pages = [
  welcomeView(),
  profileSetupView(emptyState),
  dashboardView(emptyState),
  assessmentImportView(emptyState),
  assessmentReviewView(reviewState),
  dashboardView(resultState),
  resultsView(resultState),
  metricDetailView(resultState, "body-fat-percentage"),
  learnView(resultState),
  learnMetricView(resultState, "body-fat-percentage"),
  profileView(resultState)
];

for (const [index, html] of pages.entries()) {
  if (!html.includes("<h1") && !html.includes("<h2")) throw new Error(`Rendered page ${index + 1} has no heading.`);
  if (/Maria|Preview with[^<]*demo|Use demo assessment|Write down one question/i.test(html)) throw new Error(`Rendered page ${index + 1} contains removed tester copy.`);
}

if (!assessmentImportView(emptyState).includes("Upload a report screenshot")) throw new Error("Assessment upload is missing.");
if (!resultsView(resultState).includes("First result to understand")) throw new Error("Core result guidance is missing.");

console.log(`${pages.length} primary page renders passed.`);
