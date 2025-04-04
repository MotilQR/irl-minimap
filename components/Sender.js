"use client";

import { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";

export default function LocationSender({ id, setIsDone, vis, setCords }) {
  let cords = [];
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим устройством.");
      return;
    }

    const interval = setInterval(() => {
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

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendLocation(latitude, longitude);
          const newEntry = `${latitude} / ${longitude}`;

          setCords((prevCords) => {
            const updated = [...prevCords, newEntry];
            cords.push(newEntry);
            if (updated.length >= 11) {
              cords = [];
              return [];
            }

            return updated;
          });
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
