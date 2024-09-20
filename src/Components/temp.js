import React from "react";

const Watermark = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Watermark layer */}
      <div className="absolute inset-0 flex flex-wrap justify-center items-center opacity-5 pointer-events-none z-50">
        {Array(50).fill().map((_, i) => (
          <div
            key={i}
            className="text-4xl text-black rotate-[-30deg] m-4"
          >
            Hoping Minds
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watermark;
