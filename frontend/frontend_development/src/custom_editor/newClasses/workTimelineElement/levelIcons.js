import React from "react";
import { convertStyleStringToObject } from "../convertStyleStringToObject";
const IconWrapper = ({ className, style="height: 15px; width: 15px;", children }) => {

    return React.cloneElement(children, { style:convertStyleStringToObject(style), className });
  };
  
  const FilledHeart = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" stroke="currentColor" strokeWidth="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </IconWrapper>
  );
  
  const UnfilledHeart = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </IconWrapper>
  );
  
  const FilledLine = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 20 4">
        <rect width="20" height="4" fill="currentColor" stroke="currentColor"    strokeWidth="1"/>
      </svg>
    </IconWrapper>
  );
  
  const UnfilledLine = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 20 4">
        <rect width="20" height="4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </IconWrapper>
  );
  
  const FilledSquare = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 16 16">
        <rect width="16" height="16" fill="currentColor"  stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
  
  const UnfilledSquare = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 16 16">
        <rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
  
  const FilledDiamond = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 16 16">
        <polygon points="8,0 16,8 8,16 0,8" fill="currentColor" stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
  
  const UnfilledDiamond = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 16 16">
        <polygon points="8,0 16,8 8,16 0,8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
  
  const FilledTriangle = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 16 16">
        <polygon points="8,0 16,16 0,16" fill="currentColor" stroke="currentColor"   strokeWidth="2"/>
      </svg>
    </IconWrapper>
  );
  
  const UnfilledTriangle = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 16 16">
        <polygon points="8,0 16,16 0,16" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
  
  const FilledUpsideDownTriangle = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 16 16">
        <polygon points="0,0 16,0 8,16" fill="currentColor"  stroke="currentColor"  strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
  
  const UnfilledUpsideDownTriangle = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 16 16">
        <polygon points="0,0 16,0 8,16" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
  
  const FilledStar = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
        stroke="currentColor"
          strokeWidth="2"
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    </IconWrapper>
  );
  
  const UnfilledStar = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    </IconWrapper>
  );
  
  const FilledCircle = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="currentColor"  stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
  
  const UnfilledCircle = ({className, style }) => (
    <IconWrapper className={className} style={style}>
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </IconWrapper>
  );
export const typeIcons = {
  star: { filled: FilledStar, unfilled: UnfilledStar },
  heart: { filled:FilledHeart , unfilled:UnfilledHeart  },
  circle: { filled: FilledCircle, unfilled: UnfilledCircle },
  line: { filled:FilledLine , unfilled:UnfilledLine  },
  square: { filled:FilledSquare , unfilled:UnfilledSquare  },
  diamond: { filled:FilledDiamond , unfilled:UnfilledDiamond  },
  triangle: { filled:FilledTriangle , unfilled:UnfilledTriangle  },
  oppositeTriangle: {filled:FilledUpsideDownTriangle, unfilled: UnfilledUpsideDownTriangle}
};
