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
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLocation() {
          try {
            const response = await fetch("/api/getLoc", {
              method: "POST", // Теперь используем POST-запрос
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code: "MY_SECRET_CODE" }), // Передаём код в body
            });
      
            if (!response.ok) {
              throw new Error("Ошибка запроса: " + response.status);
            }
      
            const data = await response.json();
            setLocation(data);
          } catch (err) {
            console.error("Ошибка:", err);
            setError(err.message);
          }
        }
      
        fetchLocation();
      }, []);

      console.log(error);
      console.log(location);

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