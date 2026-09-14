import { STOPS, type ExpeditionStop } from "@/lib/expedition";
import { cn } from "@/lib/utils";

export function Timeline({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (stop: ExpeditionStop) => void;
}) {
  return (
    <div className="relative">
      <div
        className="flex gap-2 overflow-x-auto pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Itinéraire chronologique"
      >
        {STOPS.map((stop) => {
          const selected = stop.id === activeId;
          return (
            <button
              key={stop.id}
              type="button"
              role="listitem"
              onClick={() => onSelect(stop)}
              className={cn(
                "flex min-w-36 shrink-0 flex-col gap-1 rounded-md border px-3 py-2.5 text-left transition-[background-color,border-color,color] duration-150",
                selected
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface hover:bg-surface-2",
              )}
            >
              <span className="font-mono text-[0.625rem] tabular-nums text-subtle">
                {String(stop.index).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-fg">{stop.name}</span>
              <span className="text-[0.6875rem] text-muted">{stop.dateLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
