import React, { createContext, useState, useContext } from "react";


const ClearSelectContext = createContext();

export const ClearSelectProvider = ({ children }) => {
  const [clearSelectMap, setClearSelectMap] = useState({});

  const triggerClearSelect = (id) => {
    setClearSelectMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setClearSelectMap((prev) => ({ ...prev, [id]: false })), 0); // Reiniciar el estado para futuros clears
  };

  return (
    <ClearSelectContext.Provider value={{ clearSelectMap, triggerClearSelect }}>
      {children}
    </ClearSelectContext.Provider>
  );
};

export const useClearSelect = () => useContext(ClearSelectContext);

