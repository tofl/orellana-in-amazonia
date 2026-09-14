import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ROUTE, routeUntil, type ExpeditionStop } from "@/lib/expedition";
import type { ExpeditionMapProps } from "@/lib/map-view";

export type { Basemap, ExpeditionMapProps } from "@/lib/map-view";

function makeIcon(stop: ExpeditionStop, selected: boolean, reached: boolean) {
  const size = selected ? 34 : 28;
  const classes = [
    "stop-marker-dot",
    selected ? "is-selected" : "",
    reached ? "is-reached" : "",
    stop.kind === "combat" ? "is-combat" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return L.divIcon({
    className: "stop-marker",
    html: `<div class="${classes}" aria-hidden="true">${stop.index}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function stopZoom(stop: ExpeditionStop): number {
  if (
    stop.id === "quito" ||
    stop.id === "sumaco" ||
    stop.id === "coca" ||
    stop.id === "separation"
  ) {
    return 8;
  }
  if (stop.id === "atlantique" || stop.id === "paria" || stop.id === "cubagua") {
    return 6;
  }
  return 7;
}

function MapController({
  active,
  fitNonce,
}: {
  active: ExpeditionStop | undefined;
  fitNonce: number;
}) {
  const map = useMap();
  const fitted = useRef(false);
  const lastFit = useRef(0);

  useEffect(() => {
    if (fitted.current) return;
    fitted.current = true;
    map.fitBounds(L.latLngBounds(ROUTE), {
      padding: [56, 56],
      maxZoom: 5,
    });
  }, [map]);

  useEffect(() => {
    if (fitNonce === 0 || fitNonce === lastFit.current) return;
    lastFit.current = fitNonce;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.flyToBounds(L.latLngBounds(ROUTE), {
      padding: [56, 56],
      maxZoom: 5,
      duration: reduce ? 0 : 1.15,
    });
  }, [fitNonce, map]);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.flyTo(active.coords, stopZoom(active), {
      duration: reduce ? 0 : 1.2,
    });
  }, [active, map]);

  return null;
}

export function ExpeditionMap({
  stops,
  active,
  onSelect,
  basemap,
  fitNonce,
}: ExpeditionMapProps) {
  const progress = useMemo(
    () => routeUntil(active?.routeIndex ?? 0),
    [active],
  );
  const activeIndex = active?.index ?? 0;

  const icons = useMemo(
    () =>
      stops.map((stop) =>
        makeIcon(stop, stop.id === active?.id, stop.index <= activeIndex),
      ),
    [stops, active?.id, activeIndex],
  );

  return (
    <MapContainer
      center={[-3.2, -62]}
      zoom={4}
      minZoom={3}
      maxZoom={12}
      className="absolute inset-0 h-full w-full"
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom
    >
      {basemap === "satellite" ? (
        <>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri, Maxar, Earthstar Geographics"
          />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            attribution="CARTO"
          />
        </>
      ) : (
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="OpenStreetMap, CARTO"
        />
      )}
      <Polyline
        positions={ROUTE}
        pathOptions={{
          color: "var(--color-muted)",
          weight: 2,
          opacity: 0.35,
        }}
      />
      <Polyline
        positions={progress}
        pathOptions={{
          color: "var(--color-accent)",
          weight: 3.5,
          opacity: 0.95,
        }}
      />
      {stops.map((stop, i) => (
        <Marker
          key={stop.id}
          position={stop.coords}
          icon={icons[i]}
          title={`${stop.index}. ${stop.name}`}
          zIndexOffset={stop.id === active?.id ? 1000 : stop.index}
          eventHandlers={{ click: () => onSelect(stop) }}
        />
      ))}
      <ZoomControl position="bottomleft" />
      <MapController active={active} fitNonce={fitNonce} />
    </MapContainer>
  );
}
