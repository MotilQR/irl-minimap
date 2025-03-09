"use client";

import { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";

export default function LocationSender({ id, setIsDone, vis }) {
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим устройством.");
      return;
    }


    const sendLocation = (lat, lng) => {
      fetch(`/api/location/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lng }),
      }).catch((err) => console.error("Ошибка при отправке координат:", err));
      setIsDone(true);
      setDone(true);
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
  }, [navigator.geolocation]);

  return error ? <p style={{ color: "red" }}>{error}</p> : (done ? <h1 className="text-center font-bold text-xl p-2 text-white">{`${window.location.origin}/map?id=${(vis ? id : "#############")}`}</h1> : <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl items-center"><Commet color="#cb91db" size="medium"/></div>);
}
