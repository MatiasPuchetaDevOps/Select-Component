import React, { useState } from "react";

function SparePartFormat({ item }) {
  return (
    <div className="flex flex-col ">
      <span className="text-gray-400 text-xs">
        {item.visual_code}
      </span>
      {item.description || item.name}
    </div>
  );
}

export default SparePartFormat;
