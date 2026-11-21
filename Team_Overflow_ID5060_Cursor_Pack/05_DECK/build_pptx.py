"""
build_pptx.py — wrap the exported slide PNGs into a 16:9 PPTX with speaker notes pulled from the HTML.
Run ./export_pdf.sh first. Gives a pixel-exact PPTX for submission portals that demand .pptx.
For an editable PPTX, ask Cursor to rebuild each slide with python-pptx text boxes from SLIDES_CONTENT.md.
"""
import re, os, html
from pptx import Presentation
from pptx.util import Emu

here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, "deck", "index.html"), encoding="utf8").read()
notes = [html.unescape(re.sub(r"<[^>]+>", "", n)).strip() for n in re.findall(r'<aside class="notes">(.*?)</aside>', src, re.S)]
prs = Presentation(); prs.slide_width = Emu(12192000); prs.slide_height = Emu(6858000)
blank = prs.slide_layouts[6]
for i in range(1, 7):
    png = os.path.join(here, "export", f"slide_{i}.png")
    s = prs.slides.add_slide(blank)
    s.shapes.add_picture(png, 0, 0, width=prs.slide_width, height=prs.slide_height)
    s.notes_slide.notes_text_frame.text = notes[i - 1] if i - 1 < len(notes) else ""
out = os.path.join(here, "export", "Team_Overflow_ID5060_slides.pptx")
prs.save(out); print("wrote", out)
