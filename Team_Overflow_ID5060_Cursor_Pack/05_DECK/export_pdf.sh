#!/usr/bin/env bash
# Export the HTML deck to PDF (one 1920x1080 page per slide) and PNG per slide.
# Needs Google Chrome/Chromium. Alternative: npx decktape generic deck/index.html deck.pdf
set -e
cd "$(dirname "$0")"
if [ -z "${CHROME:-}" ]; then
  if [ -x /opt/google/chrome/chrome ]; then CHROME=/opt/google/chrome/chrome
  else CHROME=$(command -v google-chrome || command -v chromium || command -v chromium-browser)
  fi
fi
mkdir -p export
run() { "$CHROME" --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --force-device-scale-factor=1 --user-data-dir="/tmp/chrome-deck-$$" "$@"; }
run --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=export/Team_Overflow_ID5060_slides.pdf "file://$PWD/deck/index.html"
for n in 1 2 3 4 5 6; do
  run --hide-scrollbars --window-size=1920,1080 --virtual-time-budget=8000 \
    --screenshot="export/slide_$n.png" "file://$PWD/deck/index.html?slide=$n&shot=1"
done
echo "PDF + PNGs in 05_DECK/export/"
