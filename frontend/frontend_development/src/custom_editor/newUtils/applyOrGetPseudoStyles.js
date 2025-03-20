import { getValue } from "./getValue";

export function applyOrGetPseudoStyles(element, applyStyles = false, position) {
    const htmlElement = document.querySelector(`.position${position}`);
    if (!element) return '';

    let styles;

    if (applyStyles) {
        const computedStyle = getComputedStyle(htmlElement);
        styles = {
          "--margin-top": computedStyle.getPropertyValue("margin-top") || "0px",
          "--margin-right": computedStyle.getPropertyValue("margin-right") || "0px",
          "--margin-bottom": computedStyle.getPropertyValue("margin-bottom") || "0px",
          "--margin-left": computedStyle.getPropertyValue("margin-left") || "0px",
          
          "--padding-top": computedStyle.getPropertyValue("padding-top") || "0px",
          "--padding-right": computedStyle.getPropertyValue("padding-right") || "0px",
          "--padding-bottom": computedStyle.getPropertyValue("padding-bottom") || "0px",
          "--padding-left": computedStyle.getPropertyValue("padding-left") || "0px",

          "--max-width": computedStyle.getPropertyValue("width") || "0px",
          "--max-height": computedStyle.getPropertyValue("height") || "0px",
          "--background": computedStyle.getPropertyValue("background") || "white",
        };
    } else {
        if (!element.specific_style) return '';
        styles = {
          "--margin-top": (getValue("margin-top", element.specific_style, true) || 0) + "px",
          "--margin-right": (getValue("margin-right", element.specific_style, true) || 0) + "px",
          "--margin-bottom": (getValue("margin-bottom", element.specific_style, true) || 0) + "px",
          "--margin-left": (getValue("margin-left", element.specific_style, true) || 0) + "px",
          
          "--padding-top": (getValue("padding-top", element.specific_style, true) || 0) + "px",
          "--padding-right": (getValue("padding-right", element.specific_style, true) || 0) + "px",
          "--padding-bottom": (getValue("padding-bottom", element.specific_style, true) || 0) + "px",
          "--padding-left": (getValue("padding-left", element.specific_style, true) || 0) + "px",

          "--max-width": (getValue("width", element.specific_style, true) || 0) + "px",
          "--max-height": (getValue("height", element.specific_style, true) || 0) + "px",
          "--background": getValue("background", element.specific_style) || "white",
        };
    }

    let newStyle = Object.entries(styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n");

    if (applyStyles) {
        const el = document.querySelector(`.position${position}`);
        if (el) {
            Object.entries(styles).forEach(([key, value]) => {
                el.style.setProperty(key, value.toString()); // Ensure values are strings
            });
        }
    }

    return newStyle;
}
