import { de } from "date-fns/locale";
import React, { useState } from "react";

import GridIcon from "../icons/gridIcon";

const GridToggle = ({ resourceMeta, updateResourceMeta, size }) => {
  const [grid, setGrid] = useState(true);

  const toggleGrid = () => {
    setGrid((prevGrid) => {
      // Determine the new boxShadow value based on the new state
      const boxShadowValue = prevGrid ? " box-shadow: none;" : " box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;";
      const resourceMetaCopy = [...resourceMeta];
      
      // Select all elements that need the boxShadow style updated
      for (let i = 0; i < resourceMetaCopy.length; i++) {
        if (['EMPTY', 'TEXT', 'IMAGE'].includes(resourceMetaCopy[i].instruction)) {
          // Check if 'box-shadow' is already present in the specific_style
          if (/box-shadow\s*:\s*[^;]+;/.test(resourceMetaCopy[i].specific_style)) {
            // If present, replace it
            resourceMetaCopy[i].specific_style = resourceMetaCopy[i].specific_style.replace(/box-shadow\s*:\s*[^;]+;/g, boxShadowValue);
          } else {
              console.log("UPDATING, NOT FOUND")
            // If not present, add it
            // Ensure there's a semicolon at the end of existing styles if they exist
            if (resourceMetaCopy[i].specific_style && !resourceMetaCopy[i].specific_style.trim().endsWith(";")) {
              resourceMetaCopy[i].specific_style += "; ";
            }
            resourceMetaCopy[i].specific_style += boxShadowValue;
          }
        }
      }
      
      console.log("UPDATING", resourceMetaCopy);
      updateResourceMeta(resourceMetaCopy, "GRID TOGGLE");
      
      // Return the opposite of the previous grid state
      return !prevGrid;
    });
  };

  return (
    <div className="grid-toggle" onClick={toggleGrid}>
    
      <GridIcon chosen={grid} size={size} />
    </div>
  );
};

export default GridToggle;
