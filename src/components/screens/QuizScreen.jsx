"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { playQuizCorrect, playQuizIncorrect } from "@/lib/sound";
import Logo from "@/components/ui/Logo";

export default function QuizScreen({ quiz, onFinish }) {
  const t = content.quiz;
  const [answers, setAnswers] = useState(() => Array(quiz.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.filter((a, i) => a === quiz[i].correctIndex).length;

  function selectOption(qIndex, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-2 flex items-center gap-3">
          <Logo size="sm" />
          <h2 className="text-2xl font-bold text-brand-navy">{t.title}</h2>
        </div>
        <p className="mt-2 text-slate-600">{t.subtitle}</p>

        <div className="mt-6 space-y-8">
          {quiz.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {t.questionLabel(qIndex + 1, quiz.length)}
              </p>
              <p className="mt-1 font-semibold text-slate-800">{q.question}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((option, optIndex) => {
                  const isSelected = answers[qIndex] === optIndex;
                  const isCorrectOption = optIndex === q.correctIndex;

                  let stateClasses = "border-slate-200 hover:border-brand-navy/40";
                  if (isSelected && !submitted) {
                    stateClasses = "border-brand-navy bg-brand-navy/5";
                  }
                  if (submitted) {
                    if (isCorrectOption) {
                      stateClasses = "border-emerald-500 bg-emerald-50";
                    } else if (isSelected) {
                      stateClasses = "border-red-500 bg-red-50";
                    } else {
                      stateClasses = "border-slate-200 opacity-70";
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={submitted}
                      onClick={() => selectOption(qIndex, optIndex)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm text-slate-800 transition-colors ${stateClasses}`}
                    >
                      <span>{option}</span>
                      {submitted && isCorrectOption && (
                        <span className="ml-3 shrink-0 text-xs font-bold text-emerald-700">
                          {t.correctLabel}
                        </span>
                      )}
                      {submitted && isSelected && !isCorrectOption && (
                        <span className="ml-3 shrink-0 text-xs font-bold text-red-700">
                          {t.incorrectLabel}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={() => {
              setSubmitted(true);
              if (correctCount / quiz.length >= 0.6) playQuizCorrect();
              else playQuizIncorrect();
            }}
            disabled={!allAnswered}
            className="mt-8 w-full rounded-full bg-brand-navy px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.checkButton}
          </button>
        ) : (
          <div className="mt-8">
            <p className="rounded-lg bg-slate-50 p-4 text-center font-semibold text-slate-800">
              {t.scoreSummary(correctCount, quiz.length)}
            </p>
            <button
              onClick={() => onFinish(correctCount, quiz.length)}
              className="mt-4 w-full rounded-full bg-brand-gold px-8 py-4 text-lg font-semibold text-brand-navy transition-colors hover:bg-brand-gold-light"
            >
              {t.viewResultButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
