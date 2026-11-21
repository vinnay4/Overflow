# AI use declaration (required by the brief: "state what it helped with and verify the claims and calculations you retain")
*Edit to match reality before submitting. The short version goes on appendix page 4.*

**Short version (for the appendix):**
> We used AI assistants (Grok Bot and Cursor) to: search for and summarise literature on milk foaming, boiling acoustics and prior solutions; draft the dimensional analysis and model equations; write the code for the simulator, the Ubaal detector app and the analysis scripts; and draft slide text. All observations, trial data, photos and videos are our own and were recorded by us on __ Nov 2026. We checked every retained citation against its source (DOI or URL), re-derived the key calculations by hand (×1602 expansion, 0.88 L/s steam, Π, t\*), ran all tests, and tuned the detector only on our own recordings. Model outputs are labelled as estimates. Final decisions, scoring weights and judgements are ours.

**Detail**
| Item | AI role | Human verification |
|---|---|---|
| Literature search (R1–R40) | Found and summarised sources | Opened the key DOIs/URLs; corrected 1 wrong attribution during drafting (the specific-heat source is Minim et al. 2002) |
| Π derivation, transformers | Drafted | Re-derived by hand; units checked |
| Simulator, Ubaal app, Python scripts | Generated code | Ran tests (5/5, 3/3); read the code; ran on our phones |
| Alternatives scores | Proposed initial scores | Team re-scored and agreed weights from our constraints |
| Slide/appendix text | Drafted | Rewritten in our voice; every number checked against trials.csv |
| Data | **None generated for results.** The one synthetic file is marked EXAMPLE and is used only to test the pipeline | – |
