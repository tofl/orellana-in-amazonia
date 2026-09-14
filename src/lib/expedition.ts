import stops1 from "./stops-1.json";
import stops2 from "./stops-2.json";
import stops3 from "./stops-3.json";

export type StopKind =
  | "depart"
  | "traversee"
  | "construction"
  | "epreuve"
  | "rencontre"
  | "combat"
  | "geographie"
  | "arrivee";

export type Certainty = "documente" | "approxime" | "debattu";

export type ExpeditionStop = {
  id: string;
  index: number;
  name: string;
  modernName: string;
  region: string;
  dateLabel: string;
  dateDetail: string;
  kind: StopKind;
  certainty: Certainty;
  coords: [number, number];
  routeIndex: number;
  reason: string;
  happened: string;
  aftermath?: string;
  quote?: { text: string; attribution: string };
  people: string[];
  facts: { label: string; value: string }[];
  sources: string[];
};

export const KIND_LABEL: Record<StopKind, string> = {
  depart: "Départ",
  traversee: "Traversée",
  construction: "Construction",
  epreuve: "Épreuve",
  rencontre: "Rencontre",
  combat: "Combat",
  geographie: "Géographie",
  arrivee: "Arrivée",
};

export const CERTAINTY_LABEL: Record<Certainty, string> = {
  documente: "Fait documenté",
  approxime: "Lieu reconstitué",
  debattu: "Identification débattue",
};

export const KIND_HINT: Record<StopKind, string> = {
  depart: "Mise en route de l'expédition",
  traversee: "Marche ou navigation de liaison",
  construction: "Chantier naval, réparation",
  epreuve: "Faim, maladie, piège naturel",
  rencontre: "Accueil ou contact riverain",
  combat: "Affrontement armé",
  geographie: "Repère hydrographique nommé",
  arrivee: "Terminus de la descente",
};

/**
 * Polyline following the Andes → Coca → Napo → Amazone → côte des Guyanes → Cubagua.
 * Positions are [lat, lng]. Dense enough to hug the river at mid zooms.
 */
export const ROUTE: [number, number][] = [
  [-0.2201, -78.5123], [-0.28, -78.15], [-0.4, -77.9], [-0.541, -77.626],
  [-0.5, -77.3], [-0.4626, -76.9869], [-0.55, -76.55], [-0.62, -76.2],
  [-0.76, -75.53], [-0.93, -75.4], [-1.15, -75.05], [-1.45, -74.75],
  [-1.85, -74.35], [-2.2, -73.95], [-2.49, -73.71], [-2.9, -73.42],
  [-3.25, -73.22], [-3.448, -73.148], [-3.55, -72.55], [-3.38, -71.9],
  [-3.32, -71.55], [-3.7, -71.05], [-4.05, -70.55], [-4.215, -69.9406],
  [-3.95, -69.35], [-3.55, -68.95], [-3.2, -68.2], [-3.1, -67.94],
  [-2.87, -67.8], [-2.75, -66.77], [-2.51, -66.09], [-2.85, -65.4],
  [-3.35, -64.71], [-3.72, -63.95], [-4.08, -63.14], [-3.84, -62.06],
  [-3.45, -61.05], [-3.3, -60.62], [-3.119, -60.021], [-3.18, -59.35],
  [-3.14, -58.44], [-2.95, -57.7], [-2.63, -56.74], [-2.25, -56.05],
  [-1.9, -55.52], [-2.15, -55.05], [-2.44, -54.7], [-1.99, -54.07],
  [-1.72, -53.35], [-1.52, -52.58], [-1.4, -51.8], [-0.7, -51.35],
  [0.03, -51.05], [0.55, -50.15], [0.9, -49.55], [1.8, -49.2],
  [2.8, -50.1], [4.2, -51.6], [5.6, -53.4], [6.9, -55.2],
  [8.1, -57.8], [9.15, -60.05], [10.15, -61.55], [10.38, -62.3],
  [10.55, -63.15], [10.819, -64.183],
];

export const STOPS = [...stops1, ...stops2, ...stops3] as ExpeditionStop[];

export function routeUntil(routeIndex: number): [number, number][] {
  const end = Math.min(Math.max(routeIndex, 0) + 1, ROUTE.length);
  return ROUTE.slice(0, end);
}

export function stopById(id: string | null): ExpeditionStop | undefined {
  if (!id) return undefined;
  return STOPS.find((s) => s.id === id);
}

export function adjacentStop(id: string, dir: -1 | 1): ExpeditionStop | undefined {
  const i = STOPS.findIndex((s) => s.id === id);
  if (i < 0) return undefined;
  return STOPS[i + dir];
}
