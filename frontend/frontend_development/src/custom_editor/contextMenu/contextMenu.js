import React, { useState, useEffect, useMemo } from "react";
import PropTypes, { element } from "prop-types";
import findParentIndex from "../newUtils/findParentIndex";
import { getValue, setValue } from "./../newUtils/getValue";
import Modal from "../../containers/components/general/modal";
import NewRowModal from "../NewRowModal";
import findNextNeighbourIndex from "../newUtils/findNextNeighbour";
import findLastDescendantIndex from "../newUtils/findLastDescendant";


/**
What do I want in this contextMenu?
* Select parent X
* Change element to another element
* make freeFloat? X
* Delete X
* Duplicate
* Reset Styles / Copy styles?

 */



export const ContextMenu = ({
  isOpen,
  index,
  rm,
  changeIndex,
  removeElement,
  changeElement,
  onRequestClose, 
  updateRM,// optional
  appendNewElements
}) => {
  const [mousePosition, setMousePosition] = useState(
    isOpen ? { x: isOpen.x, y: isOpen.y } : null
  );

  const [isModalOpen, setIsModalOpen] =useState(false)

  const toggleModal=  ()=>{
    setIsModalOpen(!isModalOpen)
  }

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

  //should at some point probably be transferred or tranformed into 
  //something else.
const switchElementWith = () => {
  const handler = (e) => {
    const target = e.target.closest(".element");
    if (!target) return;

    // find the class that matches "positionX"
    const posClass = Array.from(target.classList).find((cls) =>
      cls.startsWith("position")
    );

    if (posClass) {
      // extract the index number from e.g. "position3"
      const selectedIndex = parseInt(posClass.replace("position", ""), 10);
      
      
      const thisElement={...rm[index]}

      const chosenElement={...rm[selectedIndex]}

      let copy=[...rm]

      copy[selectedIndex]=thisElement
      copy[index]=chosenElement
      
      updateRM(copy, "Switching...")
      
      
      console.log("Clicked element position index:", selectedIndex);
    } else {
      console.log("No position class found on element:", target.classList);
    }

    e.stopPropagation();

    // remove the listener after first click
    document.removeEventListener("click", handler, true);
  };

  // attach listener (capture phase)
  document.addEventListener("click", handler, true);

  document.addEventListener("on")
};


  const append = (elements = [], DEFAULT_ROW=null, changeFlexTo="") => {
  
  
    let UM = [...rm];


let neighbour = findNextNeighbourIndex(index, rm)

  console.log("what is elements", elements, index, neighbour, rm)
// If no neighbour is found, set `neighbour` to `UM.length` to append at the end.
neighbour = neighbour !== -1 ? neighbour : findLastDescendantIndex(index, UM)+1

UM = UM.slice(0, index+1)
.concat(elements)
.concat(UM.slice(neighbour));

  console.log("what is elements", elements, index, neighbour, UM)
if (changeFlexTo!=""){
UM[index].specific_style= setValue("flex-direction",changeFlexTo, UM[index].specific_style, true)
UM[index].specific_style=setValue("display", "flex", UM[index].specific_style, true)

}
    if (elements.length>1){
      UM[index]={...DEFAULT_ROW, depth:DEFAULT_ROW.depth-1}
    }
    updateRM(UM, "appendNewElements");
   }





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

  const itemHover = { background: "#f2f2f2", cursor: 'pointer' };
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
    <>
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

<MenuItem onClick={switchElementWith}>switch element to...</MenuItem>

<MenuItem onClick={toggleModal}>change element to...</MenuItem>


    </div>
    
         <Modal isOpen={isModalOpen} onClose={toggleModal}>
            <NewRowModal appendNewElements={append} closeModal={toggleModal} resourceMeta={rm} position={index} changeElement={changeElement} updateResourceMeta={updateRM} />
        </Modal>
    </>
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
