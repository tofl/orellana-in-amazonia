import { useEffect, useState, type ComponentType } from "react";
import type { ExpeditionMapProps } from "@/lib/map-view";

export function ClientMap(props: ExpeditionMapProps) {
  const [Map, setMap] = useState<ComponentType<ExpeditionMapProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@/components/expedition-map").then((mod) => {
      if (!cancelled) setMap(() => mod.ExpeditionMap);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Map) {
    return <div className="absolute inset-0 bg-bg" aria-hidden />;
  }

  return <Map {...props} />;
}
