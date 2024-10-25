import React from "react";

function FamilyForma({ item }) {
  return (
    <div>
      {item.code} - {item.name}
    </div>
  );
}

export default FamilyForma;
