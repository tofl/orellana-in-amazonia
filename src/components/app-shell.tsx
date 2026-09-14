import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  Maximize2,
  X,
} from "lucide-react";
import { ClientMap } from "@/components/client-map";
import { StopDetail } from "@/components/stop-detail";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  STOPS,
  adjacentStop,
  stopById,
  type ExpeditionStop,
} from "@/lib/expedition";
import type { Basemap } from "@/lib/map-view";
import { cn } from "@/lib/utils";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return mobile;
}

function Intro() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-display text-2xl font-medium leading-snug tracking-tight text-fg">
        Premier Européen à descendre l'Amazone.
      </p>
      <p className="text-sm leading-relaxed text-muted">
        En 1541, Francisco de Orellana quitte Quito dans l'ombre de Gonzalo
        Pizarro, en quête du Pays de la Cannelle. Le 26 décembre, il s'éloigne
        en aval pour trouver des vivres. Le courant interdit le retour. Huit mois
        plus tard, deux brigantins de fortune débouchent sur l'Atlantique.
      </p>
      <p className="text-sm leading-relaxed text-muted">
        Touchez un point sur la carte, ou avancez avec{" "}
        <span className="text-fg">Destination suivante</span>. Chaque étape
        s'ouvre quand vous le décidez — d'après la{" "}
        <span className="italic text-fg">Relación</span> de Gaspar de Carvajal.
      </p>
    </div>
  );
}

function AboutCopy() {
  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted">
      <p>
        Les faits, dates et citations suivent principalement la{" "}
        <span className="italic text-fg">
          Relación del nuevo descubrimiento del famoso río Grande
        </span>{" "}
        de Gaspar de Carvajal, conservée via Oviedo et l'édition de José Toribio
        Medina (1894).
      </p>
      <p>
        Les coordonnées des seigneuries riveraines (Aparia, Machiparo, Omagua,
        Amazones) sont des reconstitutions : Carvajal compte en lieues, nomme des
        caciques, rarement des latitudes. Les points « lieu reconstitué » et
        « identification débattue » le signalent.
      </p>
      <p>
        Le tracé du fleuve est un schéma contemporain (Coca, Napo, Solimões,
        Amazone, côte des Guyanes jusqu'à Cubagua), pas le journal de bord
        original.
      </p>
    </div>
  );
}

function nextStop(stop: ExpeditionStop | undefined): ExpeditionStop | undefined {
  return stop ? adjacentStop(stop.id, 1) : STOPS[0];
}

function NextDestinationButton({
  stop,
  onSelect,
  wide = false,
}: {
  stop: ExpeditionStop | undefined;
  onSelect: (stop: ExpeditionStop) => void;
  wide?: boolean;
}) {
  const next = nextStop(stop);
  const atEnd = Boolean(stop) && !next;
  return (
    <Button
      variant="default"
      size={wide ? "default" : "sm"}
      className={wide ? "w-full" : undefined}
      disabled={atEnd}
      onClick={() => next && onSelect(next)}
    >
      {atEnd ? "Fin du voyage" : "Destination suivante"}
      {atEnd ? null : <ChevronRight />}
    </Button>
  );
}

function PrevButton({
  stop,
  onSelect,
}: {
  stop: ExpeditionStop | undefined;
  onSelect: (stop: ExpeditionStop) => void;
}) {
  const prev = stop ? adjacentStop(stop.id, -1) : undefined;
  return (
    <Button
      variant="outline"
      size="icon-sm"
      disabled={!prev}
      aria-label="Destination précédente"
      onClick={() => prev && onSelect(prev)}
    >
      <ChevronLeft />
    </Button>
  );
}

function DetailScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("panel-scroll", className)}
      data-vaul-no-drag=""
      onWheel={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function AppShell() {
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  const [about, setAbout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fitNonce, setFitNonce] = useState(0);

  const active = stopById(activeId);

  const select = useCallback((stop: ExpeditionStop) => {
    setActiveId(stop.id);
    setMobileOpen(true);
    setAbout(false);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        const next = nextStop(active);
        if (next) select(next);
      }
      if (event.key === "ArrowLeft" && active) {
        const prev = adjacentStop(active.id, -1);
        if (prev) select(prev);
      }
      if (event.key === "Escape") {
        setMobileOpen(false);
        setAbout(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, select]);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <ClientMap
        stops={STOPS}
        active={active}
        onSelect={select}
        basemap={basemap}
        fitNonce={fitNonce}
      />

      <header className="chrome-nw pointer-events-none absolute z-20 flex max-w-sm flex-col gap-3">
        <div className="pointer-events-auto rounded-lg border border-border bg-surface/95 p-4 shadow-panel">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            1541 — 1542
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-fg">
            Orellana
          </h1>
          <p className="mt-1 text-sm text-muted">Descente de l'Amazone</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <PrevButton stop={active} onSelect={select} />
            <NextDestinationButton stop={active} onSelect={select} />
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Voir tout l'itinéraire"
              onClick={() => {
                setActiveId(null);
                setMobileOpen(false);
                setFitNonce((n) => n + 1);
              }}
            >
              <Maximize2 />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={
                basemap === "satellite" ? "Afficher la carte" : "Afficher le satellite"
              }
              onClick={() =>
                setBasemap((current) => (current === "satellite" ? "carte" : "satellite"))
              }
            >
              <Layers />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="À propos des sources"
              aria-pressed={about}
              onClick={() => setAbout((open) => !open)}
            >
              <Info />
            </Button>
          </div>
        </div>
        {about ? (
          <div className="pointer-events-auto max-h-64 overflow-y-auto rounded-lg border border-border bg-surface p-4 shadow-panel">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg text-fg">Sources</h2>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Fermer"
                onClick={() => setAbout(false)}
              >
                <X />
              </Button>
            </div>
            <AboutCopy />
          </div>
        ) : null}
      </header>

      <aside className="chrome-ne pointer-events-none absolute z-20 hidden w-96 md:flex">
        <div className="panel-desktop pointer-events-auto flex w-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface/95 p-5 shadow-panel">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-subtle">
              {active ? "Étape" : "Prologue"}
            </p>
            <PrevButton stop={active} onSelect={select} />
          </div>
          <DetailScroll className="pr-1">
            {active ? <StopDetail stop={active} /> : <Intro />}
          </DetailScroll>
          <div className="mt-4 shrink-0">
            <NextDestinationButton stop={active} onSelect={select} wide />
          </div>
        </div>
      </aside>

      <div className="chrome-s pointer-events-none absolute z-20">
        <div className="pointer-events-auto rounded-t-lg border border-b-0 border-border bg-surface/95 px-3 py-3 shadow-panel md:rounded-lg md:border-b">
          <div className="mb-2 flex items-center justify-between gap-3 md:hidden">
            <p className="truncate text-sm text-muted">
              {active ? active.name : "Choisissez une étape"}
            </p>
            <div className="flex items-center gap-2">
              <PrevButton stop={active} onSelect={select} />
              <NextDestinationButton stop={active} onSelect={select} />
            </div>
          </div>
          <Timeline activeId={activeId} onSelect={select} />
          <p className="mt-2 hidden text-xs text-subtle md:block">
            Tracé contemporain du fleuve · étapes d'après Carvajal · fonds Esri / CARTO
          </p>
        </div>
      </div>

      <Drawer
        open={isMobile && Boolean(active) && mobileOpen}
        onOpenChange={setMobileOpen}
      >
        <DrawerContent className="md:hidden">
          {active ? (
            <>
              <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-2 pt-4">
                <div>
                  <DrawerTitle>{active.name}</DrawerTitle>
                  <DrawerDescription>{active.dateLabel}</DrawerDescription>
                </div>
                <PrevButton stop={active} onSelect={select} />
              </div>
              <DetailScroll className="px-5">
                <StopDetail stop={active} hideTitle />
              </DetailScroll>
              <div className="shrink-0 px-5 pb-6 pt-3">
                <NextDestinationButton stop={active} onSelect={select} wide />
              </div>
            </>
          ) : null}
        </DrawerContent>
      </Drawer>
    </main>
  );
}
