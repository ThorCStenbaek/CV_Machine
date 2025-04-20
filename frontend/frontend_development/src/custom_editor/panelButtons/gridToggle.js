import { de } from "date-fns/locale";
import React, { useState } from "react";

import GridIcon from "../icons/gridIcon";

const GridToggle = ({ settings, handleSetSettings, size }) => {
  const [grid, setGrid] = useState(settings.showGrid);

  const toggleGrid = () => {
    setGrid((prevGrid) => {
     return !prevGrid;
    });
    handleSetSettings("showGrid", !grid);
  };

  return (
    <div className="grid-toggle" onClick={toggleGrid}>
    
      <GridIcon chosen={grid} size={size} />
    </div>
  );
};

export default GridToggle;
