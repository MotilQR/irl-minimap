"use client";
import { useState, useEffect, use } from "react";
import { Copy } from "lucide-react"; 
import  LocationSender  from "@/components/Sender";

export default function Home() {
  const [startFlag, setStartFlag] = useState(false);
  const [id, setId] = useState(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (startFlag) {
      console.log(id);
    }
  },[id]) 

  useEffect(() => {
    console.log(isDone);
    if (isDone) console.log("Success!");
  }, [isDone])

  const handleCopy = async () => {
    const s = `${window.location.origin}/map?id=${id}`;
    await navigator.clipboard.writeText(s);
  }
  

  return (
    <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl items-center justify-center h-screen">
      <div className="flex flex-col bg-purple-800 p-6 w-[400px] rounded-lg shadow-lg items-center px-4 shadow-purple-950 ">
        <h1 className="font-mono text-2xl">Twitch IRL minimap</h1>
        {startFlag ? (
          <div className="flex flex-col gap-2  items-center w-full">
            <div className="flex items-center mt-3 bg-purple-700 rounded-2xl shadow shadow-purple-950 w-full px-4">
              <LocationSender setId={setId} setIsDone={setIsDone}/>
              {isDone ? (
              <button
                className="cursor-pointer hover:text-gray-300 mr-6"
                onClick={handleCopy}
              >
                <Copy/>
              </button>
              ) : null}
            </div>
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
