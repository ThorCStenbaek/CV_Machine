import React
 from 'react';
import undoArrow from './arrowSVGs/undoArrow.svg';
import redoArrow from './arrowSVGs/redoArrow.svg';



export default function ArrowButton({ doFunc, canDo, type = 'undo' }) {
  const arrowSrc = type === 'undo' ? undoArrow : redoArrow;


  return (
    <button
      onClick={canDo ? doFunc: undefined}
      disabled={!canDo}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: canDo ? 'pointer' : 'not-allowed',
        opacity: canDo ? 1 : 0.5,
        margin: "5px"
      }}
    >
      <img
        src={arrowSrc}
        alt={`${type} arrow`}
        style={{
          width: '40px',
          height: '40px',
          filter: canDo
            ? 'invert(51%) sepia(35%) saturate(700%) hue-rotate(170deg) brightness(95%) contrast(90%)' // light blue
            : 'grayscale(100%)',
          transition: 'filter 0.3s ease, opacity 0.3s ease',
        }}
      />
    </button>
  );
}
