"use client";

import "./styles.css";
import { useEffect, useState } from "react"; 
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css"


const user = new Icon({
    iconUrl: "/navigation.png",
    iconSize: [25, 25]
})

function GetPos({ setPosition }) {
  const map = useMap();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          map.setView([latitude, longitude], 13); // Центрируем карту на новых координатах
        },
        (error) => {
          console.error("Ошибка геолокации:", error.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [map]);
}

export default function Map() {
    const [position, setPosition] = useState(null);

  return (
    <div className="w-screen h-screen">
      <MapContainer
        center={[50.0755, 14.4378]} // По умолчанию Прага
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GetPos setPosition={setPosition}/>
        {position ? (
            <Marker position={position} icon={user}></Marker>
        ) : null}
      </MapContainer>
    </div>
  );
}