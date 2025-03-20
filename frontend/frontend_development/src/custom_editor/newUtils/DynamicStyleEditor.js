import React, { useEffect, useState, useRef } from "react";
import { applyOrGetPseudoStyles } from "./applyOrGetPseudoStyles";


// Debounce function
const debounce = (func, delay) => {
  let inDebounce;
  return function (...args) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, args), delay);
  };
};

// Validate CSS values based on property type
const validateCSSValue = (value, property) => {
  if (property === "border-style") {
    // Valid border styles
    const validStyles = [
      "none",
      "hidden",
      "dotted",
      "dashed",
      "solid",
      "double",
      "groove",
      "ridge",
      "inset",
      "outset",
      "initial",
      "inherit",
    ];
    return validStyles.includes(value.trim());
  } else if (property === "border-width") {
    // Validate border-width values
    const regex = /^(auto|0|(\d+(\.\d+)?(px|em|rem|%|vh|vw|cm|mm|in|pt|pc))|calc\(.*\))$/;
    return regex.test(value.trim());
  }
  // Default validation for other properties
  return true;
};

// Get contrasting color for the circle stroke
const getContrastingColor = (hexColor) => {
  if (hexColor.startsWith("#")) {
    hexColor = hexColor.slice(1);
  }
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "grey" : "white";
};

export const DynamicStyleEditor = ({
  position,
  resourceMeta,
  updateResourceMeta,
  property,
  defaultColor = "#000000",
  type = "color",
  options = [], // New prop for select options
  inputName="",
  changeDrag
}) => {
  const inputRef = useRef(null);
  const unitRef = useRef(null);

  // Extract the value of the specified property from the style string
  const extractPropertyValue = (styleString) => {
    const regex = new RegExp(`${property}\\s*:\\s*([^;]+)\\s*;?`);
    const match = styleString.match(regex);
    return match ? match[1].trim() : defaultColor;
  };

  const [value, setValue] = useState(
    resourceMeta[position] && resourceMeta[position].specific_style
      ? extractPropertyValue(resourceMeta[position].specific_style)
      : defaultColor
  );

  useEffect(()=>{
    const val =resourceMeta[position] && resourceMeta[position].specific_style
    ? extractPropertyValue(resourceMeta[position].specific_style)
    : defaultColor

    setValue(val)
      setNumberValue(val.replace(/[^0-9.]/g, "") )
  },[position])

  // Split the value into number and unit parts
  const [numberValue, setNumberValue] = useState(value.replace(/[^0-9.]/g, ""));
  const [unitValue, setUnitValue] = useState(value.replace(/[0-9.]/g, "") || "px");

  // Update the value state immediately on input change
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (type === "number") {
      setNumberValue(newValue);
      debouncedHandleChange(`${newValue}${unitValue}`);
    } else {
      setValue(newValue);
      debouncedHandleChange(newValue);
    }
  };

  // Handle unit change
  const handleUnitChange = (event) => {
    const newUnit = event.target.value;
    setUnitValue(newUnit);
    debouncedHandleChange(`${numberValue}${newUnit}`);
  };

  // Debounced function to update resourceMeta
  const debouncedHandleChange = debounce((newValue) => {
   
    //SUS THAT i commented this out. Just check back on it.
    //if (newValue === value) return;
    if (newValue === ""&& newValue !== "0") return;
  
    // Validate input based on property type
    if (!validateCSSValue(newValue, property)) {
      console.error(`Invalid value for ${property}`);
      return;
    }
 
    const updatedResourceMeta = [...resourceMeta];
    const currentStyles = updatedResourceMeta[position].specific_style || "";
    const newStyles = `${property}: ${newValue};`;

    if (currentStyles.includes(`${property}:`)) {
      updatedResourceMeta[position].specific_style = currentStyles.replace(
        new RegExp(`${property}\\s*:\\s*([^;]+)\\s*;?`),
        newStyles
      );
    } else {
      updatedResourceMeta[position].specific_style = currentStyles + newStyles;
    }

    updateResourceMeta(updatedResourceMeta, "DYNAMIC STYLE EDITOR");
    if (property.includes("left"))
      changeDrag(position, 0, "left", "width", false)
    if (property.includes("right"))
      changeDrag(position, 0, "right", "width", false)
    if (property.includes("top"))
      changeDrag(position, 0, "up","height", false)
    if (property.includes("bottom"))
      changeDrag(position, 0, "down", "height", false)

  }, 300); // Adjust debounce delay as needed

  const handleSVGClick = () => {
    if (type === "color") {
      inputRef.current.click();
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {type === "color" && (
        <input
          type="color"
          ref={inputRef}
          value={value}
          onChange={handleChange}
          style={{ display: "none" }}
        />
      )}
      {type === "text" && (
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={handleChange}
          style={{ fontSize: "16px", width: "100px" }} // Adjust width as needed
        />
      )}
      {type === "select" && (
        <select
          ref={inputRef}
          value={value}
          onChange={handleChange}
          style={{ fontSize: "16px", width: "100px" }} // Adjust width as needed
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      )}
      {type === "number" && (
        <div style={{ display: "flex", gap: "5px" }}>
          <div style={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
            <p style={{marginBottom:'0px', fontSize:"16px"}}>{inputName}</p>
            <div style={{display: 'flex', alignItems:'center'}}>
          <input className="input-boxed"
            type="number"
            ref={inputRef}
            value={numberValue}
            onChange={handleChange}
            style={{ fontSize: "16px", width: "100px" }} // Adjust width as needed
          />
          <span>{unitValue}</span>
          </div>
          </div>
          { options.length>0 &&
          <select
            ref={unitRef}
            value={unitValue}
            onChange={handleUnitChange}
            style={{ fontSize: "16px", width: "100px" }} // Adjust width as needed
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>}
        </div>
      )}

      {type === "color" && (
        <svg
          onClick={handleSVGClick}
          style={{
            cursor: "pointer",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            fill: value,
          }}
        >
          <circle
            cx="20"
            cy="20"
            r="20"
            fill={value}
            stroke={getContrastingColor(value)}
            strokeWidth="3"
          />
        </svg>
      )}
    </div>
  );
};