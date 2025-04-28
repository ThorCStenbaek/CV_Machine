import React, {useRef, useState, useEffect} from "react";

const ArrayInputList = ({ items, children, update, position, collapsedItem = () => <></>, addNewItem, name="Items" }) => {

  const [itemArray, setItems] = useState(items);
   const updateTimeoutRef = useRef(null);
   

   const [collapsed, setCollapsed] = useState(false);
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

   
    // Shared base style
    const buttonBaseStyle = {
      borderRadius: "8px",
      padding: "0.6rem",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.2s ease, transform 0.1s ease",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#eee",
      border: "1px solid #ccc",
      margin: "0px",
      width: "40px",
      height: "40px",
    };
    
    

    // Shared base style
    return (
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "12px",
          backgroundColor: "#fafafa",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
          padding: "1rem",
          maxWidth: "700px",
          margin: "0 auto",
          marginTop: "5px"
        }}
      >
        {/* Collapse Toggle */}
        <div style={{ marginBottom: "1rem", display: "flex" }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              ...buttonBaseStyle,
              padding: "0.4rem 0.8rem",
              fontSize: "0.9rem",
              width: "auto",
              backgroundColor: collapsed ? "#c8e6c9" : "#bbdefb",
              border: "1px solid #90caf9",
              color: "#0d47a1",
            }}
          >
            {collapsed ? `Show ${name} ⬇` : `Hide ${name} ⬆`}
          </button>
        </div>
        {collapsed && (
          <>
          {itemArray.map((item)=> {return(collapsedItem(item))})}
          </>
        )}
    
        {!collapsed && (
          <>
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {itemArray.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.75rem" }}>
                <div
                  className="divBreak"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "1rem",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {/* Move buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <button
                      onClick={() => moveItem(index, -1)}
                      style={{
                        ...buttonBaseStyle,
                        backgroundColor: "#e3f2fd",
                        border: "1px solid #90caf9",
                        color: "#0d47a1",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#bbdefb")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
                      title="Move up"
                    >
                      {/* Up Arrow */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItem(index, 1)}
                      style={{
                        ...buttonBaseStyle,
                        backgroundColor: "#e3f2fd",
                        border: "1px solid #90caf9",
                        color: "#0d47a1",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#bbdefb")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
                      title="Move down"
                    >
                      {/* Down Arrow */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>
    
                  {/* Item content */}
                  <div style={{ flexGrow: 1 }}>
                    {children({
                      item,
                      index,
                      moveItem,
                      removeItem,
                      handleItemChange,
                      deferHandleItemChange,
                    })}
                  </div>
    
                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(index)}
                    style={{
                      ...buttonBaseStyle,
                      backgroundColor: "#ffe3e3",
                      border: "1px solid #f44336",
                      color: "#b71c1c",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ffcdd2")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffe3e3")}
                    title="Delete item"
                  >
                    ✕
                  </button>
                </div>
              </li>

           
            ))}
          </ul>
          <button 
          onClick={addNewItem}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%", // Makes it perfectly round
            width: "50px",
            height: "50px",
            backgroundColor: "#1976d2", // Blue background
            color: "white",
            border: "none",
            cursor: "pointer",
            margin: "1rem auto", // Centers horizontally
            fontSize: "24px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
          title="Add new item"
        >
          +
        </button>
        </>
        )}   
      </div>
    );
    


  

  

  
  
};

export default ArrayInputList;