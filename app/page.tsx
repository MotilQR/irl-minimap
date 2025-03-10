"use client";
import { useState, useEffect } from "react";
import { Copy, Eye, EyeOff } from "lucide-react"; 
import { useRouter } from 'next/navigation'
import  LocationSender  from "@/components/Sender";



export default function Home() {
  const router = useRouter();
  const [startFlag, setStartFlag] = useState(false);
  const [id, setId] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false);
  const [vis, setVis] = useState(true);
  const [cords, setCords] = useState([]);

  useEffect(() => {
      let lock: WakeLockSentinel;
      
      async function requestWakeLock() {
        try {
          lock = await navigator.wakeLock.request("screen");
  
          lock.addEventListener("release", () => {
            console.log("Wake lock released");
          });
  
          console.log("Wake lock active");
        } catch (err) {
          console.error(`Wake Lock error: ${err}`);
        }
      }
  
      requestWakeLock();
  
      return () => {
        if (lock) lock.release();
      };
    }, []);
    
  useEffect(() => { 
    const params = new URLSearchParams(window.location.search)
    const idd = params.get("id");
    setId(idd);
  }, [])

  useEffect(() => {
    console.log(Array.from(cords));
    router.refresh();
  }, [cords])

  useEffect(() => {
    if (startFlag) {
      const idd = String(Date.now());
      setId(idd);
      router.push(`?id=${idd}`)
    }
  },[startFlag]) 

  const handleCopy = async () => {
    const s = `${window.location.origin}/map?id=${id}`;
    await navigator.clipboard.writeText(s);
  }
  

  return (
    <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl items-center justify-center h-screen">
      <div className="flex flex-col bg-purple-800 p-6 w-[400px] rounded-lg shadow-lg items-center px-4 shadow-purple-950 ">
        <h1 className="font-mono text-2xl">Twitch IRL minimap</h1>
        {id ? (
          <div className="flex flex-col gap-2  items-center w-full">
            <div className="flex items-center mt-3 bg-purple-700 rounded-2xl shadow shadow-purple-950 w-full px-4">
              <LocationSender id={id} setIsDone={setIsDone} vis={vis} setCords={setCords}/>
              {isDone ? (
                <div className="flex flex-col gap-4">
                  <button
                    className="cursor-pointer hover:text-gray-300 mr-6 transition-all duration-200"
                    onClick={handleCopy}
                  >
                    <Copy/>
                  </button>
                  <button
                    className="cursor-pointer hover:text-gray-300 mr-6 transition-all duration-200"
                    onClick={() => setVis(!vis)}
                  >
                    {vis ? (
                      <Eye/>
                    ) : (
                      <EyeOff/>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
            <h1 className="text-white">{cords ? cords.join("\n") : ""}</h1>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="px-7 mt-5 text-center">This is web extension for OBS to display minimap on your IRL stream, press button to start!</p>
            <button 
              className="bg-white text-black py-1 px-7 rounded-2xl mt-5 font-mono text-xl cursor-pointer hover:bg-gray-200 w-1/3"
              onClick={() => setStartFlag(true)}
            >
              Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
