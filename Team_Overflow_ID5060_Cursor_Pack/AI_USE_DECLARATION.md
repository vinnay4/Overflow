# AI use declaration (required by the brief: "state what it helped with and verify the claims and calculations you retain")
*Short version is on appendix page 4.*

**Short version (for the appendix):**
> We used Cursor and Grok to search and summarise the literature, draft the dimensional analysis, write the simulator, the Ubaal app and the analysis scripts, draft the slides and the appendix, and draft the Rimclip solid model. No kitchen observation, photograph, or trial row was generated. Model outputs are labelled estimates. Synthetic audio tests check software logic only. The clip is a design, not a test. Citations trace to URLs in `01_RESEARCH/REFERENCES.md`. The person submitting still has to open any source they are unsure of.

**Detail**
| Item | AI role | Human verification still required |
|---|---|---|
| Literature search (R1–R40) | Found and summarised sources already listed in the pack | Open the key DOIs or URLs before the viva. One attribution was corrected in the pack: specific heat is Minim et al. 2002 |
| Π derivation, transformers | Drafted, then re-checked against the Python and TypeScript models | The numbers in the appendix match `milk_model.py` as run on 21 Nov 2026 |
| Simulator, Ubaal app, Python scripts | Generated and edited | Tests: simulator 8/8 after the trial-import tests, detector 4/4 including the Hindi copy. Re-run before submit |
| Alternatives scores | Taken from the pack’s matrix | Judgements, not measurements. F wins 15 of 16 weight shifts |
| Slide and appendix text | Drafted | Rewritten so that n = 0 is visible. No model number is tagged as measured |
| Rimclip CAD (`10_RIMCLIP/`) | Drafted the OpenSCAD model, the STL, and the drawing | Not built and not boiled. A late falling clip is rejected in the text. Stainless only |
| Data | None. There is no `trials.csv`. Example files stay out of the deck | Record the home trials before claiming a boil-over count |
