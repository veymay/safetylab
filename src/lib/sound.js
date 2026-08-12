"use client";

// Sintez qilingan qisqa ovozli signallar (Web Audio API) — tashqi audio
// fayllarga bog'liq emas, shuning uchun offlayn VR headsetda ham ishlaydi.

let audioCtx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone({ freq, duration = 0.15, type = "sine", volume = 0.2, delay = 0 }) {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain).connect(ctx.destination);
  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playHazardFound() {
  tone({ freq: 880, duration: 0.12, type: "sine", volume: 0.22 });
  tone({ freq: 1320, duration: 0.15, type: "sine", volume: 0.18, delay: 0.08 });
}

export function playDangerAlert() {
  tone({ freq: 220, duration: 0.2, type: "sawtooth", volume: 0.22 });
  tone({ freq: 180, duration: 0.25, type: "sawtooth", volume: 0.2, delay: 0.18 });
}

export function playQuizCorrect() {
  tone({ freq: 660, duration: 0.1, type: "triangle", volume: 0.2 });
  tone({ freq: 990, duration: 0.15, type: "triangle", volume: 0.18, delay: 0.09 });
}

export function playQuizIncorrect() {
  tone({ freq: 200, duration: 0.22, type: "square", volume: 0.16 });
}

export function playLabPass() {
  [523, 659, 784, 1046].forEach((freq, i) =>
    tone({ freq, duration: 0.18, type: "triangle", volume: 0.18, delay: i * 0.11 })
  );
}

export function playLabFail() {
  [392, 349, 294].forEach((freq, i) =>
    tone({ freq, duration: 0.22, type: "sawtooth", volume: 0.14, delay: i * 0.14 })
  );
}
