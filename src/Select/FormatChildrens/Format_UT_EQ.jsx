import React from "react";

function Format_UT_EQ({item}) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-400  text-xs">
        {item.tag || item.serialNumber}
      </span>
      {item.name}
    </div>
  );
}

export default Format_UT_EQ;
