"""
Native 16:9 PPTX (Georgia headlines, Calibri body) with speaker notes.
Run after export_pdf.sh if you also want the pixel-exact image deck.
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

HERE = os.path.dirname(os.path.abspath(__file__))
DECK = os.path.join(HERE, "deck")
FIG = os.path.join(DECK, "assets", "figures")

INK = "1F2A33"
ACCENT = "C2410C"
MUTED = "6B6357"
BG = "FAF7F0"
BLUE = "1D4ED8"


def rgb(hex_color):
    return RGBColor.from_string(hex_color)


def blank(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = rgb(BG)
    bg.line.fill.background()
    # send to back by staying first; later shapes paint over it
    return slide


def box(slide, l, t, w, h, text, size=16, bold=False, color=INK, font="Calibri", align=PP_ALIGN.LEFT):
    shape = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = shape.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = rgb(color)
    run.font.name = font
    return shape


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def card(slide, l, t, w, h):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(l), Inches(t), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb("FFFFFF")
    shape.line.color.rgb = rgb("E8E1D3")
    return shape


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    prs.core_properties.title = "Team Overflow · Milk boils over · ID5060"
    prs.core_properties.author = "Vinay Chekuri, Vinnay Gupta, Atharva Chinchalkar"

    s = blank(prs)
    box(s, 0.5, 0.28, 8, 0.3, "ID5060  ·  FIRST PRINCIPLES TOOLS  ·  TERM PROJECT", 12, True, ACCENT)
    box(s, 10.4, 0.28, 2.4, 0.3, "01 / 06", 12, False, MUTED, align=PP_ALIGN.RIGHT)
    box(s, 0.5, 0.7, 7.2, 2.3, "Milk boils over.\nThe pot can say so first.", 36, True, INK, "Georgia")
    box(s, 0.5, 3.05, 7.2, 0.9, "Milk sits calm, then climbs the rim in seconds. Every common fix needs someone at the stove. The rebuild is a phone that listens.", 16)
    card(s, 0.5, 4.1, 2.4, 2.15)
    box(s, 0.65, 4.2, 2.15, 0.3, "USER NEED", 11, True, MUTED)
    box(s, 0.65, 4.5, 2.15, 1.6, "250–500 mL packaged milk, full boil, gas or induction, without watching the pot.", 14)
    card(s, 3.05, 4.1, 2.4, 2.15)
    box(s, 3.2, 4.2, 2.15, 0.3, "BASELINE", 11, True, MUTED)
    box(s, 3.2, 4.5, 2.15, 1.6, "Kitchen n = 0. UNTESTED.\nModel, 14 cm pot: first boil to overflow ≈ 2.2 s. MODEL.", 14)
    card(s, 5.6, 4.1, 2.15, 2.15)
    box(s, 5.75, 4.2, 1.9, 0.3, "TARGET", 11, True, MUTED)
    box(s, 5.75, 4.5, 1.9, 0.7, "0 / 10", 32, True, ACCENT, "Georgia")
    box(s, 5.75, 5.3, 1.9, 0.8, "unattended boil-overs. Full boil, no taste change, easy clean, under ₹300.", 12)
    card(s, 8.0, 0.85, 4.8, 5.4)
    box(s, 8.2, 1.05, 4.4, 1.3, "Diagram, not a photograph.\nFoam crosses the rim because bubbles outlive the steam.\nThe eye sees this late.", 16)
    box(s, 8.2, 2.6, 4.4, 1.6, "Π = Σ · Qv / Vfree\nΠ > 1 means the steady foam is taller than the headroom.", 16, False, BLUE)
    box(s, 8.2, 4.4, 4.4, 1.5, "Team Overflow\nVinay Chekuri · EE22B026 (representative)\nVinnay Gupta · ED22B073\nAtharva Chinchalkar · BS22B010", 15, False, INK, "Georgia")
    notes(s, "The kitchen baseline is not recorded, n = 0. The 2.2 seconds is a model estimate for an assumed 14 cm pot. The picture on the HTML deck is a diagram, not our photograph. Target is zero boil-overs in 10 unattended trials.")

    s = blank(prs)
    box(s, 0.5, 0.28, 9, 0.3, "DECONSTRUCT  ·  FIELD EVIDENCE  ·  EVOLUTION", 12, True, ACCENT)
    box(s, 10.4, 0.28, 2.4, 0.3, "02 / 06", 12, False, MUTED, align=PP_ALIGN.RIGHT)
    box(s, 0.5, 0.65, 12.3, 0.9, "The failure was the sensor: a person staring at the pot.", 28, True, INK, "Georgia")
    box(s, 0.5, 1.7, 12.3, 1.1, "Energy: flame → milk heats → skin (whey above 70–75 °C) → bubbles with a lifetime → foam over the rim. Information today: eyes, brain, hand. The visible cue is late. Root cause, Five Whys: no early non-visual signal reaches the user.", 16)
    box(s, 0.5, 2.95, 12.3, 1.5, "Evolution, sourced where we have a source: watch or spoon → 1938 milk-watcher disc (Collections WA) → Indian milk boiler → 2011 Panasonic capacitive patents → 2026 sound and vibration sensing on Samsung, LG and Cuckoo hobs (MK News). Guesses about why each design won are hypotheses.", 16)
    box(s, 0.5, 4.6, 12.3, 2.2, "Assumptions. “The skin causes it” — the skin raises bubble lifetime; overflow still needs lifetime × steam rate > headroom. “Use a bigger pot” — the model still overflows at 20 cm and needs about 24 cm at full flame. “Someone must watch” — the pot is loudest before the boil in kettle data, so a phone might listen. That last step is untested on milk. The foam curve on the HTML slide is a model, not our video.", 16)
    notes(s, "Say that the three panels are an illustration and the foam curve is a model. Five Whys ends at no early non-visual signal. The 1938 disc is a museum record.")

    s = blank(prs)
    box(s, 0.5, 0.28, 9, 0.3, "ANALYZE  ·  PRINCIPLES  ·  TRANSFORMERS", 12, True, ACCENT)
    box(s, 10.4, 0.28, 2.4, 0.3, "03 / 06", 12, False, MUTED, align=PP_ALIGN.RIGHT)
    box(s, 0.5, 0.62, 12.3, 0.7, "One number decides boil-over. Four transformers move it.", 26, True, INK, "Georgia")
    box(s, 0.5, 1.45, 6.2, 2.4, "Principles. Phase change magnifies volume ×1602. Energy in at the boil becomes steam. Surface films give bubbles a lifetime; pure water has none. Whey denatures above 70–75 °C. Steady foam height He = Σ · Ug (Bikerman).\n\nΠ = Σ · Qv / Vfree. Five variables, two dimensions, three groups. Π > 1 means boil-over. At full flame in the assumed 14 cm pot, Π = 3.9. MODEL. Σ = 4.6 s is assumed, not fitted.", 15)
    rows = [
        "1 Magnify. 1183 W makes 0.88 L of steam per second. A 1.04 L headspace fills in 1.2 s if nothing bursts. Warn before the boil.",
        "2 Scale. Π falls as 1/D², but a 20 cm pot still overflows. About 24 cm gets Π to 1. Less heat moves Π more.",
        "3 Approach a limit. t* = −τ ln(1 − 1/Π) goes to infinity as Π approaches 1 from above. Arrive just under 1.",
        "4 Change frame. Kettle sound peaks at 60–70 °C and is much quieter by 95 °C (water, not yet milk). Swap the eye for a microphone.",
    ]
    y = 1.45
    for line in rows:
        box(s, 6.9, y, 5.9, 1.15, line, 13)
        y += 1.2
    notes(s, "Say MODEL for every Π. Σ is assumed at 4.6 seconds. Magnify, Scale, Approach a Limit, and Change Frame each name the operation, the insight, and the change to the rebuild.")

    s = blank(prs)
    box(s, 0.5, 0.28, 9, 0.3, "RECONSTRUCT  ·  ALTERNATIVES  ·  CHOICE", 12, True, ACCENT)
    box(s, 10.4, 0.28, 2.4, 0.3, "04 / 06", 12, False, MUTED, align=PP_ALIGN.RIGHT)
    box(s, 0.5, 0.62, 12.3, 0.6, "Nine ways to move Π. We chose the one with no new hardware.", 26, True, INK, "Georgia")
    box(s, 0.5, 1.4, 7.4, 3.6, "F  Ubaal phone app, timed Qv          85   chosen\nH  Ubaal + disc (₹295)                 83   backup\nB  Turn to sim before the boil         81\nG  Automatic power cut                 79\nC  Milk-watcher disc alone             78\nE  Silicone flower lid                 70\nA  Wider pot                           69\nI  Double-walled milk boiler           65\nD  Spoon, stirring, butter             64\n\nWeights from our constraints. F wins 15 of 16 ±50% weight shifts. Scores are judgements.", 15)
    box(s, 8.1, 1.4, 4.7, 3.6, "Ubaal, listen don’t watch.\n1 Phone learns room noise for 8 s.\n2 Hiss rises, 150–1000 Hz.\n3 Hiss fades. Alarm: turn to sim.\n4 Qv falls, so Π < 1 at the boil.\n5 Full boil, foam under the rim.\n\nIn the model the 88 °C cue leads the boil by 24 s, which clears an assumed 15 s response. A 95 °C cue (8 s) does not. MODEL.", 15)
    path = os.path.join(FIG, "fig_map_cue_response.png")
    if os.path.exists(path):
        s.shapes.add_picture(path, Inches(0.5), Inches(5.15), Inches(6.2), Inches(2.05))
    box(s, 6.9, 5.2, 5.9, 1.9, "Why this one: it costs ₹0, works on gas and induction, and the central mechanism is an information loop we can test with a phone. The annotated sketch is on the HTML slide. The disc version is the backup only after its effect on Σ is measured.", 14)
    notes(s, "Every alternative attacks one term of Π. F wins on our constraints. The 24 second lead is a model estimate. H is the planned refinement if a real lead is too short.")

    s = blank(prs)
    box(s, 0.5, 0.28, 9, 0.3, "EVALUATE  ·  BUILD  ·  TEST  ·  REFINE", 12, True, ACCENT)
    box(s, 10.4, 0.28, 2.4, 0.3, "05 / 06", 12, False, MUTED, align=PP_ALIGN.RIGHT)
    box(s, 0.5, 0.6, 12.3, 0.6, "Built and modelled. The kitchen test is still open.", 26, True, INK, "Georgia")
    box(s, 0.5, 1.35, 6.3, 2.2, "Built. Ubaal: microphone FFT, state machine, spoken alarm in English or Hindi, ground-truth buttons, CSV and audio export. Simulator: the same ODEs as the Python model, with a banner that the curves are estimates.\n\nUnattended means the tester moves only when the alarm sounds. Planned: baseline ≥ 3, v1 ≥ 5. Run so far: n = 0 milk trials.", 15)
    before = os.path.join(FIG, "fig_model_before_after.png")
    if os.path.exists(before):
        s.shapes.add_picture(before, Inches(6.9), Inches(1.35), Inches(5.9), Inches(2.5))
    box(s, 0.5, 4.0, 12.3, 2.9, "Model, same assumed pot. Baseline crosses the rim 2.2 s after first boil. Ubaal’s 88 °C cue leaves a 24 s lead and foam stops near 52% of the headroom. MODEL, not a kitchen before/after.\n\nLogic tests on synthetic audio: 3 of 3. Hiss gives PRE-BOIL then BOILING. A rattle gives BOILING. Steady noise gives no alarm. LOGIC, not milk.\n\nRefinement: none. No labelled recording, so dropDb stays 4 and minPeakHoldS stays 5. Retuning on synthetic audio would fake a refinement. Next: one noise-only clip and one boil, then search those two knobs for the longest lead with zero false alarms.", 15)
    notes(s, "Say n = 0. The chart is a model. The 3 of 3 is a logic test. We kept the starting detector config because there is no kitchen recording to tune on.")

    s = blank(prs)
    box(s, 0.5, 0.28, 9, 0.3, "BENEFITS  ·  COST  ·  LIMITS  ·  NEXT", 12, True, ACCENT)
    box(s, 10.4, 0.28, 2.4, 0.3, "06 / 06", 12, False, MUTED, align=PP_ALIGN.RIGHT)
    box(s, 0.5, 0.6, 12.3, 0.6, "What it would change, what it costs, and what we do not know.", 26, True, INK, "Georgia")
    card(s, 0.5, 1.45, 3.9, 1.7)
    box(s, 0.65, 1.55, 3.6, 0.3, "BOIL-OVERS", 11, True, MUTED)
    box(s, 0.65, 1.9, 3.6, 1.0, "n = 0. Target remains 0/10. UNTESTED.", 16)
    card(s, 4.6, 1.45, 4.0, 1.7)
    box(s, 4.75, 1.55, 3.7, 0.3, "WARNING", 11, True, MUTED)
    box(s, 4.75, 1.9, 3.7, 1.0, "24 s in the model if the cue is at 88 °C. MODEL.", 16)
    card(s, 8.8, 1.45, 4.0, 1.7)
    box(s, 8.95, 1.55, 3.7, 0.3, "COST", 11, True, MUTED)
    box(s, 8.95, 1.9, 3.7, 1.0, "₹0 for the app. Optional disc ₹295, seen 21 Nov 2026. Under ₹300.", 16)
    box(s, 0.5, 3.35, 12.3, 2.0, "Trade-offs. The 92 °C rule delays the boil by about 26 s in the model; Ubaal’s later cue delays it by about 3 s. The phone has to sit near the pot. On gas, a person still turns the knob. False alarms from a fan, a whistle, or a second pot are possible and unmeasured.\n\nLimits. One assumed pot. Σ was not fitted. Synthetic tests do not prove the physics. The primary outcome is untested.\n\nNext. Record the trials. Then close the loop on induction so PRE-BOIL cuts the power with no one in the room.", 15)
    box(s, 0.5, 5.5, 12.3, 1.6, "Key sources. Muir, New Scientist 2020. America’s Test Kitchen. Pugh 2016 (Bikerman Σ). Singh, Lait 2007. Kamath et al., J. Dairy Sci. 2011. Kreiner, Ulm 2015. Annals FEH 2014 (kettle acoustics). Panasonic US 9,462,639 and 9,386,635. MK News, 12 Mar 2026. BIS IS 4246:2002. Engineering ToolBox. Full list and the AI declaration are in the appendix.", 13)
    notes(s, "Do not call 24 seconds a measured lead. Cost is zero plus an optional disc. Close on the untested primary outcome and the induction next step.")

    out = os.path.join(HERE, "export", "Team_Overflow_ID5060_slides_editable.pptx")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    prs.save(out)
    print("wrote", out)


if __name__ == "__main__":
    build()
