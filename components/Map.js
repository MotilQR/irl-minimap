"use client";

import "./styles.css";
import { useEffect, useState, useRef } from "react"; 
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { Commet } from "react-loading-indicators";
import "leaflet/dist/leaflet.css"


const user = new Icon({
    iconUrl: "/navigation.png",
    iconSize: [30, 30] 
})

export default function SmoothMarker({ position, icon }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!markerRef.current || !position) return;

    const marker = markerRef.current;
    const start = marker.getLatLng();
    const end = L.latLng(position);

    if (!start.equals(end)) {
      const duration = 1000; // Длительность анимации (в мс)
      let startTime;

      function animateMarker(time) {
        if (!startTime) startTime = time;
        const progress = (time - startTime) / duration;

        if (progress < 1) {
          const newLat = start.lat + (end.lat - start.lat) * progress;
          const newLng = start.lng + (end.lng - start.lng) * progress;
          marker.setLatLng([newLat, newLng]);
          requestAnimationFrame(animateMarker);
        } else {
          marker.setLatLng(end);
        }
      }

      requestAnimationFrame(animateMarker);
    }
  }, [position]);

  return <Marker ref={markerRef} position={position} icon={icon} />;
}

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
    if (id) setInterval(() => fetchLocation(setPosition, id), 1000);
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
        <SmoothMarker position={position} icon={user}/>
      </MapContainer>
    ) : (
      <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl items-center justify-center h-screen">
        <Commet color="#9706cc" size="medium"/> 
      </div>
    )}
    </div>
  );
}