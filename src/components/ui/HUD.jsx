import { content } from "@/lib/content";
import Logo from "@/components/ui/Logo";

function ZoneBanner({ zone }) {
  if (zone === "safe") return null;
  const info = content.zones[zone];
  const isDanger = zone === "danger";

  return (
    <div
      className={`pointer-events-none absolute top-0 left-0 right-0 flex flex-col items-center gap-1 py-4 text-center text-white ${
        isDanger ? "bg-red-600/95" : "bg-amber-500/95"
      } ${isDanger ? "animate-pulse" : ""}`}
    >
      <span className="text-xs font-bold tracking-widest">{info.badge}</span>
      <span className="text-lg font-semibold">{info.message}</span>
    </div>
  );
}

function HazardInfoPanel({ hazard, onClose }) {
  if (!hazard) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-brand-navy">{hazard.title}</h3>
        <p className="mt-3 text-slate-700">{hazard.description}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-brand-navy px-6 py-3 font-semibold text-white hover:bg-brand-navy-light"
        >
          Tushunarli
        </button>
      </div>
    </div>
  );
}

export default function HUD({
  zone,
  hazards,
  foundIds,
  violations,
  activeHazard,
  onCloseHazardInfo,
  onFinish,
}) {
  const allFound = foundIds.length >= hazards.length;

  return (
    <div className="pointer-events-none absolute inset-0">
      <ZoneBanner zone={zone} />

      <div className="pointer-events-auto absolute left-4 top-4 w-72 rounded-xl bg-brand-navy/90 p-4 text-white shadow-lg">
        <div className="mb-2 flex items-center gap-2">
          <Logo size="sm" className="h-6 w-6" />
          <h4 className="text-xs font-semibold uppercase tracking-wide text-brand-gold-light">
            {content.hud.objectivesTitle}
          </h4>
        </div>
        <p className="mt-1 text-sm font-medium">
          {content.hud.hazardsProgress(foundIds.length, hazards.length)}
        </p>
        <ul className="mt-3 max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {hazards.map((h) => {
            const done = foundIds.includes(h.id);
            return (
              <li key={h.id} className="flex items-center gap-2 text-sm">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                    done ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {done ? "✓" : "?"}
                </span>
                <span className={done ? "text-slate-300 line-through" : "text-slate-100"}>
                  {h.title}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 border-t border-slate-800 pt-3 text-sm">
          <span className="text-slate-400">{content.hud.violationsLabel}: </span>
          <span className={violations > 0 ? "font-semibold text-red-400" : "font-semibold text-emerald-400"}>
            {violations}
          </span>
        </div>
      </div>

      {allFound && (
        <div className="pointer-events-auto absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <button
            onClick={onFinish}
            className="rounded-full bg-brand-gold px-8 py-4 text-lg font-semibold text-brand-navy shadow-lg hover:bg-brand-gold-light"
          >
            {content.hud.finishButton}
          </button>
        </div>
      )}
      {!allFound && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-brand-navy/80 px-5 py-2 text-sm text-slate-200">
          {content.hud.finishHint}
        </div>
      )}

      {activeHazard && (
        <div className="pointer-events-auto absolute inset-0">
          <HazardInfoPanel hazard={activeHazard} onClose={onCloseHazardInfo} />
        </div>
      )}
    </div>
  );
}
