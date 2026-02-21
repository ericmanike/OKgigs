"use client";

import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-end justify-center w-[300px] h-[100px]">
      {[0, 0.1, 0.2, 0.3].map((delay, i) => (
        <div
          key={i}
          className="w-[20px] h-[10px] mx-[5px] bg-[#232322] rounded-[5px] animate-[loading-wave_1s_ease-in-out_infinite]"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      <style jsx>{`
                @keyframes loading-wave {
                    0%, 100% { height: 10px; }
                    50% { height: 50px; }
                }
            `}</style>
    </div>
  );
}

export default Loader;
