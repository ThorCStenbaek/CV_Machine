import React, { useEffect, useState, useRef } from "react";
import { setValue as setStyle } from "./getValue";
import { getValue } from "./getValue";

// Debounce function
const debounce = (func, delay) => {
  let inDebounce;
  return function (...args) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, args), delay);
  };
};

// Helper function to parse any CSS color to hex
const parseColorToHex = (color) => {
  if (!color) return "#000000";
  
  // If it's already hex
  if (color.startsWith('#')) {
    return color.length === 4 ? 
      `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` : 
      color;
  }

  // If it's rgb or rgba
  if (color.startsWith('rgb')) {
    const rgbaRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
    const match = color.match(rgbaRegex);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  }

  // For named colors, you'd need a more comprehensive solution
  return "#000000"; // default fallback
};

const DynamicColorEditor = ({
  position,
  resourceMeta,
  updateResourceMeta,
  property,
  defaultColor = "#000000",
}) => {
  const colorInputRef = useRef(null);
  const [color, setColor] = useState(defaultColor);
  const [opacity, setOpacity] = useState(1);
  const [contrastColor, setContrastColor] = useState("grey");

  // Extract and parse the initial color
  useEffect(() => {
    if (resourceMeta[position] && resourceMeta[position].specific_style) {
      const styleValue = getValue(property, resourceMeta[position].specific_style) || defaultColor;
      
      const hexColor = parseColorToHex(styleValue);
      setColor(hexColor);
      
      // Extract opacity if it's rgba
      if (styleValue.startsWith('rgba')) {
        const opacityMatch = styleValue.match(/rgba\(.*,\s*([\d.]+)\)/);
        if (opacityMatch) {
          setOpacity(parseFloat(opacityMatch[1]));
        }
      }
      
      // Calculate contrast color
      const newContrast = getContrastingColor(hexColor);
      setContrastColor(newContrast);
    }
  }, [resourceMeta, position, property, defaultColor]);

  // Update contrast color when color changes
  useEffect(() => {
    setContrastColor(getContrastingColor(color));
  }, [color]);

  const debouncedHandleColorChange = debounce((newColor, newOpacity) => {
    if (newColor === color && newOpacity === opacity) return;
    
    const rgbaColor = `rgba(${parseInt(newColor.slice(1, 3), 16)}, ${parseInt(newColor.slice(3, 5), 16)}, ${parseInt(newColor.slice(5, 7), 16)}, ${newOpacity})`;

    const updatedResourceMeta = [...resourceMeta];
    updatedResourceMeta[position].specific_style = setStyle(
      property,
      rgbaColor,
      updatedResourceMeta[position].specific_style,
      true
    );

    updateResourceMeta(updatedResourceMeta, "DYNAMIC COLOR SELECTOR");
  }, 100);

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    debouncedHandleColorChange(newColor, opacity);
  };

  const handleOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setOpacity(newOpacity);
    debouncedHandleColorChange(color, newOpacity);
  };

  const handleSVGClick = () => {
    colorInputRef.current.click();
  };

  const getContrastingColor = (hexColor) => {
    if (!hexColor.startsWith("#")) return "grey";
    
    hexColor = hexColor.slice(1);
    if (hexColor.length === 3) {
      hexColor = hexColor.split('').map(c => c + c).join('');
    }
    
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "grey" : "white";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="color"
          ref={colorInputRef}
          value={color}
          onChange={handleColorChange}
          style={{ display: "none" }}
        />

        <svg
          onClick={handleSVGClick}
          style={{
            cursor: "pointer",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
        >
          <circle
            cx="20"
            cy="20"
            r="18"  // Slightly smaller to account for stroke
            fill={color}
            stroke={contrastColor}
            strokeWidth="3"
          />
        </svg>

        <input
          value={color}
          onChange={handleColorChange}
          style={{ 
            fontSize: "16px", 
            color: getContrastingColor(color) === "grey" ? "black" : "white",
            backgroundColor: color,
            padding: "5px",
            borderRadius: "4px"
          }}
        />
      </div>

{  /*    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={handleOpacityChange}
          style={{ width: "100px" }}
        />
        <span>{Math.round(opacity * 100)}%</span>
      </div> */}
    </div>
  );
};

export default DynamicColorEditor;