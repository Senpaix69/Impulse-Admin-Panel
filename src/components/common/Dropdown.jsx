import React, { useEffect, useRef, useState } from "react";

const Dropdown = ({ list, selected, onChange, position }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {list?.length > 0 && selected && (
        <button
          ref={dropdownRef}
          onClick={() => setOpen(!open)}
          className={`absolute flex px-3 items-center text-xs md:text-sm font-normal justify-center gap-2 bg-red-800 h-10 top-16 shadow-md rounded-md ${position}`}
        >
          <p>{selected.title ?? "Select"}</p>
          <svg
            className="-mr-1 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      {open && (
        <div
          className={`absolute flex text-xs md:text-sm flex-col text-black font-normal items-start top-28 bg-white shadow-md gap-1 rounded-md min-w-[100px] ${position}`}
        >
          {list.map((item) => (
            <button
              key={item._id}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={`hover:bg-red-800 p-2 px-6 w-full transition-colors duration-300 hover:text-white ${
                item.title === selected.title
                  ? "bg-red-200 text-red-800 border-r-4 border-red-800 font-semibold"
                  : ""
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Dropdown;
