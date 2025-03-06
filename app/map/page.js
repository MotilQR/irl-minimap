"use client";
import dynamic from "next/dynamic";

// Отключаем SSR, так как Leaflet не работает на сервере
const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function MapPage() {
  return <DynamicMap />;
}