"""Generate narration with Kokoro.

Usage: python tts.py "Text to speak" out.wav [voice] [speed]
Run with: C:\\Users\\Alon\\.venvs\\kokoro\\Scripts\\python tts.py ...
"""
import sys
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

HERE = Path(__file__).parent
text = sys.argv[1]
out = sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else "af_heart"
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0

kokoro = Kokoro(str(HERE / "models" / "kokoro-v1.0.onnx"), str(HERE / "models" / "voices-v1.0.bin"))
samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
sf.write(out, samples, sr)
print(f"wrote {out}: {len(samples) / sr:.2f}s")
