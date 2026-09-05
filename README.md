# FITSTART Frontend Prototype

FITSTART helps new KSYN Fitness Alabang members understand a FitMao body-composition report in a clear, guided sequence.

It is an educational frontend prototype. It does not diagnose conditions, clear someone for exercise, prescribe workouts or diets, or replace a healthcare provider or qualified fitness professional.

## Latest update — complete guest-to-member flow

- Starts with **Scan FitMao QR** or **Upload FitMao Report**.
- Automatically presents captured details for the user to check.
- Adds a required seven-question **PAR-Q-style physical activity readiness check** before personalization.
- Shows a safety notice when any readiness answer is **Yes**; answers never change result ranking.
- Lets guests view their interpretation, personalized priorities, glossary, and printable trainer guide.
- Uses **Save My Assessment for History** as the sign-up/sign-in point.
- Reserves Dashboard, assessment history, full reports, comparison, and profile tools for signed-in prototype users.
- Removes the Maria demo and manual-entry choices from the test-user journey.

## Download or pull from GitHub

First download:

```powershell
git clone https://github.com/Richneil/FitStart.git
cd FitStart
```

Already downloaded:

```powershell
cd FitStart
git pull origin main
```

## Run locally

No installation or build step is required:

```powershell
python -m http.server 4173
```

Open `http://127.0.0.1:4173/#/welcome`.

## Complete test-user sequence

1. Scan a FitMao QR code or upload a PNG, JPG, or PDF report.
2. Accept the privacy notice before camera or file access.
3. Wait while FITSTART simulates reading the report.
4. Check the captured identity and assessment values against the report.
5. Confirm that the values are correct.
6. Answer all seven physical activity readiness questions.
7. If any answer is **Yes**, read the safety guidance and continue only to view the educational explanation.
8. Choose a main fitness goal and explanation preferences.
9. Review the final summary and create the result.
10. View the interpretation and personalized priorities as a guest.
11. Export or print the trainer guide, or choose **Save My Assessment for History**.
12. Sign up or sign in to save, open the Dashboard, keep assessment history, and compare two saved reports.

## Main pages

| Route | Purpose |
|---|---|
| `#/welcome` | Scan or upload a FitMao report |
| `#/assessment/add` | Add or retry a report |
| `#/assessment/importing` | Simulated report-reading progress |
| `#/assessment/review` | Check captured details and values |
| `#/readiness` | Required PAR-Q-style readiness questions |
| `#/personalize` | Goal and explanation preferences |
| `#/context/confirm` | Final check before results |
| `#/processing` | Brief results-preparation state |
| `#/results` | Guest-accessible interpretation and priorities |
| `#/summary` | Printable trainer discussion guide |
| `#/sign-in` | Simulated sign-up/sign-in used for saving |
| `#/dashboard` | Saved result and assessment history |
| `#/history/:assessmentId` | Reopen a saved assessment |
| `#/report` | All values from a saved report |
| `#/compare` | Compare the two newest saved reports |
| `#/glossary` | Plain-language FitMao terms |
| `#/profile` | Saved profile and prototype settings |

## Project structure

- `index.html` starts the application.
- `assets/js/router.js` connects routes and preserves the sequence.
- `assets/js/store.js` keeps prototype state in this browser.
- `assets/js/data/readiness-questions.js` contains the seven readiness questions and safety guidance.
- `assets/js/services/` contains report import, extraction, ranking, explanation, and comparison logic.
- `assets/js/views/` contains screens and access-specific actions.
- `assets/css/` contains design tokens, layout, components, and responsive rules.
- `tests/` contains automated and manual checks.

## Prototype limitations

- QR decoding, OCR, authentication, cloud saving, and backend storage are simulated or not connected.
- Because real extraction is not connected, the prototype supplies sample values that every tester must verify and correct against their report.
- Uploaded file bytes remain in the current browser session.
- A guest result may remain in browser storage for the current prototype session, but it is not added to assessment history until sign-in and save.
- The browser stores at most two saved assessments.
- The PAR-Q-style wording and handling require health-professional, legal, and licensing review before production use.
- Metric definitions, ranges, ranking rules, privacy, consent, and retention behavior also require expert approval.

## Verify the build

```powershell
node tests/smoke-render.mjs
```

Then follow `tests/manual-test-checklist.md` for the full browser journey.
