import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import getSurfaceChildrenFromList from './../../../custom_editor/util/getSurfaceChildrenFromList';

const DraggableDiv = ({ startPosition, onDragEnd, onDragging }) => {
  // State to keep track of the current position and start position of the drag
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Effect to set the initial position based on prop
  useEffect(() => {
    if (startPosition === 'left') {
      setPosition({ x: 0, y: 0 });
    } else if (startPosition === 'right') {
 
      // Assuming the div is positioned absolutely and right: 0 would mean aligning to the screen width
      setPosition({ x: 0, y: 0 });
    }
  }, [startPosition]); // Depend on startPosition prop

  // Mouse down event to start dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartDragPosition(e.clientX); // Capture the start position of the drag
    e.preventDefault(); // Prevent text selection
  };

  // Mouse move event to handle dragging
  const handleMouseMove = (e) => {
      if (dragging) {
        if (startPosition === 'left') {
            let diff = {
              x: e.clientX - startDragPosition
         
              };

            onDragging(diff.x, startPosition, "width")
              setPosition((prevPosition) => ({
                  ...prevPosition,
                  x:  e.clientX, // Update position based on mouse movement
              }));
          }
    else {
      let diff = {
        x:  e.clientX  - startDragPosition
   
        };
      onDragging(diff.x, startPosition, "width")
            setPosition((prevPosition) => ({
                ...prevPosition,
                x: e.clientX, // Update position based on mouse movement
            }));
    }
        }
    
  };

  // Mouse up event to stop dragging and report the drag end
  const handleMouseUp = (e) => {
    
    setDragging(false);
        // Calculate the difference between tart and end positions
      

    let diff = {
      x: e.clientX - startDragPosition
 
      };
      if (startPosition === 'right') {
          
            diff = {
                x:  e.clientX - startDragPosition,
              
            };
       }
    // Call the onDragEnd prop with the difference
      onDragEnd(diff.x, startPosition, "width");
      setPosition({ x: 0, y: 0 });
      
  };

  // Listen to mousemove and mouseup events on the document when dragging
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup',handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

    // Inline styles for the draggable div
    
  let divStyle = {
      position: 'absolute',
      
    left: `${0}px`,
    top: `${0}px`,
      cursor: dragging ? 'grabbing' : 'grab',
    zIndex: dragging ? 10 : 10,
      // Add other styles as needed
              height: '100%',
          width: "15px",
      background: "#007eff",
    display: "flex"
    };
    if (startPosition === 'right') {
      divStyle={
      position: 'absolute',
      
    right: `${0}px`,
    top: `${0}px`,
      cursor: dragging ? 'grabbing' : 'grab',
    zIndex: dragging ? 10 : 10,
          // Add other styles as needed
          height: '100%',
          width: "15px",
          background: "#007eff",
    display: "flex"
    };
    }

return (
  <div
    style={divStyle}
    onMouseDown={handleMouseDown}
 
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{
        fill: 'white',
        transform: startPosition === 'right' ? 'rotate(180deg) scale(1.5)' : 'scale(1.5)',
        maxHeight: "100%"

        // Add any additional styling you need for the SVG
      }}
    >
      <path d="M14.383 7.076a1 1 0 0 0-1.09.217l-4 4a1 1 0 0 0 0 1.414l4 4A1 1 0 0 0 15 16V8a1 1 0 0 0-.617-.924z" />
    </svg>
  </div>
);

};

export default DraggableDiv;
