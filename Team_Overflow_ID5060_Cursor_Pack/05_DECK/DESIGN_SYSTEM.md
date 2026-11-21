# Design system (as implemented in deck/deck.css and 04_ANALYSIS/style.py; keep them in sync)

- **Canvas:** 1920×1080 per slide, padding 64/84/56 px, flex rows and columns (`.row`, `.col`), white cards (`.card`, 22 px radius).
- **Palette (CSS variables):** background cream `--bg #FAF7F0` · ink `--ink #1F2A33` · muted `#6b6357` · **accent burnt orange `--accent #C2410C`** (chosen solution, kicker, big numbers) · amber `--accent2 #f59e0b` (refinement) · blue `#1d4ed8` (physics/model) · green `#15803d` (success) · red `#b91c1c` (overflow) · violet `#7c3aed` (spare). Charts use the same values (`style.py`).
- **Type:** headlines in **Fraunces** (serif, 58 px on content slides, 84 px on the title). Body in **DM Sans** 22 px. Equations in **JetBrains Mono** 21 px on a beige block (`.eq`). Loaded from Google Fonts with system fallbacks, so it works offline with fallback fonts.
- **Assertion-evidence style:** every headline is a full-sentence claim. The evidence sits below it.
- **Honesty tags:** `.tag.m` blue = **MODEL**, `.tag.e` amber = **ESTIMATE / assumed**, `.tag.r` green = **MEASURED / real**. Model figures carry the italic stamp "MODEL ESTIMATE — not measured" (`style.stamp`).
- **TO FILL:** `.tofill` = dashed orange striped box. It must be gone before submission.
- **Imagery:** our own photos first; diagrams second; no stock photos. The product name **उबाल (Ubaal)** appears on S4 and in the app.
