"use client";

import { useEffect, useState } from "react";

export default function LocationSender({ setId }) {
  const [error, setError] = useState(null);
  const [id, set] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим устройством.");
      return;
    }
    const id = Date.now();
    set(id);
    setId(id);


    const sendLocation = (lat, lng) => {
      console.log(lat, lng);
      fetch(`/api/location/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lng }),
      }).catch((err) => console.error("Ошибка при отправке координат:", err));
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        console.log(pos);
        const { latitude, longitude } = pos.coords;
        sendLocation(latitude, longitude);
      },
      (err) => setError(`Ошибка геолокации: ${err.message}`),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return error ? <p style={{ color: "red" }}>{error}</p> : <p>{`https://irl-minimap.vercel.app/map?id=${id}`}</p>;
}
