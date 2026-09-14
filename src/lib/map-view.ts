import type { ExpeditionStop } from "@/lib/expedition";

export type Basemap = "satellite" | "carte";

export type ExpeditionMapProps = {
  stops: ExpeditionStop[];
  active: ExpeditionStop | undefined;
  onSelect: (stop: ExpeditionStop) => void;
  basemap: Basemap;
  fitNonce: number;
};
