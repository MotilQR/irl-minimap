"use client";

import "./styles.css";
import { useEffect, useState } from "react"; 
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css"


const user = new Icon({
    iconUrl: "/navigation.png",
    iconSize: [25, 25]
})

export default function Map() {
  const [position, setPosition] = useState(null);
  const [id, setId] = useState(null); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id");
    setId(id);
  }, [])

  useEffect(() => {
    const getLocation = async (id) => {
      try {
        const response = await fetch(`/api/location/${id}`);
        if (!response.ok) throw new Error("Failed to fetch location");
        const data = await response.json();
  
        if (!data.location || !data.location.lat || !data.location.lng) {
          throw new Error("Invalid location data");
        }
  
        return data.location; // Возвращаем координаты
      } catch (err) {
        console.error("Error fetching coordinates:", err);
        return null;
      }
    };
  
    if (id) {
      getLocation(id).then((position) => {
        if (position) {
          console.log(position);
          setPosition(position);
        }
      });
    }
  }, [id]);
  
  return (
    <div className="w-screen h-screen">
      {position ? (
        <MapContainer
        center={position} // По умолчанию Прага
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position ? (
            <Marker position={position} icon={user}></Marker>
        ) : null}
      </MapContainer>
    ) : (
      <h1>Loading</h1>
    )}
    </div>
  );
}