# FITSTART Manual Test Checklist

Tested on September 1, 2026 against the local static prototype.

## Core journey

- [x] Welcome explains the educational purpose before collecting information.
- [x] Create My Starting Point opens Profile Setup.
- [x] Explore Demo loads Maria's fictional profile and two fictional assessments.
- [x] Profile validation requires a display name, primary goal, and experience.
- [x] Secondary goal cannot match the primary goal.
- [x] Demo, manual, screenshot simulation, and QR simulation entry methods are present.
- [x] Screenshot/QR simulation notice remains visible.
- [x] Assessment review supports edit, mark unavailable, reset, category review, and mandatory confirmation.
- [x] The five-step survey saves a draft and supports Back/Continue.
- [x] Confirm screen shows assessment, goal, experience, activities, availability, and barriers.
- [x] Changed main goal displays the Goal Update Notice before recalculation.
- [x] Processing uses transparent non-AI wording and reaches Results.
- [x] Complete UI journey was exercised from assessment entry through Results with no console errors.

## Results and rule behavior

- [x] The same demo inputs deterministically select Body-Fat Percentage as Main Focus.
- [x] Main Focus and Top Priorities preserve original value, unit, and demo category.
- [x] Every priority shows traceable “You told us” and “Your assessment showed” evidence.
- [x] Priority score, explanation depth, and Quick Win selection are separate services.
- [x] Technical breakdown shows each demo point contribution and validation warning.
- [x] Missing values are excluded rather than silently scored as zero.
- [x] Insufficient data has an honest recovery state.
- [x] Professional-guidance reminder is visible without opening an accordion.
- [x] Full unprocessed assessment is available from Results.
- [x] No screen generates a workout, calorie target, meal plan, diagnosis, or disease-risk prediction.

## Comparison and learning

- [x] Compare is locked with an explanation until two assessments exist.
- [x] Comparison uses only latest and immediately previous assessments.
- [x] Differences use increased, decreased, or no measured change.
- [x] Goal-direction language appears only for configured approved rules.
- [x] Large differences trigger verification language.
- [x] No chart, streak, forecast, third assessment, or success/failure claim is shown.
- [x] Metric Library supports search, category filters, recent items, detail pages, limitations, related metrics, and source placeholders.
- [x] Research comparison uses identical fictional values and neutral condition labels.
- [x] Research view records first-view condition, time start, and comprehension responses locally.

## State and edge cases

- [x] One versioned local-storage key is used: `fitstartPrototypeV1`.
- [x] Only two assessments are retained.
- [x] Clear Demo Data uses confirmation and removes prototype state.
- [x] Storage-unavailable state explains that the session can continue without persistence.
- [x] Corrupt/incompatible state opens a safe reset path.
- [x] Invalid route provides a Dashboard recovery link.
- [x] Runtime fallback prevents an intentionally blank screen.

## Accessibility and responsive review

- [x] Every reviewed route has one H1, no duplicate IDs, and no unlabeled interactive control.
- [x] Semantic landmarks, form labels, aria-live regions, aria-expanded behavior, and visible focus styles are present.
- [x] Meaning is communicated with text and shape/icon, not color alone.
- [x] Reduced-motion preference is respected.
- [x] Touch controls are at least 44 px where applicable.
- [x] All 14 required routes were checked at 360, 768, 1024, and 1440 px with no horizontal page overflow.
- [x] Forty-five screenshots were captured: 15 views at desktop, tablet, and mobile sizes.

## Screenshots

Naming format: `{desktop-1440|tablet-768|mobile-360}-{screen}.png`.

Screens include Welcome, Profile Setup, Dashboard, Assessment Input, Assessment Review, Survey, Confirm, Processing, Results, Priority Detail, Compare, Library, Library Detail, Profile, and Research Comparison.

## Pending thesis-team decisions

- [ ] Confirm exact real FitMao metrics and source categories.
- [ ] Professionally review scoring weights, tie rules, goal mappings, relationship map, and difference thresholds.
- [ ] Approve metric definitions and sources.
- [ ] Confirm final survey choices, brand system, privacy model, and research tasks.
