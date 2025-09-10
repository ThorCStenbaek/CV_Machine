import React, { useState, useEffect, useCallback } from 'react';

export const DraggableAbsolute = ({ direction, onDragEnd, onDragging }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Mouse down event to start dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  // Mouse move event - memoized to avoid stale closures
  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;

      let diff;
      if (direction === 'left' || direction === 'right') {
        diff = { x: e.clientX - startDragPosition.x, y: 0 };
      } else {
        diff = { x: 0, y: e.clientY - startDragPosition.y };
      }

      onDragging(direction, diff);

      setPosition((prev) => ({
        x: direction === 'left' || direction === 'right' ? prev.x + diff.x : prev.x,
        y: direction === 'top' || direction === 'bottom' ? prev.y + diff.y : prev.y,
      }));
    },
    [dragging, direction, startDragPosition, onDragging]
  );

  // Mouse up event - memoized to avoid stale closures
  const handleMouseUp = useCallback((e) => {
    if (!dragging) return;
    setDragging(false);

    let diff;
    if (direction === 'left' || direction === 'right') {
      diff = { x:  e.clientX - startDragPosition.x, y: 0 };
    } else {
      diff = { x: 0, y:  e.clientY - startDragPosition.y };
    }

    onDragEnd(direction, diff);
    setPosition({ x: 0, y: 0 });
  }, [dragging, direction, position, startDragPosition, onDragEnd]);

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
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Style adjustment based on direction
  let divStyle = {
    position: 'absolute',
    cursor: dragging ? 'grabbing' : 'grab',
    zIndex: 10,
    background: 'orange',
    display: 'flex',
  };

  if (direction === 'left') {
    divStyle = { ...divStyle, left: -40, top: 0, height: '100%', width: '25px' };
  } else if (direction === 'right') {
    divStyle = { ...divStyle, right: -40, top: 0, height: '100%', width: '25px' };
  } else if (direction === 'top') {
    divStyle = { ...divStyle, top: -40, left: 0, width: '100%', height: '25px' };
  } else if (direction === 'bottom') {
    divStyle = { ...divStyle, bottom: -40, left: 0, width: '100%', height: '25px' };
  }

  return (
    <div style={divStyle} onMouseDown={handleMouseDown} onMouseEnter={(e) =>e.stopPropagation()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        style={{
          fill: 'white',
          transform:
            direction === 'right'
              ? 'rotate(180deg) scale(1.5)'
              : direction === 'top'
              ? 'rotate(90deg) scale(1.5)'
              : direction === 'bottom'
              ? 'rotate(-90deg) scale(1.5)'
              : 'scale(1.5)',
          maxHeight: '100%',
        }}
      >
        <path d="M14.383 7.076a1 1 0 0 0-1.09.217l-4 4a1 1 0 0 0 0 1.414l4 4A1 1 0 0 0 15 16V8a1 1 0 0 0-.617-.924z" />
      </svg>
    </div>
  );
};
