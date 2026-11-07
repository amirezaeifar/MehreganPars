# Forest identity update

- Dark forest #063d2f, evergreen #12614a, mineral white #edf2f0.
- Local Lalezar display font for Persian/Arabic brand lettering. SIL Open Font License included in public/fonts/Lalezar-OFL.txt. Source: https://github.com/google/fonts/tree/main/ofl/lalezar
- Original vector care-contours.svg for solutions heading and footer.
- Two AI-generated illustrative photographs: forest-care-hero.png and forest-care-dialogue.png. Generated with imagegen on 2026-11-02 for this project. They do not depict actual Mehregan staff/premises. Originals retained; prior photos not deleted. Other existing photos remain.
- Three-way locale picker; Arabic RTL, persistence and core home/navigation translation. Missing Arabic entries explicitly fall back to existing English; full site Arabic localization is not complete.
- Centered desktop wordmark, left/right navigation groups, booking action and mobile expandable menu.

Validation: build/typecheck passed; Arabic at 390/768/1440 has no document overflow, broken images or runtime exceptions. Keyboard End selection and reduced motion passed. Existing two-language toggle regression test needs adapting to the new select control; not claimed as passing for this update.
