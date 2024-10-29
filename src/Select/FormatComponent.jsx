import React from "react";

function FormatComponent({ defaultFormat, item, customFormat }) {
  return <>{customFormat ? customFormat(item) : defaultFormat}</>;
}

export default FormatComponent;
