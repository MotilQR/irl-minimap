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
  const [url, setUrl] = useState<string>("");
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

  // useEffect(() => {
  //   console.log(url.split("/"));
  //   console.log(`https://www.youtube.com/live_chat?v=${url.split("/")[url.split("/").length - 1]}`)
  // }, [url])
    
  useEffect(() => { 
    const params = new URLSearchParams(window.location.search)
    const idd = params.get("id");
    setId(idd);
  }, [])
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
    <div className="flex flex-col gap-5 mx-auto w-full items-center mt-10">
      <div className="flex flex-col bg-purple-800 p-6 w-[400px] rounded-lg shadow-lg items-center px-4 shadow-purple-950 ">
        <h1 className="font-mono text-2xl font-semibold">Twitch IRL minimap</h1>
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
            <h1 className="text-white">{cords ? cords.join(" V ") : ""}</h1>
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="bg-white text-black w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-900 hover:shadow shadow-purple-950"
              placeholder="Enter the stream URL"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="px-7 mt-5 text-center">This is web extension for OBS to display minimap on your IRL stream, press button to start!</p>
            <button 
              className='px-7 py-1 mt-2 bg-white text-black  cursor-pointer select-none
                active:translate-y-1  active:[box-shadow:0_0px_0_0_#e6e6e6,0_0px_0_0_#4e0c7d]
                active:border-b-[0px]
                transition-all duration-150 [box-shadow:0_4px_0_0_#e6e6e6,0_9px_0_0_#4e0c7d]
                rounded-full  border-[0px] border-gray-400'
              onClick={() => setStartFlag(true)}
            >
              Start
            </button>
          </div>
        )}
      </div>
      {url ? (
        <iframe
          src={url.split("/")[2] == "www.youtube.com" ?
            `https://www.youtube.com/live_chat?v=${url.split("/")[url.split("/").length - 1]}&embed_domain=${window.location.hostname}`
          : `https://www.twitch.tv/embed/${url.split("/")[url.split("/").length - 1]}/chat?darkpopout&parent=${window.location.hostname}`
          }
          className="h-[500px] w-[400px] rounded-2xl shadow-purple-950"
        />
      ) : null}
    </div>
  );
}
