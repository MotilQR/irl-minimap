"use client";

import { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";
import normalizePath from "@/components/Path";

export default function LocationSender({ id, setIsDone, vis }) {
  let cords = [];
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим устройством.");
      return;
    }

    const interval = setInterval(() => {
      const sendLocation = (cords) => {
        fetch(`/api/location/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cords }),
        }).catch((err) => console.error("Ошибка при отправке координат:", err));
        setIsDone(true);
        setDone(true);
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newEntry = [latitude, longitude];

          cords.push(newEntry);
          if (cords.length == 10) {
            sendLocation(normalizePath(cords));
            cords = []
            cords.push(newEntry);
          }
        },
        (err) => {
          setError(`Ошибка геолокации: ${err.message}`);
        },
        { enableHighAccuracy: true }
      );
    }, 500)

    return () => {
      clearInterval(interval);
    };
  }, []);

  return error ? 
  <p style={{ color: "red" }}>{error}</p> 
  : (done ?( 
      <div className="flex flex-col gap-2">
        <h1 className="text-center font-bold text-xl p-2 text-white">{`${window.location.origin}/map?id=${(vis ? id : "#############")}`}</h1>
      </div>
    ) : <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl items-center"><Commet color="#cb91db" size="medium"/></div>);
}
