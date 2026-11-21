#!/usr/bin/env bash
# Regenerate every figure and copy deck-ready ones into 05_DECK/deck/assets/figures.
set -e
cd "$(dirname "$0")"
"${PYTHON:-python3}" dimensional_analysis.py
"${PYTHON:-python3}" param_sweep.py
"${PYTHON:-python3}" alternatives_matrix.py
"${PYTHON:-python3}" plot_trials.py --example          # EXAMPLE_* figures: pipeline check only, never in the deck
if [ -f data/trials.csv ]; then "${PYTHON:-python3}" plot_trials.py data/trials.csv; fi
"${PYTHON:-python3}" foam_fit.py --demo
mkdir -p ../05_DECK/deck/assets/figures
cp figures/fig_*.png ../05_DECK/deck/assets/figures/ 2>/dev/null || true
rm -f ../05_DECK/deck/assets/figures/EXAMPLE_* 
echo "done. Deck figures in 05_DECK/deck/assets/figures (EXAMPLE_* excluded)."
