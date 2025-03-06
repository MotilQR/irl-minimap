"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

// Фикс иконки маркера (Leaflet не загружает стандартную)
const markerIcon = new L.Icon({
  iconUrl: "/marker-icon.png", // Можешь заменить на свою иконку
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          map.setView([latitude, longitude], 16); // Центрируем карту на новых координатах
        },
        (error) => {
          console.error("Ошибка геолокации:", error.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [map]);

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function Map() {
  return (
    <div className="w-screen h-screen">
      <MapContainer
        center={[50.0755, 14.4378]} // По умолчанию Прага
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}