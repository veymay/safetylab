import { CheckCircle2, TriangleAlert, ArrowRight } from "lucide-react";
import { content } from "@/lib/content";
import Logo from "@/components/ui/Logo";

export default function FeedbackScreen({ hazards, foundIds, violations, onContinue }) {
  const t = content.feedback;
  const found = hazards.filter((h) => foundIds.includes(h.id));
  const missed = hazards.filter((h) => !foundIds.includes(h.id));

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <Logo size="sm" />
          <h2 className="text-2xl font-bold text-brand-navy">{t.title}</h2>
        </div>

        <p className="mt-6 rounded-lg bg-slate-50 p-4 text-slate-800">
          {violations === 0 ? t.violationsGood : t.violationsBad(violations)}
        </p>

        {found.length > 0 && (
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
              <CheckCircle2 size={16} />
              {t.hazardsFoundLabel}
            </h3>
            <ul className="mt-3 space-y-3">
              {found.map((h) => (
                <li key={h.id} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="font-semibold text-emerald-900">{h.title}</p>
                  <p className="mt-1 text-sm text-emerald-800">{h.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {missed.length > 0 && (
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-red-700">
              <TriangleAlert size={16} />
              {t.hazardsMissedLabel}
            </h3>
            <ul className="mt-3 space-y-3">
              {missed.map((h) => (
                <li key={h.id} className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="font-semibold text-red-900">{h.title}</p>
                  <p className="mt-1 text-sm text-red-800">{h.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onContinue}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-navy-light"
        >
          {t.continueButton}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
