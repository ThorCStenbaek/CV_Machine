import React, { useEffect, useState, useRef } from "react";

// Debounce function
const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const DynamicColorEditor = ({
  position,
  resourceMeta,
  updateResourceMeta,
  property, // New prop to specify the CSS property (e.g., "background", "color", etc.)
  defaultColor = "#000000", // Default color for the property
}) => {
  const colorInputRef = useRef(null);

  // Extract the current value of the specified property from the style string
  const extractPropertyValue = (styleString) => {
    const regex = new RegExp(`${property}: ([^;]+);`);
    const match = styleString.match(regex);
    return match ? match[1] : defaultColor; // Default value if not found
  };

  useEffect(() => {
    if (resourceMeta[position] && resourceMeta[position].specific_style) {
      setColor(extractPropertyValue(resourceMeta[position].specific_style));
    }
  }, [resourceMeta, position]);

  const initialColor =
    resourceMeta[position] && resourceMeta[position].specific_style
      ? extractPropertyValue(resourceMeta[position].specific_style)
      : defaultColor;
  const [color, setColor] = useState(initialColor);

  // Debounced function to handle color change
  const debouncedHandleColorChange = debounce((newColor) => {
    if (newColor === color) return;
    if (newColor === "") return;

    setColor(newColor);

    const updatedResourceMeta = [...resourceMeta];
    const currentStyles = updatedResourceMeta[position].specific_style || "";
    const newStyles = `${property}: ${newColor};`;

    if (currentStyles.includes(`${property}:`)) {
      updatedResourceMeta[position].specific_style = currentStyles.replace(
        new RegExp(`${property}: [^;]+;`),
        newStyles
      );
    } else {
      updatedResourceMeta[position].specific_style = currentStyles + newStyles;
    }

    updateResourceMeta(updatedResourceMeta);
  }, 100); // 100 milliseconds delay

  const handleColorChange = (event) => {
    debouncedHandleColorChange(event.target.value);
  };

  const handleSVGClick = () => {
    colorInputRef.current.click();
  };

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

  const backgroundColor = getContrastingColor(color);
  const textColor = "black";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="color"
        ref={colorInputRef}
        value={color}
        onChange={handleColorChange}
        style={{ display: "none" }}
      />

      {/* SVG with dynamic fill color and click handler */}
      <svg
        onClick={handleSVGClick}
        style={{
          cursor: "pointer",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          fill: color,
        }}
      >
        <circle
          cx="20"
          cy="20"
          r="20"
          fill={color}
          stroke={backgroundColor}
          strokeWidth="3"
        />
      </svg>

      <input
        value={color}
        onChange={handleColorChange}
        style={{ fontSize: "16px", color: textColor }}
      />
    </div>
  );
};

export default DynamicColorEditor;