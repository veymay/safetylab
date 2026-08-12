"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Trophy, RotateCcw, Home, ShieldCheck, TriangleAlert } from "lucide-react";
import { content } from "@/lib/content";
import { PASS_THRESHOLD } from "@/lib/scenario";
import { playLabPass, playLabFail } from "@/lib/sound";
import Logo from "@/components/ui/Logo";

export default function ResultScreen({ breakdown, onRestart }) {
  const t = content.result;
  const { hazardScore, safetyScore, quizScore, total } = breakdown;
  const passed = total >= PASS_THRESHOLD;
  const PassIcon = passed ? Trophy : TriangleAlert;

  useEffect(() => {
    if (passed) playLabPass();
    else playLabFail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-brand-navy px-6 py-12 text-center text-white">
      <Logo size="md" className="mb-6" />
      <p className="text-sm font-semibold uppercase tracking-widest text-white/50">{t.title}</p>

      <div
        className={`mt-6 flex h-40 w-40 items-center justify-center rounded-full border-8 text-5xl font-bold ${
          passed ? "border-emerald-500 text-emerald-400" : "border-red-500 text-red-400"
        }`}
      >
        {total}
      </div>
      <p className="mt-2 text-sm text-white/50">{t.scoreLabel} / 100</p>

      <h2
        className={`mt-8 flex items-center gap-2 text-2xl font-bold ${
          passed ? "text-emerald-400" : "text-red-400"
        }`}
      >
        <PassIcon size={22} />
        {passed ? t.passTitle : t.failTitle}
      </h2>
      <p className="mt-3 max-w-md text-white/70">{passed ? t.passMessage : t.failMessage}</p>

      <div className="mt-8 w-full max-w-sm rounded-2xl bg-white/5 p-5 text-left">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50">
          <ShieldCheck size={14} />
          {t.breakdownTitle}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/70">{t.hazardsScoreLabel}</span>
            <span className="font-semibold">{hazardScore} / 40</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">{t.safetyScoreLabel}</span>
            <span className="font-semibold">{safetyScore} / 20</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">{t.quizScoreLabel}</span>
            <span className="font-semibold">{quizScore} / 40</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-lg font-semibold text-brand-navy transition-colors hover:bg-brand-gold-light"
        >
          <RotateCcw size={18} />
          {t.restartButton}
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
        >
          <Home size={18} />
          {t.homeButton}
        </Link>
      </div>
    </div>
  );
}
