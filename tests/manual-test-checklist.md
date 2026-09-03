# FITSTART Test Checklist

Updated September 3, 2026 for the test-user frontend.

## Core journey

- [x] Welcome has one primary **Get started** action.
- [x] Maria, demo shortcuts, and sample-person result previews are removed.
- [x] Profile setup asks only for a name, main goal, and assessment experience.
- [x] Assessment capture offers screenshot upload and QR preview only.
- [x] Test-version limitations are explained before users continue.
- [x] Assessment review allows every prefilled value and report label to be corrected.
- [x] Mandatory confirmation is required before results are created.
- [x] The repeated five-step survey and confirmation screen are removed from the main journey.
- [x] The confirmed assessment now leads directly to result preparation.
- [x] Home highlights one first result before secondary actions.
- [x] Results explain what came first, why, and what to understand next.
- [x] The **Write down one question** task and Quick Wins section are removed.

## Language and navigation

- [x] Main navigation is limited to Home, Add Assessment, My Results, Glossary, and Profile.
- [x] My Results is unavailable until a result exists.
- [x] Technical metric names use readable labels such as **Body fat estimate**, **Muscle mass**, and **Resting energy estimate**.
- [x] The glossary keeps familiar abbreviations while using everyday definitions.
- [x] Report labels use **Within expected range**, **Worth reviewing**, and **Review first**.
- [x] Scoring details are translated into report label, goal connection, and result position.
- [x] Professional-guidance language remains visible.

## State and safety

- [x] Version 2 starts previous demo users with a clean test session.
- [x] The browser storage key is `fitstartPrototypeV2`.
- [x] Legacy `fitstartPrototypeV1` data is removed safely.
- [x] Clear saved data removes the profile and assessment state after confirmation.
- [x] Only the two newest confirmed assessments are kept.
- [x] Missing values are excluded instead of counted as zero.
- [x] No workout, meal plan, diagnosis, or disease-risk prediction is generated.

## Automated checks

- [x] All JavaScript modules pass syntax validation.
- [x] Eleven primary page states render successfully in `tests/smoke-render.mjs`.
- [x] Rendered primary pages contain no Maria copy, demo entry point, or removed question task.
- [x] The deployment structure includes its client files and Worker entry point.

## Pending professional decisions

- [ ] Confirm the final FitMao metrics, report labels, and transfer format.
- [ ] Professionally review priority rules, goal mappings, relationships, and thresholds.
- [ ] Approve measurement definitions and sources.
- [ ] Confirm final privacy, consent, and test-research protocol.
