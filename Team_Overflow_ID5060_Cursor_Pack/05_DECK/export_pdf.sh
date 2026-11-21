#!/usr/bin/env bash
# Export the HTML deck to PDF (one 1920x1080 page per slide) and PNG per slide.
# Needs Google Chrome/Chromium. Alternative: npx decktape generic deck/index.html deck.pdf
set -e
cd "$(dirname "$0")"
CHROME=${CHROME:-$(command -v google-chrome || command -v chromium || command -v chromium-browser)}
mkdir -p export
"$CHROME" --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf=export/Team_Overflow_ID5060_slides.pdf "file://$PWD/deck/index.html" 2>/dev/null
for n in 1 2 3 4 5 6; do
  "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=1920,1080 --virtual-time-budget=5000 \
    --screenshot="export/slide_$n.png" "file://$PWD/deck/index.html?slide=$n" 2>/dev/null
done
echo "PDF + PNGs in 05_DECK/export/"
