import React, { useState, useEffect } from 'react';

const DraggableDivDown = ({ startPosition,onDragEnd }) => {
  // State to keep track of the current vertical position of the drag
  const [position, setPosition] = useState(0);
  const [startDragPosition, setStartDragPosition] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Mouse down event to start dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartDragPosition(position); // Capture the start Y position of the drag
    e.preventDefault(); // Prevent text selection
  };

  // Mouse move event to handle dragging
  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition((prevPosition) => prevPosition - e.movementY);
    }
  };

  // Mouse up event to stop dragging and report the drag end
  const handleMouseUp = () => {
    setDragging(false);
    // Calculate the difference between start and end Y positions
    const diff = position - startDragPosition;
      // Call the onDragEnd prop with the difference in Y
      console.log("DIFF",diff, position, startDragPosition)
    onDragEnd(diff, startPosition);
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
  }, [dragging, handleMouseMove, handleMouseUp]); // Removed the dependencies on the functions

  // Inline styles for the draggable div
  const divStyle = {
    position: 'absolute',
    bottom: `${position}px`, // Use the state for vertical positioning
    left: '0px',
    cursor: dragging ? 'grabbing' : 'grab',
    zIndex: dragging ? 10 : 1,
    height: '15px',
    width: "100%",
    background: "#007eff",
    display: "flex",
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

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
          transform: 'rotate(270deg) scale(1.5)',
          alignSelf: 'center', // Center the SVG in the div
        }}
      >
        <path d="M14.383 7.076a1 1 0 0 0-1.09.217l-4 4a1 1 0 0 0 0 1.414l4 4A1 1 0 0 0 15 16V8a1 1 0 0 0-.617-.924z" />
      </svg>
    </div>
  );
};

export default DraggableDivDown;
