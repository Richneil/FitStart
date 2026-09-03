# FITSTART Frontend Prototype

FITSTART is a browser-based guide for new KSYN Fitness Alabang members. It helps a member review a FitMao body-composition report, understand unfamiliar terms, and see which part of the report is most relevant to their stated goal.

FITSTART organizes and explains report information. It does not diagnose health conditions, predict risk, prescribe workouts or diets, or replace advice from a qualified fitness professional.

## Get the project from GitHub

For the first download:

```powershell
git clone https://github.com/Richneil/FitStart.git
cd FitStart
```

If the project is already on your computer:

```powershell
cd FitStart
git pull origin main
```

## Run it on your computer

No package installation or build step is needed. In the project folder, run:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/#/welcome` in a browser.

## What a test user does

1. Read the short introduction and start a local test session.
2. Enter a name or nickname, choose a goal, and select an explanation level.
3. Add a FitMao report by screenshot, QR test, or typed values.
4. Check the report values in six collapsible sections.
5. Confirm the member details used to organize the results.
6. View the recommended starting point and why it appears first.
7. Reopen any saved assessment from the Assessment History on Home.
8. Open a detailed explanation, a trainer discussion guide, all report values, or the term guide.
9. Add a second report to compare measured changes.

There is no named member demo and no fake sign-in. Every tester begins with a clean local profile. Old prototype data is removed automatically after this version is opened.

## Main pages

| Route | What it shows |
|---|---|
| `#/welcome` | Simple introduction and three-step overview |
| `#/sign-in` | Before-you-begin checklist for a local test session |
| `#/profile/setup` | Four short profile questions |
| `#/dashboard` | Home page, newest starting point, and assessment history |
| `#/history/:assessmentId` | Interpreted results for a saved assessment |
| `#/assessment/add` | Choose how to add a report |
| `#/assessment/manual` | Type report values |
| `#/assessment/review` | Check imported or typed values |
| `#/context/confirm` | Confirm goal and explanation preference |
| `#/results` | Starting point and next results to review |
| `#/results/focus/:focusId` | Detailed explanation for one result area |
| `#/summary` | Printable guide for talking with a trainer |
| `#/report` | Every confirmed report value |
| `#/compare` | Compare the two newest reports |
| `#/glossary` | Search and learn FitMao terms |
| `#/profile` | Profile, test data, and researcher controls |

## How the frontend is organized

- `index.html` starts the app and loads all styles and scripts.
- `assets/js/router.js` connects each URL to the correct screen.
- `assets/js/store.js` keeps one `fitstartTestUserV3` browser session.
- `assets/js/data/` contains goal choices, FitMao measurements, focus rules, and term explanations.
- `assets/js/services/` organizes results, explanations, comparisons, and browser storage.
- `assets/js/components/` contains reusable navigation, result cards, measurement rows, dialogs, and notices.
- `assets/js/views/` contains the complete pages.
- `assets/css/` contains colors, spacing, layout, components, pages, and mobile refinements.
- `tests/` contains the automated screen check and manual usability checklist.

## Important testing behavior

- QR and screenshot reading are not connected yet. Those options load clearly disclosed sample values so the report-review interface can be tested.
- Testers must check and confirm the values before results are created.
- Uploaded image bytes are not saved in browser storage.
- Up to 10 confirmed reports are kept in Assessment History; comparison uses the two newest.
- Profile and report data remain in the current browser until the tester clears them.
- Researcher controls are hidden inside a collapsed section in My Profile.

## Before production

The FitMao measurement definitions, ranges, focus rules, glossary sources, privacy behavior, consent flow, and real import services still require professional and technical approval. Moderated usability testing with new gym members is also required.

## Check the build

Run the automated screen and result check:

```powershell
node tests/smoke-render.mjs
```

Then follow `tests/manual-test-checklist.md` for the full route, mobile, accessibility, and wording review.
