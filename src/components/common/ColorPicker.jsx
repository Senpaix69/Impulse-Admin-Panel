import React, { useState } from "react";

const ColorPicker = ({ onPick }) => {
  const [color, setColor] = useState("#000000");

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  return (
    <div className="flex mt-2 items-center gap-4">
      <h1 className="text-red-800 text-sm font-semibold">Pick Colors</h1>
      <input
        type="color"
        value={color}
        onChange={handleColorChange}
        className="w-8 h-8 rounded-lg"
      />
      <input
        type="text"
        value={color}
        onChange={handleColorChange}
        className="border flex-1 rounded-md px-2 py-1"
      />
      <button
        onClick={() => onPick(color)}
        className="px-3 py-1 bg-red-800 text-white rounded-lg text-sm"
      >
        Add
      </button>
    </div>
  );
};

export default ColorPicker;
