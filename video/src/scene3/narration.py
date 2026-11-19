"""Generate Scene 3 narration (one Kokoro clip per sentence) plus timings.json.

Run with: C:\Users\Alon\.venvs\kokoro\Scripts\python video/src/scene3/narration.py
Writes video/public/scene3/narration.wav and video/src/scene3/timings.json.
"""
import json
from pathlib import Path
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
root = Path(__file__).resolve().parents[3]
segs = [
 ("intro", "Start with the fingerprint. Bitcoin uses a function called SHA two fifty-six."),
 ("feed", "You feed it any data, a word, a page, a whole book, and it returns a fixed string of sixty-four characters."),
 ("same", "The same input always gives the same output."),
 ("change", "But change a single letter, and the output transforms completely, with no pattern you can predict."),
 ("oneway", "And there's no way to work backwards from the fingerprint to the input."),
 ("street", "It's a one-way street."),
]
k = Kokoro(str(root/"models"/"kokoro-v1.0.onnx"), str(root/"models"/"voices-v1.0.bin"))
lead, gap = 0.5, 0.45
out, t, timings, sr = [], lead, {}, 24000
for name, text in segs:
    s, sr = k.create(text, voice="af_heart", speed=1.0, lang="en-us")
    timings[name] = {"start": round(t, 3), "duration": round(len(s)/sr, 3)}
    out.append(s); out.append(np.zeros(int(gap*sr), dtype=s.dtype)); t += len(s)/sr + gap
audio = np.concatenate([np.zeros(int(lead*sr), dtype=out[0].dtype)] + out)
sf.write(root/"video"/"public"/"scene3"/"narration.wav", audio, sr)
timings["_total"] = round(len(audio)/sr, 3)
(root/"video"/"src"/"scene3").mkdir(parents=True, exist_ok=True)
(root/"video"/"src"/"scene3"/"timings.json").write_text(json.dumps(timings, indent=2))
print(json.dumps(timings, indent=2))
