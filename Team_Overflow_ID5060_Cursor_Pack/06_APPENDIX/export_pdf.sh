#!/usr/bin/env bash
# Print the appendix to a single A4 PDF and refuse anything over 4 pages.
set -e
cd "$(dirname "$0")"
if [ -z "${CHROME:-}" ]; then
  if [ -x /opt/google/chrome/chrome ]; then CHROME=/opt/google/chrome/chrome
  else CHROME=$(command -v google-chrome || command -v chromium || command -v chromium-browser)
  fi
fi
mkdir -p export
"$CHROME" --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --force-device-scale-factor=1 \
  --user-data-dir="/tmp/chrome-appendix-$$" --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf=export/Team_Overflow_ID5060_appendix.pdf "file://$PWD/appendix.html"
PY=${PYTHON:-python3}
"$PY" - << 'PY'
from pypdf import PdfReader
n = len(PdfReader("export/Team_Overflow_ID5060_appendix.pdf").pages)
print("appendix pages:", n)
if n > 4:
    raise SystemExit("appendix is longer than 4 pages")
PY
echo "wrote export/Team_Overflow_ID5060_appendix.pdf"
