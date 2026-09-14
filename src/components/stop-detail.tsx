import { MapPin, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CERTAINTY_LABEL,
  KIND_LABEL,
  type Certainty,
  type ExpeditionStop,
  type StopKind,
} from "@/lib/expedition";

function kindTone(kind: StopKind) {
  if (kind === "combat") return "combat" as const;
  if (kind === "rencontre" || kind === "arrivee") return "peace" as const;
  if (kind === "epreuve") return "warn" as const;
  return "accent" as const;
}

function certaintyTone(c: Certainty) {
  if (c === "debattu") return "warn" as const;
  if (c === "approxime") return "default" as const;
  return "accent" as const;
}

export function StopDetail({
  stop,
  hideTitle = false,
}: {
  stop: ExpeditionStop;
  hideTitle?: boolean;
}) {
  return (
    <article className="flex flex-col gap-5">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs tabular-nums text-subtle">
            {String(stop.index).padStart(2, "0")} / 17
          </span>
          <Badge tone={kindTone(stop.kind)}>{KIND_LABEL[stop.kind]}</Badge>
          <Badge tone={certaintyTone(stop.certainty)}>
            {CERTAINTY_LABEL[stop.certainty]}
          </Badge>
        </div>
        {hideTitle ? null : (
          <h2 className="font-display text-2xl font-medium leading-snug tracking-tight text-fg md:text-3xl">
            {stop.name}
          </h2>
        )}
        <p className="flex items-start gap-2 text-sm text-muted">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>
            {stop.modernName}
            <span className="text-subtle"> · {stop.region}</span>
          </span>
        </p>
        {hideTitle ? null : <p className="text-sm font-medium text-fg">{stop.dateLabel}</p>}
        <p className="text-sm leading-relaxed text-muted">{stop.dateDetail}</p>
      </header>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-medium uppercase tracking-widest text-subtle">
          Pourquoi s'arrêter
        </h3>
        <p className="text-sm leading-relaxed text-fg">{stop.reason}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-medium uppercase tracking-widest text-subtle">
          Ce qui s'y passa
        </h3>
        <p className="text-sm leading-relaxed text-fg">{stop.happened}</p>
        {stop.aftermath ? (
          <p className="text-sm leading-relaxed text-muted">{stop.aftermath}</p>
        ) : null}
      </section>

      {stop.quote ? (
        <blockquote className="relative rounded-md border border-border bg-bg px-4 py-3">
          <Quote className="absolute right-3 top-3 size-4 text-subtle" aria-hidden />
          <p className="pr-6 font-display text-base italic leading-relaxed text-fg">
            {stop.quote.text}
          </p>
          <footer className="mt-2 text-xs text-muted">{stop.quote.attribution}</footer>
        </blockquote>
      ) : null}

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {stop.facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-md border border-border bg-bg px-3 py-2.5"
          >
            <p className="text-[0.6875rem] uppercase tracking-widest text-subtle">
              {fact.label}
            </p>
            <p className="mt-1 text-sm text-fg">{fact.value}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-medium uppercase tracking-widest text-subtle">
          Acteurs
        </h3>
        <ul className="flex flex-col gap-1">
          {stop.people.map((person) => (
            <li key={person} className="text-sm leading-relaxed text-fg">
              {person}
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      <section className="flex flex-col gap-1.5">
        <h3 className="text-xs font-medium uppercase tracking-widest text-subtle">
          Sources
        </h3>
        {stop.sources.map((source) => (
          <p key={source} className="text-xs leading-relaxed text-muted">
            {source}
          </p>
        ))}
      </section>
    </article>
  );
}
