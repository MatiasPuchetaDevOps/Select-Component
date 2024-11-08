import React from "react";

function FormatComponent({ defaultFormat, isOnClick, item, customFormat }) {
  return <>{customFormat && isOnClick ? customFormat(item) : defaultFormat}</>;
}

export default FormatComponent;
