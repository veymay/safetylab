// Stsenariy mantig'i: xavf zonasi holati va yakuniy ballash formulasi.
// Har bir stansiya (qarang: lib/environment.js) o'zining warningRadius/
// dangerRadius qiymatlarini beradi, shu fayl esa ularni umumiy tarzda ishlatadi.

export function getZoneState(distance, warningRadius, dangerRadius) {
  if (distance <= dangerRadius) return "danger";
  if (distance <= warningRadius) return "warning";
  return "safe";
}

const HAZARDS_WEIGHT = 40;
const SAFETY_WEIGHT = 20;
const VIOLATION_PENALTY = 5;
const QUIZ_WEIGHT = 40;
export const PASS_THRESHOLD = 70;

export function computeScore({ hazardsFound, hazardsTotal, violations, quizCorrect, quizTotal }) {
  const hazardScore = hazardsTotal ? Math.round((hazardsFound / hazardsTotal) * HAZARDS_WEIGHT) : 0;
  const safetyScore = Math.max(0, SAFETY_WEIGHT - violations * VIOLATION_PENALTY);
  const quizScore = quizTotal ? Math.round((quizCorrect / quizTotal) * QUIZ_WEIGHT) : 0;
  const total = Math.min(100, hazardScore + safetyScore + quizScore);
  return { hazardScore, safetyScore, quizScore, total };
}
