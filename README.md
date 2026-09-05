# FITSTART Frontend Prototype

FITSTART helps new KSYN Fitness Alabang members understand a FitMao body-composition report. The experience starts with the report, explains unfamiliar terms in everyday language, and shows which result may be most relevant to the member's goal.

This is an educational frontend prototype. It does not diagnose conditions, predict health risks, prescribe workouts or diets, or replace a qualified fitness professional.

## Latest update — automatic-first flow

- Starts immediately with **Scan FitMao QR** or **Upload FitMao Report**.
- Shows a privacy notice before opening the camera or file picker.
- Simulates report reading, then asks the tester to check all imported details.
- Collects only the fitness context needed to personalize the explanation.
- Shows results before asking the tester to sign in or save anything.
- Keeps manual entry as a recovery option, not the main path.
- Includes an optional, clearly labelled fictional Maria Santos demo.
- Stores at most two confirmed assessments for a simple comparison.

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

No installation or build step is required. From the project folder:

```powershell
python -m http.server 4173
```

Open `http://127.0.0.1:4173/#/welcome`.

## Complete test-user sequence

1. On Welcome, scan a FitMao QR code or upload a PNG, JPG, or PDF report.
2. Read and accept the privacy notice before the camera or file picker opens.
3. Watch the simulated report-reading progress.
4. Check the imported member details and report values against the source preview.
5. Correct a value if needed, then tick the verification checkbox.
6. Answer four short questions about goals, experience, and explanation preference.
7. Review the final summary and choose **Yes, Create My Results**.
8. View the educational starting point as a guest.
9. Optionally use the simulated sign-in to demonstrate saving a session.
10. Add one more report to unlock the two-report comparison.

If scanning or uploading does not work, the user can retry, switch methods, or enter the report manually. **Explore a fictional demo** loads disclosed sample data only when selected.

## Main pages

| Route | Purpose |
|---|---|
| `#/welcome` | Direct QR scan, upload, recovery, and fictional-demo choices |
| `#/assessment/add` | Add or retry a report |
| `#/assessment/importing` | Simulated reading progress and source preview |
| `#/assessment/review` | Verify imported demographics and measurements |
| `#/assessment/manual` | Manual recovery form |
| `#/personalize` | Four short fitness-context questions |
| `#/context/confirm` | Final check before results are created |
| `#/processing` | Brief results-preparation state |
| `#/results` | Starting point, ranked priorities, and explanations |
| `#/sign-in` | Optional simulated save/sign-in screen |
| `#/dashboard` | Goal, newest result, and assessment history |
| `#/history/:assessmentId` | Reopen one confirmed assessment |
| `#/results/focus/:focusId` | Explain one result area in depth |
| `#/summary` | Printable trainer discussion guide |
| `#/report` | All confirmed FitMao values |
| `#/compare` | Compare the two confirmed reports |
| `#/glossary` | Search plain-language FitMao terms |
| `#/profile` | Profile, stored prototype data, and research controls |

## Project structure

- `index.html` starts the application.
- `assets/js/router.js` connects URLs to screens and preserves the sequence.
- `assets/js/store.js` stores the `fitstartPrototypeV3` session in this browser.
- `assets/js/data/demo-data.js` contains the optional fictional demo identity and context.
- `assets/js/data/fitmao-metrics.js`, `ranking-rules.js`, and `glossary-data.js` contain report content and explanation rules.
- `assets/js/services/report-import-service.js` validates files and creates a normalized import draft.
- `assets/js/services/extraction-service.js` produces disclosed simulated extraction results.
- `assets/js/views/` contains the screens; `assets/js/components/` contains reusable interface pieces.
- `assets/css/` contains design tokens, layout, components, and responsive rules.
- `tests/` contains automated and manual checks.

## Prototype limitations

- QR decoding, OCR, account authentication, cloud saving, and backend storage are simulated or not connected.
- Uploaded file bytes stay only in the current browser session and are not saved in local storage.
- The sample report, including Maria Santos, is fictional and appears only through the demo option.
- The browser stores up to two confirmed assessments on the current device.
- Metric definitions, ranges, focus rules, privacy, consent, and retention behavior require expert approval before production.

## Verify the build

Run:

```powershell
node tests/smoke-render.mjs
```

Then follow `tests/manual-test-checklist.md` to test the full browser journey, responsive layouts, accessibility, and recovery states.
