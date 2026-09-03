# FITSTART Frontend Prototype

FITSTART is a complete, dependency-free frontend prototype for KSYN Fitness Alabang. It helps a new gym member review a FitMao body-composition report, connect confirmed report information with a stated fitness goal, and understand which focus area to discuss first with a qualified fitness professional.

FITSTART organizes and explains information. It does not diagnose, predict health risk, prescribe workouts or diets, or replace the original FitMao report.

## Get the newest version from GitHub

First download:

```powershell
git clone https://github.com/Richneil/FitStart.git
cd FitStart
```

If the project is already on your computer:

```powershell
cd FitStart
git pull origin main
```

## Run locally

No package installation or build step is needed. From the project folder, run:

```powershell
python -m http.server 4173
```

Open `http://127.0.0.1:4173/#/welcome` in a browser.

## Main member journey

1. Create a simulated account or explicitly open the fictional sample workspace.
2. Complete the four short profile questions.
3. Add a FitMao report by simulated QR, screenshot, or manual entry.
4. Review every captured value, unit, printed range, and original report position.
5. Confirm the member's goal and assessment familiarity.
6. View a deterministic Personalized Starting Point.
7. Open a focus explanation, trainer discussion summary, complete source report, or glossary.
8. Add a second report to unlock the limited comparison.

The Maria Santos data appears only after choosing **Explore Demo** and is always marked as a sample workspace. The ordinary flow starts with an empty test-user profile.

## Routes

| Route | Purpose |
|---|---|
| `#/welcome` | Product introduction |
| `#/sign-in` | Simulated account access |
| `#/profile/setup` | Four-step member onboarding |
| `#/dashboard` | Member home and next action |
| `#/assessment/add` | Choose report-entry method |
| `#/assessment/manual` | Enter report sections manually |
| `#/assessment/review` | Verify captured source values |
| `#/context/confirm` | Confirm personal context |
| `#/processing` | Explain the ranking sequence |
| `#/results` | Personalized Starting Point |
| `#/results/focus/:focusId` | Full focus-area explanation |
| `#/summary` | Trainer Discussion Summary |
| `#/report` | Structured complete FitMao report |
| `#/compare` | Two-assessment comparison |
| `#/glossary` | Searchable metric glossary |
| `#/glossary/:metricId` | Metric definition and limitation |
| `#/profile` | Profile, Research Mode, and local-data controls |
| `#/research-comparison` | Neutral source-versus-FITSTART view |

## Architecture

- `index.html` contains the app mount, metadata, and stylesheet/module links.
- `assets/js/router.js` provides hash routing.
- `assets/js/store.js` owns the single `fitstartPrototypeV2` browser state.
- `assets/js/data/` contains editable report data, focus groupings, goal mappings, metric definitions, and glossary copy.
- `assets/js/services/` contains deterministic ranking, explanation, comparison, and local-storage behavior.
- `assets/js/components/` contains reusable navigation, focus, metric, modal, and notification components.
- `assets/js/views/` contains the screen renderers and route-specific exports.
- `assets/css/` separates reset, tokens, base rules, layout, components, pages, and responsive behavior.
- `tests/` contains automated screen-render checks and the manual acceptance checklist.

## Where to edit

- Fictional member and option labels: `assets/js/data/demo-data.js`
- Sanitized FitMao values and metric definitions: `assets/js/data/fitmao-metrics.js`
- Focus-area groupings, goal relevance, tie order, and thresholds: `assets/js/data/ranking-rules.js`
- Glossary content and source placeholders: `assets/js/data/glossary-data.js`
- Ranking calculation: `assets/js/services/ranking-service.js`
- Member-facing explanations: `assets/js/services/explanation-service.js`
- Comparison wording and measured differences: `assets/js/services/comparison-service.js`
- Colors, radii, and shadows: `assets/css/tokens.css`

## Simulated integrations

- Google and email authentication
- FitMao QR import
- Screenshot text extraction
- Backend/cloud storage

Screenshot image bytes are not stored in `localStorage`. The prototype keeps at most the two newest confirmed assessments. A clear warning appears before a third report replaces the oldest.

## Prototype limitations

- Ranking rules are demonstration rules pending fitness-professional validation.
- Metric definitions include research-source placeholders that must be approved before production.
- Account, QR, screenshot, and backend features are not connected to real services.
- All saved state is browser-local and intended only for prototype testing.
- The comparison reports measured differences; it does not claim success, failure, or proven improvement.

## Verify the build

Run the automated render and ranking check:

```powershell
node tests/smoke-render.mjs
```

Then follow `tests/manual-test-checklist.md` for the full route, responsive, accessibility, and content review.
