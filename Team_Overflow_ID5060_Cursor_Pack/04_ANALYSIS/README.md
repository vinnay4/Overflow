# 04_ANALYSIS: Python calculations, model, figures, and the real-data pipeline

```bash
python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt   # numpy, pandas, matplotlib
bash make_all.sh          # regenerates all figures and copies deck figures (never EXAMPLE_*) to 05_DECK
```
Verified 21 Nov 2026 (IST) with Python 3 + numpy 2.x, pandas 3.x, matplotlib 3.x: every script runs.

| Script | Does | Output |
|---|---|---|
| `milk_model.py` | Lumped model (see `02_SIMULATION/EQUATIONS.md`): `simulate()`, `boil_over_number()`, `time_to_overflow()` | used by the others |
| `dimensional_analysis.py` | Buckingham π printout; Magnify (×1602, L/s vs power); Scale (Π vs D, full and low flame); Limit (t\* vs Π) | `fig_magnify_steam.png`, `fig_scale_pi_vs_diameter.png`, `fig_limit_tstar.png` |
| `param_sweep.py` | 10 scenarios; maps of boil-over over (power × diameter) and (cue temperature × response time) | `fig_scenarios_foam.png`, `fig_map_power_diameter.png`, `fig_map_cue_response.png`, `model_scenarios.csv` |
| `alternatives_matrix.py` | Weighted scores from `01_RESEARCH/alternatives_*.csv` + ±50 % weight sensitivity | `fig_alternatives_scores.png`, `alternatives_scored.csv` |
| `plot_trials.py [data/trials.csv]` | **Real trials** → boil-over counts, Fisher exact p, per-trial timeline, foam vs time. `--example` runs on SYNTHETIC rows, and the outputs are prefixed `EXAMPLE_` | `fig_trials_boilovers.png`, `fig_trials_timeline.png` |
| `foam_fit.py [data/foam_decay.csv]` | Fit H(t) = H₀e^(−t/τ) after the flame is cut → τ, Σ = τ/ε. `--demo` uses synthetic data | Σ for the model |
| `detector_eval.py [data/raw]` | Lead time, misses, false alarms from the app's exported CSVs | `detector_eval.csv` |

## Data rules (non-negotiable; they protect your marks)
1. `data/trials.csv` holds **only trials you actually ran**. Copy `trials_template.csv` and fill one row per trial. `plot_trials.py` refuses rows with `is_example=1`.
2. `EXAMPLE_SYNTHETIC_trials.csv` exists only to prove the pipeline works. Never put `EXAMPLE_*` figures in the deck. `make_all.sh` deletes them from the deck folder.
3. Every model figure says **MODEL** in its title or footnote. Every trial figure states n.
4. Put raw app exports in `data/raw/<trial_id>/`.
