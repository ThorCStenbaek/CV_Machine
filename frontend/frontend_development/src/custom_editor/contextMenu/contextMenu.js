import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import findParentIndex from "../newUtils/findParentIndex";
import { getValue, setValue } from "./../newUtils/getValue";

export const ContextMenu = ({
  isOpen,
  index,
  rm,
  changeIndex,
  removeElement,
  changeElement,
  onRequestClose, // optional
}) => {
  const [mousePosition, setMousePosition] = useState(
    isOpen ? { x: isOpen.x, y: isOpen.y } : null
  );

  useEffect(() => {
    if (!isOpen) return;
    setMousePosition({ x: isOpen.x, y: isOpen.y });
  }, [isOpen]);

  // Clamp to viewport so it doesn’t spill off-screen
  const clampedPos = useMemo(() => {
    if (!mousePosition) return { x: 0, y: 0 };
    const MENU_W = 200;
    const MENU_H = 8 * 36;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = Math.min(mousePosition.x, Math.max(8, vw - MENU_W - 8));
    const y = Math.min(mousePosition.y, Math.max(8, vh - MENU_H - 8));
    return { x, y };
  }, [mousePosition]);

  // Optional: close on outside click / ESC
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      const target = e.target;
      if (!target.closest?.('[data-role="contextmenu"]')) {
        onRequestClose && onRequestClose();
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") onRequestClose && onRequestClose();
    };
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [isOpen, onRequestClose]);

  const freeFloat = () => {
    const element = { ...rm[index] };
    const rules = element.rules || {};
    const updatedRules = { ...rules, freeFloat: true };

    // Ensure left/top exist for free-floating
    let s = element.specific_style;
    s = getValue("left", s) ? s : setValue("left", "0px", s, true);
    s = getValue("top", s) ? s : setValue("top", "0px", s, true);

    s=setValue("z-index", 4, s ,true)
    element.rules = updatedRules;
    element.specific_style = s;
    changeElement(index, element);
  };

  if (!isOpen) return null;

  // ——— Inline styles to avoid leaking global button styles ———
  const menuStyle = {
    position: "absolute",
    top: `${clampedPos.y}px`,
    left: `${clampedPos.x}px`,
    minWidth: 200,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 4,
    boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.12)",
    padding: 4,
    zIndex: 9999,
    userSelect: "none",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 13,
  };

  const itemBase = {
    all: "unset", // reset foreign styles (including button styles)
    display: "flex",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "6px 10px",
    borderRadius: 3,
    cursor: "default",
    color: "#111",
    lineHeight: 1.3,
  };

  const itemHover = { background: "#f2f2f2" };
  const itemActive = { background: "#eaeaea" };
  const separatorStyle = { height: 1, background: "#eee", margin: "4px 0" };

  const MenuItem = ({ onClick, disabled, children }) => {
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);
    const style = {
      ...itemBase,
      ...(hover ? itemHover : null),
      ...(active ? itemActive : null),
      ...(disabled ? { opacity: 0.5, pointerEvents: "none" } : null),
    };
    return (
      <button
        type="button"
        role="menuitem"
        style={style}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setActive(false);
        }}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
          onRequestClose && onRequestClose();
        }}
      >
        {children}
      </button>
    );
  };

  return (
    <div
      data-role="contextmenu"
      role="menu"
      style={menuStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      <MenuItem onClick={() => changeIndex(findParentIndex(index, rm))}>
        Select parent
      </MenuItem>

      <div style={separatorStyle} />

      <MenuItem onClick={freeFloat}>Make free-float</MenuItem>

      <div style={separatorStyle} />

      <MenuItem onClick={() => removeElement()}>Delete</MenuItem>
    </div>
  );
};

ContextMenu.propTypes = {
  isOpen: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  index: PropTypes.number.isRequired,
  rm: PropTypes.array.isRequired,
  changeIndex: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
  changeElement: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func,
};
