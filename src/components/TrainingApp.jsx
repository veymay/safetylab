"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { createXRStore } from "@react-three/xr";
import { theme, stations, hazards, quiz } from "@/lib/environment";
import { computeScore } from "@/lib/scenario";
import { useXRSupport } from "@/lib/useXRSupport";
import { playHazardFound, playDangerAlert } from "@/lib/sound";
import InstructionsScreen from "@/components/screens/InstructionsScreen";
import FeedbackScreen from "@/components/screens/FeedbackScreen";
import QuizScreen from "@/components/screens/QuizScreen";
import ResultScreen from "@/components/screens/ResultScreen";

const Experience = dynamic(() => import("@/components/scene/Experience"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-slate-900 text-slate-400">
      Sahna yuklanmoqda...
    </div>
  ),
});

const STAGES = {
  INSTRUCTIONS: "instructions",
  ENVIRONMENT: "environment",
  FEEDBACK: "feedback",
  QUIZ: "quiz",
  RESULT: "result",
};

const allHazardDefs = [...stations.map((s) => s.hazard), ...hazards];

export default function TrainingApp() {
  const [stage, setStage] = useState(STAGES.INSTRUCTIONS);
  const [foundIds, setFoundIds] = useState([]);
  const [violations, setViolations] = useState(0);
  const [activeHazardId, setActiveHazardId] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const xrStore = useMemo(() => createXRStore({ emulate: false }), []);
  const xrSupported = useXRSupport();

  function enterFullscreen() {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  }

  function resetProgress() {
    setFoundIds([]);
    setViolations(0);
    setActiveHazardId(null);
    setBreakdown(null);
  }

  function handleStartOnScreen() {
    if (!xrSupported) enterFullscreen();
    setStage(STAGES.ENVIRONMENT);
  }

  function handleHazardSelect(id) {
    setFoundIds((prev) => {
      if (prev.includes(id)) return prev;
      playHazardFound();
      return [...prev, id];
    });
    setActiveHazardId(id);
  }

  function handleHazardAutoFound(id) {
    setFoundIds((prev) => {
      if (prev.includes(id)) return prev;
      playHazardFound();
      return [...prev, id];
    });
  }

  function handleDangerEnter() {
    playDangerAlert();
    setViolations((v) => v + 1);
  }

  function handleQuizFinish(correct, total) {
    setBreakdown(
      computeScore({
        hazardsFound: foundIds.length,
        hazardsTotal: allHazardDefs.length,
        violations,
        quizCorrect: correct,
        quizTotal: total,
      })
    );
    setStage(STAGES.RESULT);
  }

  function handleRestart() {
    resetProgress();
    setStage(STAGES.INSTRUCTIONS);
  }

  const activeHazard = allHazardDefs.find((h) => h.id === activeHazardId) ?? null;

  if (stage === STAGES.INSTRUCTIONS) {
    return <InstructionsScreen onContinue={handleStartOnScreen} />;
  }
  if (stage === STAGES.FEEDBACK) {
    return (
      <FeedbackScreen
        hazards={allHazardDefs}
        foundIds={foundIds}
        violations={violations}
        onContinue={() => setStage(STAGES.QUIZ)}
      />
    );
  }
  if (stage === STAGES.QUIZ) {
    return <QuizScreen quiz={quiz} onFinish={handleQuizFinish} />;
  }
  if (stage === STAGES.RESULT) {
    return <ResultScreen breakdown={breakdown} onRestart={handleRestart} />;
  }

  return (
    <div className="relative h-dvh w-full">
      <Experience
        theme={theme}
        stations={stations}
        hazards={hazards}
        foundIds={foundIds}
        hazardsTotal={allHazardDefs.length}
        violations={violations}
        activeHazard={activeHazard}
        onHazardSelect={handleHazardSelect}
        onHazardAutoFound={handleHazardAutoFound}
        onCloseHazardInfo={() => setActiveHazardId(null)}
        onDangerEnter={handleDangerEnter}
        onFinish={() => setStage(STAGES.FEEDBACK)}
        xrStore={xrStore}
      />
    </div>
  );
}
