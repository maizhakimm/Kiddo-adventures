from pathlib import Path
import re

path = Path('web/src/main.jsx')
text = path.read_text()

import_line = "import{makeChallenge}from'./questionBank.js';\n"
if import_line not in text:
    anchor = "import{createRoot}from'react-dom/client';\n"
    if anchor not in text:
        raise SystemExit('createRoot import anchor not found')
    text = text.replace(anchor, anchor + import_line, 1)

pattern = r"\nfunction makeChallenge\(gameKey,level\)\{.*?\n\}\n\nfunction calcStars"
replacement = "\nfunction calcStars"
text, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
if count == 0 and "function makeChallenge(gameKey,level)" in text:
    raise SystemExit('makeChallenge block found but could not replace safely')

path.write_text(text)
print('Question bank integrated into main.jsx')
