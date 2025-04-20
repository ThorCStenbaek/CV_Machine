import React, { useState, useEffect } from 'react';

const DraggableDivDown = ({ startPosition,onDragEnd, onDragging }) => {
  // State to keep track of the current vertical position of the drag
  const [position, setPosition] = useState(0);
  const [startDragPosition, setStartDragPosition] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Mouse down event to start dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartDragPosition(e.clientY); // Capture the start Y position of the drag
    e.preventDefault(); // Prevent text selection
  };

  // Mouse move event to handle dragging
  const handleMouseMove = (e) => {
    if (dragging) {
      const diff =-1* ( e.clientY-startDragPosition ) 
      console.log("DRAGGING DOWN", position, e.movementY, startDragPosition, e.clientY,diff,e)
     //- startDragPosition;
      onDragging(diff, startPosition, "height")
      setPosition((prevPosition) => e.clientY);
    }
  };

  // Mouse up event to stop dragging and report the drag end
  const handleMouseUp = (e) => {
    setDragging(false);
    // Calculate the difference between start and end Y positions
    const diff =-1* ( e.clientY-startDragPosition ) 
      // Call the onDragEnd prop with the difference in Y
      console.log("DIFF",diff, position, startDragPosition)
    onDragEnd(diff, startPosition, "height");
    setPosition(0); // Reset the Y position to 0
  };

  // Listen to mousemove and mouseup events on the document when dragging
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown,handleMouseMove, handleMouseUp]); // Removed the dependencies on the functions

  // Inline styles for the draggable div
  const divStyle = {
    position: 'absolute',
    bottom: `${0}px`, // Use the state for vertical positioning
    left: '0px',
    cursor: dragging ? 'grabbing' : 'grab',
    zIndex: dragging ? 10 : 10,
    height: '15px',
    width: "100%",
    background: "#007eff",
    display: "flex",
    flexDirection: 'column',
    alignItems: 'flex-start',
  };
  if (startPosition=="up"){
    divStyle.bottom=undefined;
    divStyle.top="0px"
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
          transform:  startPosition=="down" ?'rotate(270deg) scale(1.5)' :'rotate(90deg) scale(1.5)',
          alignSelf: 'center', // Center the SVG in the div
        }}
      >
        <path d="M14.383 7.076a1 1 0 0 0-1.09.217l-4 4a1 1 0 0 0 0 1.414l4 4A1 1 0 0 0 15 16V8a1 1 0 0 0-.617-.924z" />
      </svg>
    </div>
  );
};

export default DraggableDivDown;
