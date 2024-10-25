import React from "react";
import SparePartFormat from "./FormatChildrens/SparePartFormat";
import Format_UT_EQ from "./FormatChildrens/Format_UT_EQ";
import NodeTree from "./FormatChildrens/NodeTree";
import FamilyForma from "./FormatChildrens/FamilyForma";
import StaffFormat from "./FormatChildrens/StaffFormat";

function FormatComponent({ type, item, defaultFormat }) {
  return (
    <>
      {typeof item === "object" ? (
        type === "sparepart" ? (
          <SparePartFormat item={item} />
        ) : type === "technicalLocation" || type === "mechanicalEquipaments" ? (
          <Format_UT_EQ item={item} />
        ) : type === "nodeTree" ? (
          <NodeTree location={item} />
        ) : type === "family" ? (
          <FamilyForma item={item} />
        ) : type === "staff" ? (
          <StaffFormat item={item} />
        ) : (
          defaultFormat
        )
      ) : (
        defaultFormat
      )}
    </>
  );
}

export default FormatComponent;
