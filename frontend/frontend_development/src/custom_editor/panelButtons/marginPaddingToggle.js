import { de } from "date-fns/locale";
import React, { useState } from "react";

import MarginPaddingIcon from "../icons/marginPaddingIcon";

const MarginPaddingToggle = ({ settings, handleSetSettings, size }) => {
  const [grid, setGrid] = useState(settings.showMarginAndPadding);

  const toggleGrid = () => {
    setGrid((prevGrid) => {
     return !prevGrid;
    });
    handleSetSettings("showMarginAndPadding", !grid);
  };

  return (
    <div className="grid-toggle" onClick={toggleGrid}>
    
      <MarginPaddingIcon chosen={grid} size={size} />
    </div>
  );
};

export default MarginPaddingToggle;
