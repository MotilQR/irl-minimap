"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [startFlag, setStartFlag] = useState(false);
  useEffect(() => {
    if (startFlag) {

    }
  },[startFlag]) 
  

  return (
    <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl items-center justify-center h-screen">
      <div className="flex flex-col bg-purple-800 p-6 w-[400px] rounded-lg shadow-lg items-center px-4">
        <h1 className="font-mono text-2xl">Twitch IRL minimap</h1>
        {startFlag ? (
          <p>Started</p>
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
