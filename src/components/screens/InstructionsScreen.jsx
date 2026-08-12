import { TriangleAlert, Move3d, Footprints, Radar, MousePointerClick, PackageOpen } from "lucide-react";
import { content } from "@/lib/content";
import Logo from "@/components/ui/Logo";

const CONTROL_ICONS = [Move3d, Footprints, Radar, MousePointerClick, PackageOpen];

export default function InstructionsScreen({ onContinue }) {
  const t = content.instructions;
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <Logo size="sm" />
          <h2 className="text-2xl font-bold text-brand-navy">{t.title}</h2>
        </div>
        <p className="mt-2 text-slate-600">{t.intro}</p>

        <ul className="mt-6 space-y-3">
          {t.rules.map((rule, i) => (
            <li key={i} className="flex gap-3 text-slate-800">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <TriangleAlert size={14} />
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 text-lg font-semibold text-brand-navy">{t.controlsTitle}</h3>
        <ul className="mt-3 space-y-2">
          {t.controls.map((c, i) => {
            const Icon = CONTROL_ICONS[i] ?? MousePointerClick;
            return (
              <li key={i} className="flex gap-3 text-slate-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Icon size={14} />
                </span>
                <span>{c}</span>
              </li>
            );
          })}
        </ul>

        <button
          onClick={onContinue}
          className="mt-8 w-full rounded-full bg-brand-navy px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-navy-light"
        >
          {t.continueButton}
        </button>
      </div>
    </div>
  );
}
