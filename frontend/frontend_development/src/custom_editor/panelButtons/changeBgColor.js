import React, { useEffect, useState, useRef } from "react";

// Debounce function
const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const ChangeBackgroundColor = ({ position, resourceMeta, updateResourceMeta }) => {
  const colorInputRef = useRef(null);

  const extractColor = (styleString) => {
    const colorMatch = styleString.match(/background: ([^;]+);/);
    return colorMatch ? colorMatch[1] : '#ffffff'; // Default color if not found
  };

  useEffect(() => {
    if (resourceMeta[position] && resourceMeta[position].specific_style) {
      setColor(extractColor(resourceMeta[position].specific_style));
    }
  }, [resourceMeta, position]);

  const initialColor = resourceMeta[position] && resourceMeta[position].specific_style
    ? extractColor(resourceMeta[position].specific_style)
    : '#000';
  const [color, setColor] = useState(initialColor);

  // Debounced function to handle color change
  const debouncedHandleColorChange = debounce((newColor) => {
    if (newColor === color) return;
    if (newColor === "") return;

    setColor(newColor);

    const updatedResourceMeta = [...resourceMeta];
    const currentStyles = updatedResourceMeta[position].specific_style || '';
    const newStyles = `background: ${newColor};`;

    if (currentStyles.includes('background:')) {
      updatedResourceMeta[position].specific_style = currentStyles.replace(/background: [^;]+;/, newStyles);
    } else {
      updatedResourceMeta[position].specific_style = currentStyles + newStyles;
    }

    updateResourceMeta(updatedResourceMeta);
  }, 100); // 500 milliseconds delay

  const handleColorChange = (event) => {
    debouncedHandleColorChange(event.target.value);
  };

  const handleSVGClick = () => {
    colorInputRef.current.click();
  };

  const getContrastingColor = (hexColor) => {
    // If a leading "#" is provided, remove it
    if (hexColor.startsWith("#")) {
      hexColor = hexColor.slice(1);
    }

    // Convert hex to RGB values
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Using the luminance formula to find the YIQ equivalent
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black for bright colors, white for dark colors
    return yiq >= 128 ? "grey" : "white";
  };

  // Calculate background color based on the fill color
  const backgroundColor = getContrastingColor(color);
    

const textColor = 'black';

   return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="color"
        ref={colorInputRef}
        value={color}
        onChange={handleColorChange}
        style={{ display: "none",   }}
      />

      {/* SVG with dynamic fill color and click handler */}
      <svg onClick={handleSVGClick} style={{ cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', fill: color}}>
        <circle cx="20" cy="20" r="20" fill={color} stroke={backgroundColor} strokeWidth="3" />
      </svg>

      <input value=   {color} onChange={handleColorChange} style={{ fontSize: '16px', color: textColor }}>
     
      </input>
      
    </div>
  );

};

export default ChangeBackgroundColor;
