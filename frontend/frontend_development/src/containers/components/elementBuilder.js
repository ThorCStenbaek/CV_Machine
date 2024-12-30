import React, {useState, useEffect, useRef} from "react";
import ElementComponent
    from "./createElement";
import { json } from "react-router-dom";
import DraggableDiv from "./minor/draggableButton";
import DraggableDivDown from "./minor/draggableDivDown";



// Function to build elements recursively
const buildElements = (elements, startIndex = 0, editing, changeElement, chosen, addElements, changeDrag ) => {
  console.log("elements",elements)
  if (startIndex >= elements.length) {
    console.error(`Error: Element at index ${startIndex - 1} expects more children than are available in the array.`);
    return null;
  }

console.log("STARTINDEXQ", startIndex)
  
  const solveInstruction = (instruction, position, chosen = false) => { 
    console.log("INSTRUCTION", instruction, "POSITION", position, "CHOSEN", chosen)
  switch (instruction) {
  
    case "CONTAINER":
     
      return <button onClick={(e) => { addElements(position) }}>+</button>
    
    case "EMPTY":
    case "IMAGE":
    case "TEXT":
    case "VIDEO":
      if (!chosen)
        return null
      const changeDragHandler = (X, side) => {
        changeDrag(position, X, side)
      }
      return (
        <>
          <DraggableDiv startPosition={'left'} onDragEnd={changeDragHandler} />
          <DraggableDiv startPosition={'right'} onDragEnd={changeDragHandler} /> 
          <DraggableDivDown startPosition={'down'} onDragEnd={changeDragHandler}/>
        </>
          )
          
    default: 
        return null
  }

}



  const element = elements[startIndex];

  const { number_of_children } = element;
  let nextIndex = startIndex + 1;
  const children = [];

  // Recursively build children
  for (let i = 0; i < number_of_children; i++) {
    if (nextIndex >= elements.length) {
      console.error(`Error: Element at index ${startIndex} expects more children than are available in the array.`);
      break; // Exit the loop if there are no more elements to process
    }
    const child = buildElements(elements, nextIndex, editing, changeElement, chosen,addElements, changeDrag );
    if (child) { // Ensure child is not null before pushing
      children.push(child.element);
      nextIndex = child.nextIndex;
    } else {
      break; // If child is null, break the loop
    }
  }

  // Create the current element with its children
  console.log("children", children)

  let currentElement = null
  
  if (editing) {
    console.log("StartIndex", startIndex, "chosen", chosen);

// Determine the initial border style based on whether the element is the chosen one
let  initialBorderStyle = startIndex === chosen ? "#007eff 4px solid; " : "initial";


    let ei= element.instruction
    if ((ei=='EMPTY' || ei=='TEXT' || ei=='IMAGE' ) && startIndex==chosen) {
  initialBorderStyle+= "border-left: 0px; border-right: 0px; padding: 0 15px; border-bottom: 0px;"
}
    
const centerEmpty= (element.instruction === "EMPTY" && element.number_of_children === 0) ? "display: flex; justify-content: center; align-items: center;": ""    
    
    if (element.html_element === "p") {
      element.specific_style+= "color: inherit; "
    }
    let isPage = element.instruction === "CONTAINER" ? "page-container" : ""
    
    currentElement = (
  <>
        <ElementComponent className="element"
          editing={editing}
    key={startIndex}
    data={{ ...element, specific_style: `${element.specific_style}; border: ${initialBorderStyle}; ${centerEmpty}`, class_name: element.class_name+` position${startIndex} ${isPage}` }}
    children={children}
    onClick={(e) => {
      changeElement(startIndex);

      if (element.instruction != "ELEMENT")
        e.stopPropagation();
    }}
          onMouseOver={(e) => {

      
            e.target.style.cursor = "pointer";
            if (element.instruction != "ELEMENT") {

              if (startIndex === chosen) { console.log(" INSstartIndex:", startIndex, " chosen:", chosen) }

              else {
                e.target.style.border = "blue 1px solid";
                e.stopPropagation();
              }
              e.stopPropagation();
            }
            else {
              e.target.style.border = "none";
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
      else{e.target.style.border = "initial"}
      
   

      e.stopPropagation();
          }}
          
          extraElement= { solveInstruction(element.instruction, startIndex, (chosen==startIndex))} 
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
    <ElementComponent key={startIndex} data={{...element, class_name: element.class_name+` position${startIndex} ${isPage}`}} children={children} onClick={()=>console.log("bruh")}>
      {element.html_element==='br' ? '': children}
    </ElementComponent>
  );
  }


 


  return { element: currentElement, nextIndex };
};


const allElements = (jsonData, index=0, editing, changeElement, chosen,addElements, changeDrag  ) => {
 console.log("json",jsonData)
  let allElements = []
  while (true) {
    let elements = buildElements(jsonData, index, editing, changeElement, chosen, addElements, changeDrag );
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


// Main function to initiate the recursive building of elements
const ElementBuilder = ({ jsonData, editing = false, changeElement, chosen, addElements, changeDrag }) => {
  console.log("json", jsonData);
  const [lines, setLines] = useState([]);
  const elementRef = useRef(null); // Ref for the .resource-elements div

  // This function decides whether to show lines based on the div's height and the editing state
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

  const elements = jsonData.length !== 0 ? allElements(jsonData, 0, editing, changeElement, chosen, addElements, changeDrag) : null;
console.log("ELEMENTS", elements,jsonData)

  if (elements.length == 1 && jsonData[0].instruction == "PDF")
    return ( elements.map((element, index) => <div key={index}>{element.element}</div>))
  
  return (
    <>
      <div className="resource-elements" ref={elementRef}>
        {elements ? elements.map((element, index) => <div key={index}>{element.element}</div>) : null}

      </div>
    </>
  );
};



export default ElementBuilder;