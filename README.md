# FITSTART Frontend Prototype

FITSTART is a dependency-free, single-page educational prototype that helps a fictional newly registered gym member understand a completed FitMao-style body-composition assessment. It preserves the original measurements and adds a transparent, rule-based Personalized Starting Point.

## Get the project from GitHub

For the first download, open a terminal in the folder where you want to keep the project and run:

```powershell
git clone https://github.com/Richneil/FitStart.git
cd FitStart
```

If you already downloaded the project before, open its `FitStart` folder and get the newest changes with:

```powershell
git pull origin main
```

After pulling, follow **Run locally** below to open the prototype.

## Run locally

Serve this folder with any simple static web server, then open `index.html` through the server. For example:

```powershell
python -m http.server 4173
```

Then visit `http://127.0.0.1:4173/#/welcome`.

No package installation or build step is required.

## Prototype flow

1. Read the educational-use disclosure.
2. Create a lightweight profile or select **Explore Demo** for Maria's fictional scenario.
3. Choose the demo, screenshot-preview, or QR-preview assessment method.
4. Review and confirm every available value.
5. Complete the five-step contextual survey.
6. Confirm the profile and goal.
7. Review the transparent Personalized Starting Point.
8. Explore priority breakdowns, the Metric Mini-Library, the two-assessment comparison, and the research comparison.

## New-member experience principles

- One recommended next action is emphasized on each primary screen.
- Initial setup asks only for a name, main goal, and experience level; additional context is collected later in short steps.
- Assessment capture offers Demo, Screenshot Preview, and QR Preview. Manual value entry has been removed.
- The Dashboard summarizes one Main Focus before offering secondary actions.
- Results are explained in three stages: start here, understand why, then explore next steps.
- Technical scoring, metric connections, and the full report use progressive disclosure so they do not compete with the main explanation.
- Plain-language reassurance explains what is saved, what is simulated, and when professional guidance matters.

## Editable content map

- Demo profile and option labels: `assets/js/data/demo-profile.js`
- Fictional assessments: `assets/js/data/demo-assessments.js`
- Metric definitions, limitations, and related metrics: `assets/js/data/metric-library.js`
- Demonstration scoring weights, goal maps, relationships, thresholds, and tie order: `assets/js/data/rules.js`
- Priority calculation: `assets/js/services/priority-service.js`
- Explanation depth and Quick Wins: `assets/js/services/explanation-service.js`
- Two-assessment measured differences: `assets/js/services/comparison-service.js`
- Local state and the `fitstartPrototypeV1` storage key: `assets/js/store.js`
- Screen markup: `assets/js/views/pages.js`
- Design tokens: `assets/css/tokens.css`

## Simulated features

- Member authentication
- FitMao cloud or database access
- QR scanning
- Screenshot OCR or text extraction
- Backend API requests
- Professional verification
- Clinical or medical scoring

The screenshot selector keeps the chosen image temporary and does not store image bytes in browser storage. The prototype keeps at most two confirmed assessments and removes the oldest when a third is added.

## Production integrations still required

- Final FitMao metrics, labels, ranges, and data-transfer contract
- Expert-reviewed weights, goal relationships, cross-metric relationships, and large-difference thresholds
- Research-team-approved metric definitions and sources
- Authentication, privacy, consent, and personal-data protection decisions
- Real OCR/QR capture and mandatory server-side verification
- Backend persistence and production error monitoring
- Final brand identity and usability/comprehension research protocol

## Safety statement

This prototype uses fictional data and demonstration rules. It does not diagnose, predict disease risk, prescribe exercise or nutrition, prove health improvement, or replace a qualified fitness professional.

## Review evidence

Responsive screenshots for 15 main views are in `tests/screenshots/` at desktop (1440 px), tablet (768 px), and mobile (360 px). The completed manual checklist is in `tests/manual-test-checklist.md`.
