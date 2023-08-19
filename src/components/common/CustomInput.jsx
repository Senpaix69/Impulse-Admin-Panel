import React from "react";

const CustomInput = ({
  title,
  disabled,
  placeholder,
  value,
  onChange,
  inputType,
}) => {
  return (
    <div>
      <h1 className="text-red-800 font-bold">{title}</h1>
      <input
        name={title}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder}
        type={inputType ? inputType : "text"}
        min={0}
        className="ring-1 disabled:ring-gray-400 ring-red-800"
      />
    </div>
  );
};

export default CustomInput;
