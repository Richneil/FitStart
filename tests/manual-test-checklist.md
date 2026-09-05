# FITSTART Manual Test Checklist

Updated September 5, 2026 for the v3 automatic-first prototype sequence.

## Automated evidence

- [x] All JavaScript modules pass syntax validation.
- [x] Twenty-four major screen and edge states render successfully.
- [x] The same confirmed values always produce the same starting point.
- [x] Import validation accepts PNG, JPG, and PDF and rejects unsupported files.
- [x] The new import, verification, personalization, and results routes are connected.

## Complete sequence

- [ ] Welcome opens with equally clear **Scan FitMao QR** and **Upload FitMao Report** actions.
- [ ] No profile, generic start, or sign-in gate appears before importing a report.
- [ ] A privacy notice appears before camera or file access.
- [ ] Camera access starts only after the user chooses Scan.
- [ ] Upload accepts PNG, JPG, and PDF within the stated size limit.
- [ ] Reading progress moves through upload, detection, extraction, and ready states.
- [ ] The review screen shows the source preview, demographics, all available values, and captured/corrected/missing labels.
- [ ] Results stay locked until the required verification checkbox is selected.
- [ ] Personalization asks only the four required fitness-context questions.
- [ ] The final check provides **Edit Assessment**, **Change My Answers**, and **Yes, Create My Results**.
- [ ] Results appear as a guest before optional simulated sign-in.

## Recovery and limits

- [ ] Denied camera access explains how to retry, upload, or use manual entry.
- [ ] Missing QR and unreadable-report states provide clear recovery actions.
- [ ] Invalid type and oversized-file messages explain the accepted formats and limit.
- [ ] Manual entry is available as a fallback but is not promoted as the main path.
- [ ] The fictional Maria Santos demo appears only after **Explore a fictional demo** is selected.
- [ ] The demo and automatic reading are clearly disclosed as simulated.
- [ ] A third confirmed report requires replacing an existing one; only two remain stored.
- [ ] Comparison stays locked until two confirmed reports exist.
- [ ] Corrupted or unavailable browser storage fails safely without losing the current screen.

## Results and understanding

- [ ] The educational notice appears before the main result.
- [ ] Main Focus appears before ranked supporting priorities.
- [ ] Every priority explains why it was selected in everyday language.
- [ ] Trainer guidance encourages discussion without giving medical, workout, or diet prescriptions.
- [ ] Dashboard history reopens each confirmed assessment's interpreted results.
- [ ] The full report preserves official FitMao terms beside simpler names.
- [ ] Glossary search, filters, related terms, and limitations work.
- [ ] Research details remain inside the Profile's optional researcher controls.

## Navigation, accessibility, and responsive checks

- [ ] Test the complete journey without a mouse; focus remains visible and logical.
- [ ] The skip link, headings, labels, inline errors, dialog focus, and live notices are understandable with a screen reader.
- [ ] Important controls have at least 44-pixel touch targets.
- [ ] Text and controls remain readable at 200% browser zoom.
- [ ] Check widths 360, 390, 768, 1024, and 1440 pixels with no unintended horizontal scrolling.
- [ ] Desktop sidebar and mobile bottom navigation use the same familiar destinations.
- [ ] Reloading or using Back during each step returns to a safe, understandable state.
- [ ] No browser-console errors occur through the complete flow.

## Required expert review before production

- [ ] Validate the FitMao import contract, metric definitions, ranges, and labels.
- [ ] Validate focus grouping, goal relevance, evidence scoring, and tie order.
- [ ] Approve glossary sources and member-facing explanations.
- [ ] Define real authentication, consent, privacy, security, and data-retention requirements.
- [ ] Conduct moderated usability and comprehension testing with new gym members.
