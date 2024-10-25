import { Popover } from "antd";
import React from "react";

function NodeTree({location}) {
  return (
    <Popover
      placement="left"
      title={"Ubicación"}
      content={
        <div className="w-fit max-w-5xl  flex  flex-wrap ">
          {location.route &&location.route.map((item) => (
            <p key={item._id} className="text-xs flex gap-3 px-1">
              {item.name} {item._id !== location._id && <span>{">"}</span>}{" "}
            </p>
          ))}
        </div>
      }
      className="flex truncate"
    >
      <div className="text-left flex flex-col ">
        <p className="text-xs text-gray-300">
          {location.type === "sparePart"
            ? "Repuesto"
            : location.type === "mechanicalEquipment"
            ? "Equipo"
            : location.type === "kitSpareParts"
            ? "Kit de repuestos"
            : location.type === "technicalLocation" ? "Ubicacion tecnica" : ""}
        </p>
        <div className=" font-semibold flex leading-none items-center">
          {location.detail &&<p className="px-2 rounded-md mr-1 ">{location.detail}</p>}
          {location.name || location.description}
        </div>
      </div>
    </Popover>
  );
}

export default NodeTree;
