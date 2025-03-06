"use client";

import { useEffect, useState } from "react";

export default function LocationSender() {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим устройством.");
      return;
    }

    const sendLocation = (latitude, longitude) => {
      fetch("/api/pushLoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude, code: "MY_SECRET_CODE" }),
      }).catch((err) => console.error("Ошибка при отправке координат:", err));
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        sendLocation(latitude, longitude);
      },
      (err) => setError(`Ошибка геолокации: ${err.message}`),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return error ? <p style={{ color: "red" }}>{error}</p> : <p>Отправка координат...</p>;
}
