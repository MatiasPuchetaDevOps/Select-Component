import React from "react";

function FormatComponent({ defaultFormat, customFormat = false }) {
  return <>{customFormat ? customFormat : defaultFormat}</>;
}

export default FormatComponent;
