import React from "react";

const BtnChips = ({ title, list, onSelect, selected }) => {
  return (
    <div>
      <p className="mt-4 mb-2 font-semibold text-base text-red-800">{title}</p>
      <div className="flex items-center flex-wrap gap-2">
        {list.map((item, index) => (
          <button
            onClick={() => onSelect(item)}
            key={index}
            className={`transition-all duration-300 p-2 px-4 rounded-md shadow-lg hover:bg-red-800 hover:text-white ${
              selected?.title === item.title
                ? "bg-red-800 text-white font-semibold"
                : "bg-white"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BtnChips;
