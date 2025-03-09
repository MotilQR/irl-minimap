"use client";

import "./styles.css";
import { useEffect, useState } from "react"; 
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { Commet } from "react-loading-indicators";
import ReactLeafletDriftMarker from "react-leaflet-drift-marker";
import "leaflet/dist/leaflet.css"


const user = new Icon({
    iconUrl: "/navigation.png",
    iconSize: [30, 30] 
})

// function UpdateMapView({ position, direction }) {
//   const map = useMap();

//   useEffect(() => {
//     if (position) {
//       map.setView(position, 15, { animate: true });
//       map.getPane("mapPane").style.transform = `rotate(${-Number(direction)}deg)`;
//     }
//   }, [position, direction, map]); 

//   return null;
// }

function UpdateMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 17, { animate: true });
  }, [position, map]);

  return null;
}

async function fetchLocation(setPos, id) {
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
    getLocation(id).then((data) => {
      if (data) {
        setPos([data.lat, data.lng]);
        //setDir(data.rot);
        console.log(data);
      }
    });
  }
}


export default function Map() {
  const [position, setPosition] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => { 
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id");
    setId(id);
  }, [])

  useEffect(() => {
    if (id) setInterval(() => fetchLocation(setPosition, id), 700);
  }, [id]);
  
  return (
    <div 
      className="w-screen h-screen"
    >
      {position ? (
        <MapContainer
        center={position} 
        zoom={17}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UpdateMap position={position}/>
        <ReactLeafletDriftMarker 
          position={position}
          duration={1000}
          icon={user}
        />
      </MapContainer>
    ) : (
      <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl items-center justify-center h-screen">
        <Commet color="#9706cc" size="medium"/> 
      </div>
    )}
    </div>
  );
}