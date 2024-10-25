import React from "react";

function UnitFormat({ item }) {
  return (
    <div>
      <span className="text-gray-400"> {item.title}</span>
      <div className="flex flex-col pl-2 gap-0.5">
        {item.options.map((value) => (
          <span key={value} className="text-white uppercase ">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export default UnitFormat;
