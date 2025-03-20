import React, {useState, useEffect, useRef} from "react";
import ElementComponent
    from "./createElement";
import { json } from "react-router-dom";
import DraggableDiv from "./minor/draggableButton";
import DraggableDivDown from "./minor/draggableDivDown";
import { getValue, setValue } from "../../custom_editor/newUtils/getValue";
import findParentIndex from "../../custom_editor/newUtils/findParentIndex";

import { DraggableAbsolute } from "./minor/draggableAbsolute";

import { applyOrGetPseudoStyles } from './../../custom_editor/newUtils/applyOrGetPseudoStyles';

// Function to build elements recursively
const buildElements = (elements, startIndex = 0, editing, changeElement, chosen, addElements, changeDrag,absoluteDragger ) => {
  console.log("elements",elements)
  if (startIndex >= elements.length) {
    console.error(`Error: Element at index ${startIndex - 1} expects more children than are available in the array.`);
    return null;
  }

console.log("STARTINDEXQ", startIndex)
  
  const solveRules = (rules, position, chosen = false) => { 
 
    console.log("SOLVE RULES:", rules, position, elements[position], chosen, absoluteDragger)
  if (!chosen)
    return null
      const changeDragHandler = (X, side, property) => {
        changeDrag(position, X, side, property, false)
      }
      const changeDragShow = (X, side, property) => {
        changeDrag(position, X, side,property, true)
      }

      const changeAbsoluteDragger=(side, X )=>{
        absoluteDragger( position,side,X, false)
      }
      const absoluteEnd=(side, X)=>{
        absoluteDragger( position,side,X, true)
      }
      return (
        <>
         {rules.newRowButton && <button style={{position: "absolute", bottom: "20px", width: "100%", margin:"0px", left:"0px"}} onClick={(e) => { addElements(position) }}>+</button> }
         
         {rules.draggable && 
         
         <><DraggableDiv startPosition={'left'} onDragEnd={changeDragHandler} onDragging={changeDragShow}/>
          <DraggableDiv startPosition={'right'} onDragEnd={changeDragHandler} onDragging={changeDragShow}/> 
          <DraggableDivDown startPosition={'down'} onDragEnd={changeDragHandler} onDragging={changeDragShow}/>
          <DraggableDivDown startPosition={'up'} onDragEnd={changeDragHandler} onDragging={changeDragShow}/> </> }
   
          {rules.freeFloat && 
          <>
<DraggableAbsolute direction={"left"} onDragEnd={absoluteEnd} onDragging={changeAbsoluteDragger}/>
<DraggableAbsolute direction={"right"} onDragEnd={absoluteEnd} onDragging={changeAbsoluteDragger}/>
<DraggableAbsolute direction={"top"} onDragEnd={absoluteEnd} onDragging={changeAbsoluteDragger}/>
<DraggableAbsolute direction={"bottom"} onDragEnd={absoluteEnd} onDragging={changeAbsoluteDragger}/>
  </>}
</>
          )
}





  const element = elements[startIndex];

  const { depth } = element;
  let nextIndex = startIndex + 1;
  const children = [];

  // Recursively build children
  while(true) {

  

    if (nextIndex >= elements.length) {
      console.error(`Error: Element at index ${startIndex} expects more children than are available in the array.`);
      break; // Exit the loop if there are no more elements to process
    }

    if (elements[nextIndex].depth!=depth+1){
      console.log("DEPTHS:", elements[nextIndex].depth,depth+1 )
      break // ????
    }

    const child = buildElements(elements, nextIndex, editing, changeElement, chosen,addElements, changeDrag, absoluteDragger );
    if (child) { // Ensure child is not null before pushing
      children.push(child.element);
      nextIndex = child.nextIndex;
    } else {
      break; // If child is null, break the loop
    }
  }

  const handleElementClick= (e, index)=>{
    console.log("eDETAIL", e.detail, element.rules, element, elements[index], index)
    switch (e.detail) {
   
      case 1:
        element.rules?.selectable ? changeElement(index) : console.log("ELEMENT IS NOT SELECTABLE");

      if (element.rules?.selectable)
        e.stopPropagation();
        break;
      case 2:
        const parentIndex = findParentIndex(index, elements)
        changeElement(parentIndex)
        if (elements[parentIndex].rules.selectable)
          e.stopPropagation()
        break;
      case 3:
        console.log("triple click");
        break;
    }
  
  
  }


  let currentElement = null
  let elementStyle= element.specific_style

  if (element.rules?.freeFloat){
      elementStyle= setValue("position", "absolute", elementStyle, true)
      elementStyle= setValue("max-height", "999999px", elementStyle, true)
      elementStyle= setValue("max-width", "999999px", elementStyle, true)
      elementStyle=setValue("z-index",parseInt(getValue("z-index", element.specific_style, true))-1,elementStyle, true)

    }
  if (editing) {
    console.log("StartIndex", startIndex, "chosen", chosen);




      
      const a = getValue("outline-color", element.specific_style);
      const b = getValue("outline-width", element.specific_style);
      const c = getValue("outline-style", element.specific_style);
      
      let abc = a && b && c ? `${a} ${b} ${c}` :"initial";
// Determine the initial border style based on whether the element is the chosen one
let  initialBorderStyle = startIndex === chosen ? "#007eff 4px solid; " : abc



const newStyle= applyOrGetPseudoStyles(element, false)



    
const centerEmpty= ""//(element.instruction === "EMPTY" && element.number_of_children === 0) ? "display: flex; justify-content: center; align-items: center;": ""    
  
const selectedClass= startIndex === chosen ?  `selected` : " "

const isAbsolute= getValue("position", element.specific_style) =="absolute"


if (element.rules?.freeFloat && startIndex === chosen){
  elementStyle= setValue("position", "fixed", elementStyle, true)
  elementStyle= getValue("position", element.specific_style) ?
  setValue("overflow", "visible", elementStyle, true) : elementStyle
  elementStyle=setValue("z-index",parseInt(getValue("z-index", element.specific_style, true)),elementStyle, true)
console.log("NEW STYLE THING:", element.specific_style)
}


    if (element.html_element === "p") {
      element.specific_style+= "color: inherit; "
    }
    let isPage = element.instruction === "CONTAINER" ? "page-container" : ""
    
    currentElement = (
  <>
        <ElementComponent
          editing={editing}
    key={Math.random()*100000}
    data={{ ...element, specific_style: `${elementStyle}; outline: ${initialBorderStyle};   ${newStyle} `, class_name: element.class_name+` position${startIndex} ${isPage} ${selectedClass}` }}
    children={children}
    onClick={(e) => {
      console.log("I AM CLICKED");
      handleElementClick(e, startIndex);
    




    }}
    



    
          onMouseOver={(e) => {
            console.log("START MOUSEOVER", startIndex, elements[startIndex])

        
            e.target.style.cursor = "pointer";
            if (element.instruction != "ELEMENT") {
                e.stopPropagation()
              if (startIndex === chosen) { console.log(" INSstartIndex:", startIndex, " chosen:", chosen) }

              else {
                if(element.rules.selectable)
                   e.target.style.outline = "blue 1px solid";
                e.stopPropagation();
              }
              e.stopPropagation();
            }
            else {

              e.target.style.outline = abc
              if (element.instruction != "ELEMENT")
              e.stopPropagation();
            }
          }

    }
    onMouseOut={(e) => {
      // Only change the border style back to initial for non-chosen elements
      if (startIndex === chosen) {
        //e.target.border = "purple 4px solid"
      }
      else{
console.log("MOUSE OUT;",abc, element.specific_style)
        e.target.style.outline = abc}
      
   

      e.stopPropagation();
          }}
          
          extraElement= { solveRules(element.rules, startIndex, (chosen==startIndex))} 
        >
         
           {element.html_element==='br' ? '': children}
          
         
        </ElementComponent>
      
      {(startIndex === chosen) && false ? <button onClick={(e) => { console.log("bruh"); e.stopPropagation() }}></button>: null}
        </>
);


    
  }
  else {
    let isPage = element.instruction === "CONTAINER" ? "page-container" : ""
    console.log("ISPAGE", isPage, element)
     currentElement = (
    <ElementComponent key={startIndex} data={{...element,specific_style:elementStyle, class_name: element.class_name+` position${startIndex} ${isPage}`}} children={children} onClick={()=>console.log("bruh")}>
      {element.html_element==='br' ? '': children}
    </ElementComponent>
  );
  }


 


  return { element: currentElement, nextIndex };
};


const allElements = (jsonData, index=0, editing, changeElement, chosen,addElements, changeDrag,absoluteDragger  ) => {

  let allElements = []
  while (true) {
    let elements = buildElements(jsonData, index, editing, changeElement, chosen, addElements, changeDrag,absoluteDragger );
    if (elements == null) {
    break
    }
    allElements.push(elements)

    index = elements.nextIndex
    if (index == jsonData.length) {
      break
    }
  }
  return allElements
}

let n=0

// Main function to initiate the recursive building of elements
const ElementBuilder = ({ jsonData, editing = false, changeElement, chosen, addElements, changeDrag,absoluteDragger }) => {
  console.log("json", jsonData);
  console.log("RERENDER TRIGGERED:", n++)

  //const elementRef = useRef(null); // Ref for the .resource-elements div

  // This function decides whether to show lines based on the div's height and the editing state
  /*
  useEffect(() => {
    if (!editing) {
      setLines([]);
      return;
    }

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        const newLines = [];
        const basePx = 1191; // 1191
        const numberOfLines = Math.floor(height / basePx);

        for (let i = 1; i <= numberOfLines; i++) {
          newLines.push(i * basePx);
        }

        setLines(newLines);
      }
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [editing]); // Dependency on editing ensures this effect runs when editing state changes
*/
  const elements = jsonData.length !== 0 ? allElements(jsonData, 0, editing, changeElement, chosen, addElements, changeDrag, absoluteDragger) : null;
console.log("ELEMENTS", elements,jsonData)

  if (elements.length == 1 && jsonData[0].instruction == "PDF")
    return ( elements.map((element, index) => <div key={index}>{element.element}</div>))
  
  return (
    <>

      <div className="resource-elements" >
        {elements ? elements.map((element, index) => <div key={index}>{element.element}</div>) : null}

      </div>

    </>
  );
};



export default ElementBuilder;