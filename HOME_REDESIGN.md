# Home redesign — validation and media

Implemented in `src/views/HomeView.vue` and `src/views/home-editorial.css`. All styling is scoped to the home page. Existing brand tokens, translations, article data, booking/shop links and shared navigation/footer are retained.

Reference: https://www.loudr.be/en/ — opened using an independent Chrome session. Observed full-bleed hero, oversized introduction, category selection, stacked product presentation and alternating media/text. No claim of identical motion timing or measured superiority.

Media: only existing project images are used. No LOUDR media copied. Existing photographs are illustrative; provenance/licenses were not supplied in this task. No external media imported.

Video remains incomplete: Higgsfield credentials are not configured; Pexels retrieval failed; reviewed Mixkit clips 32065 and 13039 require commercial licensing. Static photography is the fallback, not a completed video implementation.

Validation:
- npm run build (includes vue-tsc): passed.
- Four existing node test suites: passed.
- ui-regression.mjs: passed, including mobile menu/language/store interactions.
- ui-motion-review.mjs: passed, including reduced motion and selection indicator.
- Browser checks at 390/768/1440, fa/en: no horizontal document overflow, broken images or runtime exceptions. End key moves both selection and focus to final brand. Reduced-motion animation is disabled.
- Full-page screenshots reviewed; fixed mobile hero coverage and English selector rendering. Final CSS also restores third journal card at tablet widths and removes inherited English hero indentation.
- Trail graph rebuilt successfully.

Limits: no Lighthouse/Core Web Vitals or comparative performance scores measured; no video playback validation possible. Reference interaction study was partial. No deployment performed.
