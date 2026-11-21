"""Shared matplotlib style matching the deck (cream background, ink text, burnt-orange accent)."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

BG, INK, ACCENT, BLUE, GREEN, RED, MUTED = "#FAF7F0", "#1F2A33", "#C2410C", "#1d4ed8", "#15803d", "#b91c1c", "#6b6357"

def apply():
    plt.rcParams.update({
        "figure.facecolor": BG, "axes.facecolor": BG, "savefig.facecolor": BG,
        "axes.edgecolor": MUTED, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK,
        "text.color": INK, "font.size": 12, "axes.titlesize": 14, "axes.titleweight": "bold",
        "axes.spines.top": False, "axes.spines.right": False, "figure.dpi": 150,
    })

def stamp(ax, text="MODEL ESTIMATE — not measured", color=MUTED):
    ax.text(0.99, 0.01, text, transform=ax.transAxes, ha="right", va="bottom", fontsize=9, color=color, style="italic")
