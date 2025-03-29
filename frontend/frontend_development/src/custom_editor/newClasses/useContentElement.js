import { useState, useRef } from 'react';
import { useContentData } from './useContentData';
export const useContentElement = ({ contentConfig, initialElement, position, changeElement }) => {
    
          const updateTimeoutRef = useRef(null);
    const [contentData, setContentData] = useContentData(
        initialElement.content_data,
        contentConfig
      );
  const [element, setElement] = useState(initialElement);

  const updateElement = (updatedData) => {
    const newElement = { 
      ...element, 
      content_data: updatedData
    };
    setElement(newElement);
    changeElement(position, newElement);
  };

  const handleFieldChange = (field, value) => {
    const updatedData = { ...contentData, [field]: value };
    setContentData(updatedData);
    updateElement(updatedData);
  };

  const deferHandleFieldChange = (field, value) => {

    const el = document.querySelector(`.position${position} .cd-${field}`)
    if (el) el.innerHTML=value


    const updatedData = { ...contentData, [field]: value };
    setContentData(updatedData);

    if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
  
      updateTimeoutRef.current = setTimeout(() => {
          updateElement(updatedData)
        updateTimeoutRef.current = null;
      }, 500);
      //Perhaps set the time up?
  };

  const handleNestedChange = (nestedField, key, value) => {
    const updatedData = { 
      ...contentData, 
      [nestedField]: {
        ...contentData[nestedField],
        [key]: value
      }
    };
    setContentData(updatedData);
    updateElement(updatedData);
  };

  const handleStyleChange = (name, style) => {
    const updatedData = {
      ...contentData,
      innerStyle: {
        ...contentData.innerStyle,
        [name]: style,
      },
    };
    setContentData(updatedData);
    updateElement(updatedData);
  };

  const handleAddItemToArray = (arrayField, item) => {

    const arrayData = [...contentData[arrayField], item];
    const updatedData = { ...contentData, [arrayField]: arrayData};
    setContentData(updatedData);
    updateElement(updatedData);

  };

  return {
    setElement,
    element,
    setContentData,
    updateElement,
    handleFieldChange,
    deferHandleFieldChange,
    handleNestedChange,
    handleStyleChange,
    handleAddItemToArray,
    contentData,
  };
};