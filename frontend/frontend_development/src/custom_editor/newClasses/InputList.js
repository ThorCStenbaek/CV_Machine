import React, {useRef, useState, useEffect} from "react";

const ArrayInputList = ({ items, children, update, position }) => {

  const [itemArray, setItems] = useState(items);
   const updateTimeoutRef = useRef(null);
   
  useEffect(()=>{
    setItems(items)
  },[items])

  const removeItem = (index) => {
    const updatedItems = itemArray.filter((_, i) => i !== index);
    update(updatedItems);
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= itemArray.length) return;
    
    const updatedItems = [...itemArray];
    [updatedItems[index], updatedItems[newIndex]] = 
      [updatedItems[newIndex], updatedItems[index]];
    
    update(updatedItems);
  };

  const deferHandleItemChange = (index, key, value) => {

    const element = document.querySelector(`.position${position} .item${index} .item-${key}`)
    if (element)
      element.innerHTML=value
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], [key]: value };
      return updatedItems;
    });

      
    deferItemChange(index, key, value)
    return
  };

  const deferItemChange = (index, key, value)=>{
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      handleItemChange(index, key, value)
      updateTimeoutRef.current = null;
    }, 500);
  }


  const handleItemChange = (index, key, value) => {
    const updatedItems = itemArray.map((item, i) => 
      i === index ? { ...item, [key]: value } : item
    );
    update(updatedItems);
  };

  return (
    <ul style={{ listStyle: "none", paddingLeft: "0px" }}>
      {itemArray.map((item, index) => (
        <li key={index}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button onClick={() => moveItem(index, -1)}>^</button>
              <button onClick={() => moveItem(index, 1)}>v</button>
            </div>
            
            {children({ 
              item, 
              index, 
              moveItem, 
              removeItem, 
              handleItemChange,
              deferHandleItemChange 
            })}
            
            <button 
              style={{ background: "red" }} 
              onClick={() => removeItem(index)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ArrayInputList;