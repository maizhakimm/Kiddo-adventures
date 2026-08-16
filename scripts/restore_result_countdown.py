from pathlib import Path

p = Path('web/src/main.jsx')
s = p.read_text()

old = '''<p>{isCorrect?`Bagus, ${child.name}!`:<>Jawapan yang betul ialah <strong>{String(challenge.answer)}</strong>.</>}</p><button onClick={()=>onComplete(isCorrect,nextLevel,isLast)}>{isLast?'Lihat keputusan →':'Teruskan sekarang →'}</button>'''
new = '''<p>{isCorrect?`Bagus, ${child.name}!`:<>Jawapan yang betul ialah <strong>{String(challenge.answer)}</strong>.</>}</p><div className="resultCountdown" aria-live="polite"><span>⏱️</span><strong>{countdown}</strong><small>{isLast?'saat ke keputusan':'saat ke level seterusnya'}</small></div><button onClick={()=>onComplete(isCorrect,nextLevel,isLast)}>{isLast?'Lihat keputusan →':'Teruskan sekarang →'}</button>'''

if old in s:
    s = s.replace(old, new, 1)
elif 'className="resultCountdown"' not in s:
    raise SystemExit('Result popup pattern not found')

p.write_text(s)

css = Path('web/src/styles.css')
c = css.read_text()
addon = '''\n/* Answer feedback countdown */\n.resultCountdown{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin:12px auto 18px;padding:11px 18px;border-radius:999px;background:rgba(255,255,255,.82);box-shadow:0 5px 18px rgba(47,43,75,.08);font-weight:800}.resultCountdown span{font-size:22px}.resultCountdown strong{font-size:28px;line-height:1;color:#332e57}.resultCountdown small{font-size:13px;color:#716c82}.resultCorrect .resultCountdown{border:2px solid #b9ecc9}.resultWrong .resultCountdown{border:2px solid #f1bbb3}\n'''
if '/* Answer feedback countdown */' not in c:
    css.write_text(c + addon)
