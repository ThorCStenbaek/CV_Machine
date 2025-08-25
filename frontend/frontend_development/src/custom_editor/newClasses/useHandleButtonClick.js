import { useState, useEffect, useCallback } from "react";
import { mergeStyles } from "./mergeStyles";


export const useHandleClick = (position, element, changeElement, startingMeta) => {
  return useCallback(() => {
    console.log("WHAT ELEMENT", position, element);
    const newElement = { 
      ...startingMeta, 
      depth: element.depth, 
      specific_style: mergeStyles(element.specific_style, startingMeta.specific_style)
    };
    changeElement(position, newElement);
  }, [position, element, changeElement, startingMeta]);
};