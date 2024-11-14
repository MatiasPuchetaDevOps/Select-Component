import React from "react";

function FormatComponent({ defaultFormat, item, customFormat }) {
  return <>{typeof customFormat === "function"  ? customFormat(item) : defaultFormat}</>;
}

export default FormatComponent;
