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
const buildElements = (elements, startIndex = 0, editing, changeElement, chosen, addElements, changeDrag,absoluteDragger, settings ) => {
 
  if (startIndex >= elements.length) {
    console.error(`Error: Element at index ${startIndex - 1} expects more children than are available in the array.`);
    return null;
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

    const child = buildElements(elements, nextIndex, editing, changeElement, chosen,addElements, changeDrag, absoluteDragger, settings );
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



  const solveRules = (rules, position, chosen = false) => { 
 
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
         {((rules.newRowButton && children.length==0) || rules?.newRowButtonAlways) && <button style={{position: "absolute", bottom: "20px", width: "100%", margin:"0px", left:"0px"}} onClick={(e) => { addElements(position) }}>+</button> }
         
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



  let currentElement = null
  let elementStyle= element.specific_style

  if (element.rules?.freeFloat){
      elementStyle= setValue("position", "absolute", elementStyle, true)
      elementStyle= setValue("max-height", "999999px", elementStyle, true)
      elementStyle= setValue("max-width", "999999px", elementStyle, true)
      elementStyle=setValue("z-index",parseInt(getValue("z-index", element.specific_style, true))-1,elementStyle, true)

    }
  if (editing) {




      
      const a = getValue("outline-color", element.specific_style);
      const b = getValue("outline-width", element.specific_style);
      const c = getValue("outline-style", element.specific_style);
      
      let abc = a && b && c ? `${a} ${b} ${c}` :"initial";
// Determine the initial border style based on whether the element is the chosen one
let  initialBorderStyle = startIndex === chosen ? "#007eff 4px solid; " : abc


//consider not having these...
const hasPadding = () => (getValue("padding", element.specific_style, true) || 
  getValue("padding-top", element.specific_style, true) || 
  getValue("padding-bottom", element.specific_style, true) || 
  getValue("padding-left", element.specific_style, true) || 
  getValue("padding-right", element.specific_style,true)) >0

const hasMargin = () => (getValue("margin", element.specific_style, true) || 
  getValue("margin-top", element.specific_style, true) || 
  getValue("margin-bottom", element.specific_style, true) || 
  getValue("margin-left", element.specific_style, true) || 
  getValue("margin-right", element.specific_style,true) ) >0

const newStyle = applyOrGetPseudoStyles(element, false)


    console.log("EBT:", hasMargin(), hasPadding(), element)

const selectedClass= settings.showMarginAndPadding && startIndex === chosen&& (hasPadding()  || hasMargin() ) ?  `selected` : " "



if (element.rules?.freeFloat && startIndex === chosen){
  elementStyle= setValue("position", "fixed", elementStyle, true)
  elementStyle= getValue("position", element.specific_style) ?
  setValue("overflow", "visible", elementStyle, true) : elementStyle
  elementStyle=setValue("z-index",parseInt(getValue("z-index", element.specific_style, true)),elementStyle, true)

}

if (settings.showGrid){
  const boxShadow= getValue("box-shadow", elementStyle)
  if (!boxShadow)
    elementStyle= setValue("box-shadow", "rgba(0, 0, 0, 0.16) 0px 1px 4px;", elementStyle, true)

}



    let isPage = element.instruction === "CONTAINER" ? "page-container" : ""
    
    currentElement = (
  <>
        <ElementComponent
          editing={editing}
    key={Math.random()*100000}
    data={{ ...element, specific_style: `${elementStyle}; outline: ${initialBorderStyle};   ${newStyle} `, class_name: element.class_name+` position${startIndex} ${isPage} ${selectedClass} can-select` }}
    children={children}
    onClick={(e) => {

      handleElementClick(e, startIndex);
    




    }}
    



    
          onMouseOver={(e) => {
            /*
            //Makes it better, but doesnt work
            if(!e.target.className?.includes("can-select"))
              return
*/
        
            e.target.style.cursor = "pointer";
            if (element.instruction != "ELEMENT") {
                e.stopPropagation()
              if (startIndex === chosen)
                 { 
                  
                  }

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

        e.target.style.outline = abc}
      
   

      e.stopPropagation();
          }}
          
          extraElement= { solveRules(element.rules, startIndex, (chosen==startIndex))} 
        >
         
           {element.html_element==='br' ? '': children}
          
         
        </ElementComponent>
      
      {(startIndex === chosen) && false ? <button onClick={(e) => {  e.stopPropagation() }}></button>: null}
        </>
);


    
  }
  else {
    let isPage = element.instruction === "CONTAINER" ? "page-container" : ""
 
     currentElement = (
    <ElementComponent key={startIndex} data={{...element,specific_style:elementStyle, class_name: element.class_name+` position${startIndex} ${isPage}`}} children={children} onClick={()=>console.log("bruh")}>
      {element.html_element==='br' ? '': children}
    </ElementComponent>
  );
  }


 


  return { element: currentElement, nextIndex };
};


const allElements = (jsonData, index=0, editing, changeElement, chosen,addElements, changeDrag,absoluteDragger, settings  ) => {

  let allElements = []
  while (true) {
    let elements = buildElements(jsonData, index, editing, changeElement, chosen, addElements, changeDrag,absoluteDragger, settings );
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
const ElementBuilder = ({ jsonData, editing = false, changeElement, chosen, addElements, changeDrag,absoluteDragger, settings }) => {

  console.log("RERENDER TRIGGERED:", n++, jsonData)

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
  const elements = jsonData.length !== 0 ? allElements(jsonData, 0, editing, changeElement, chosen, addElements, changeDrag, absoluteDragger, settings) : null;


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