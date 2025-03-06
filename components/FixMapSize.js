import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    map.whenReady(() => {
      map.invalidateSize(); // Обновляем размеры карты после загрузки
    });
  }, [map]);

  return null;
}