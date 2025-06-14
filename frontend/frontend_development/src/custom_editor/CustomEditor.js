import React, {useState, useEffect, useRef} from "react";
import ElementBuilder from "../containers/components/elementBuilder.js";
import BaseQuill from "../containers/components/quill/baseQuill.js";
import Modal from "../containers/components/general/modal.js";
import NewRowModal from "./NewRowModal.js";
import ElementChildren from "./elementPanelChildren.js";
import TextIcon from "./icons/textIcon.js";
import PictureIcon from "./icons/imageIcon.js";
import ElementInnerChild from "./elementInnerChild.js";
import CategorySelect from "../containers/components/micro_components/categorySelect.js";
import beTarask from "date-fns/esm/locale/be-tarask/index.js";
import { set } from "date-fns";
import GridToggle from "./panelButtons/gridToggle.js";
import ChangeColor from "./panelButtons/changeColor.js";
import ChangeBackgroundColor from "./panelButtons/changeBgColor.js";

import getParentPosition from "./util/getParentPosition.js";
import getAllPositions from "./util/getAllPositions.js";
import {findNeigbourSpecific, findNeigbour} from "./util/findNeighbour.js";
import findFullPercentage from "./util/findFullPercentage.js";
import findPercentageOf from "./util/findPercentageOf.js";
import changeFlex from "./util/changeFlex.js";
import changeWidth from "./util/changeWidth.js";
import { changeWidthToPx, getWidthInPx, isThisStanding, changeHeightToPx } from "./util/changeWidthToPx.js";
import ResourceScaler from "./util/resourceScaler.js";
import findProblemPage from "./util/fixAndAddPage.js";
import ChangeDirection from "./util/changeDirection.js";

import HeaderPanel from "./headerPanel.js";
import GridIcon from "./icons/gridIcon.js";
import { useNavigate } from "react-router-dom";
import Hint from "../containers/components/general/Hint.js";
import CoolInput from "../containers/components/general/coolInput.js";



import findLastDescendantIndex from "./newUtils/findLastDescendant.js";
import findParentIndex from "./newUtils/findParentIndex.js";
import findNextNeighbourIndex from "./newUtils/findNextNeighbour.js";
import findPreviousNeighbourIndex from "./newUtils/findPreviousNeighbour.js";

import { findAllNeighbours } from "./newUtils/findAllNeighbours.js";
import { findFlexPercentageOfElements, findTotalWidthOfElements } from "./newUtils/findFlexPercentageOfElements.js";
import { ShowMetaStructure } from "./newUtils/showMetaStructure.js";
import ChangeRulesForElement from "./newUtils/changeRulesForElement.js";
import DynamicColorEditor from "./newUtils/dynamicColorEditor.js";

import { DynamicStyleEditor } from "./newUtils/DynamicStyleEditor.js";

import { getValue } from "./newUtils/getValue.js";


import { jsPDF } from 'jspdf';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import getTrueHeight from "./newUtils/getTrueHeight.js";
import reduceTrueHeight from "./newUtils/reduceTrueHeight.js";
import getTrueWidth from "./newUtils/getTrueWidth.js";
import reduceTrueWidth from "./newUtils/reduceTrueWidth.js";
import { QuadrupleDynamicStyleEditor } from './newUtils/quadrupleDynamicStyleEditor';


import { CusteomElementTest } from './newClasses/test';

import { CVElements } from "./newClasses/CVElements.js";

import { applyOrGetPseudoStyles } from './newUtils/applyOrGetPseudoStyles';
import { setValue } from "./newUtils/getValue.js";
import MarginPaddingToggle from "./panelButtons/marginPaddingToggle.js";
import PortraitLandscapeSVG from "./icons/portraitLandscape.js";
import ArrowButton from "./panelButtons/arrowButton.js";
import About from './../pages/about';
import UserAdderToGroup from './../containers/components/users/addUserToGroup';
import StyleTab from "./StyleTab.js";


const ElementPanel = ({ position, resourceMeta, updateResourceMeta, handleAddNewElement, removeElement, addNewElement,toggleUploadModal, children, page, changeIndex, handleRedo, handleUndo,changeDrag  }) => {
    const [elementData, setElementData] = useState(resourceMeta[position]);
    const [direction, setDirection] = useState("row");
      const PMeta= {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: null,
        ordering: 0, // Default value, change as needed
        html_element: 'img' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: 'height: auto;', // Provide a value based on your application's logic
        content_type: '' , // Provide a value based on your application's logic
        content_data: '', // Provide a value based on your application's logic
        instruction: 'ELEMENT' // Provide a value based on your application's logic
  };
  
  const [activeTab, setActiveTab] = useState('style');
  const [exitModal, setExitModal] = useState(false);
  const navigate = useNavigate();



  
  useEffect(() => {
    setElementData(resourceMeta[position]);

  }, [position, resourceMeta]);

  useEffect(() => {
    setActiveTab( resourceMeta[position].rules.hasDesign ? 'content' : 'style')
  }, [position,elementData.instruction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setElementData(prevState => ({
      ...prevState,
      [name]: value,
      //instruction: "DEFAULT"
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedResourceMeta = [...resourceMeta];
   
    updatedResourceMeta[position] = elementData;
    updateResourceMeta(updatedResourceMeta, "handleSubmit ");
  };

  const changeElement=(position, newElement) => {
    const updatedResourceMeta = [...resourceMeta];
    updatedResourceMeta[position] = newElement;
    console.log("RERENDER TRIGGER CHANGE ELEMENT ", updatedResourceMeta)
    updateResourceMeta(updatedResourceMeta, "hangeElement");
  }

 



// Call this function where necessary, providing the parent position and current resourceMeta

  console.log("CV ELEMENTS", CVElements.getAllButtonElements())
  
  const safeElementData = elementData || {}; // Fallback to an empty object if elementData is null or undefined
  
    const tabs = ["pageSettings", 
      elementData.rules.hasDesign? "content" : null,
      "style", 
      "advanced"].filter(t=>t!==null)

const CVelementInput= CVElements.get(elementData.instruction)?.inputElement
let Content, Style;


   return (
     <>
       <div style={{background: "white", width: "40%", minWidth: "550px",maxHeight: "100vh"}}>


   <div className="tabs" style={{ display: 'flex',  }}>
   {tabs.map(t=>(
    <button
    style={{ flex: 1, margin: 0, borderRadius: '0px', backgroundColor: activeTab === t ? '#0e7abd' : '#198fd9' }}
    onClick={() => setActiveTab(t)}
    className={activeTab === t ? 'active' : ''}
  >
    {t}
  </button>
   ))}

  </div>


      <div className="element-panel" style={{ background: "white", height: "100%", overflowY: 'scroll', boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px', minWidth: '25vw', maxWidth: '100%', padding: '10px', paddingBottom: "0px" }}>
        


       


        {activeTab==="advanced"&& (
          <>
          <ChangeRulesForElement resourceMeta={resourceMeta} index={position} updateResourceMeta={updateResourceMeta}/>
          <h2>Structure</h2>
          <ShowMetaStructure  resourceMeta={resourceMeta} changeIndex={changeIndex} index={position}/>
          </>
        )}



{activeTab === 'style' && (
  <StyleTab 
    position={position}
    resourceMeta={resourceMeta}
    changeElement={changeElement}
    updateResourceMeta={updateResourceMeta}
    CVelementInput={CVelementInput}
    changeDrag={changeDrag}

  />
)}

        {activeTab === 'pageSettings' && (
          <>
          <div className="page-settings-content">
            {children}
            
    
          </div>
          <p>to do:</p>
          <ol>


            <li></li>

            
            <li>Double check if we really need to parse resourceMeta everywhere. I have a feeling it might make it lag further.</li>
            <p>Maybe newRowModal does not need it.</p>
            <p>Some of the button elements, if not all, in the Custom Elements don't need it.</p>
            <p>In fact maybe a lot of those elements in Custom Elements don't need them. I am unsure. </p>


            <li>Make sure the general UI is good</li>
            <li>Make work/education timeline element</li>

            <li>Make a "style map" that has all the style properties and their default values</li>
<li>Make sure that each new element has a 'relevant styles' section that works with the map.</li>
<s>
<li> Where do we put the spececial pin point styles of each element? Under styles? Under a new banner called something with styles?About
  <br/>
  Maybe we do actually put them under styles, and then we collapse the other styles or something?
  <br/>
  we should atleast make it clear that they are special in some way. 
  In this was a noob user would only have to look under "design", but a medium User
  could look under style. 
  <br/>
  I am unsure 
  
  
</li>

<li> Perhaps style itself should have multiple tabs? Always defaulting to just the specific_style
<br/>Perhaps they could be 
<li>Pin point</li>
<li>Color</li>
<li>Size</li>
<li>Other?</li>

</li>
</s>

<li>
  Add more styles, especially color to the work timeline one. 
</li>
<li> Make another one called education timeline or something. It should copy work timeline</li>
          
          <li>
            Get Basic backend working. I imagine you just have to delete a whole lot from pyc2
and add depth to datastructure
          </li>

<li> Add either a modal or something similar so you can immediately see what the type looks like for
  <br/> elements with type like the timelines. 
</li>

<li>
  Make sure the background image works properly
</li>


<li> Get better icons for the newRowModal</li>
<li> Makes sure that in certain cases the class elements should be shown first.
  <br/> Perhaps in all other cases than "CONTAINER", it shows the CVElements first, 
  then the other ones? <br/> Almost certainly, this should be a rule instead.
</li>

          
          </ol>

          <p> Bugs:</p>


<li>Something weird happens to the right when you change the width of a border. 
<br/> Not sure why but it has something to do with ChangeDrag.
</li>


</>
        )}

        {activeTab === 'content' && (
          <div className="design-content">
            <div className="custom-editor-form" style={{ minWidth: '350px' }} >


        {CVelementInput && <CVelementInput position={position} resourceMeta={resourceMeta} changeElement={changeElement} updateResourceMeta={updateResourceMeta} isStyle={false}/>}
        

              
              {elementData.instruction !== 'CONTAINER' && (
                <>
                  <button type="button" onClick={ ()=>removeElement(position, resourceMeta, updateResourceMeta)} style={{ background: "red" }}>
                    Delete {elementData.instruction === 'DEFAULT' ? 'row' : 'block'}
                  </button>
                  <button type="button" onClick={() => addNewElement(position)}>add block</button>
                </>
              )}
            </div>
          </div>
           )}
           <button style={{ marginTop: "150px" }} onClick={toggleUploadModal}>Publish</button>
           <button style={{ marginTop: "150px", background: 'red' }} onClick={() => setExitModal(true)}>Discard</button>
         </div>

         <Modal isOpen={exitModal} onClose={() => setExitModal(false)}>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
             <h3>Are you sure you want to exit and discard your changes?</h3>
             <button onClick={() => setExitModal(false)}>No</button>
             <button onClick={() => navigate('/')}>Yes</button>
           </div>
          </Modal>
               
         </div>
    </>
  );

};  // Create a new element based on the defaultMeta structure  

  

const MAX_HISTORY = 25;



const defaultSettings={
  showGrid: true, 
  showMarginAndPadding:true,

}

const CustomEditor = ({resource=null, givenResourceMeta=null, givenCategory, ResoursetypeName}) => {
    const defaultMeta= {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: null,
        ordering: 0, // Default value, change as needed
        html_element: 'div' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: 'height: 1191px; width: 842px;  display: flex; flex-direction: column; box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12); overflow: hidden; z-index: 1; background: white;', // Provide a value based on your application's logic
        content_type: '' , // Provide a value based on your application's logic
        content_data: '', // Provide a value based on your application's logic
        instruction: 'CONTAINER', // Provide a value based on your application's logic,
        depth: 1, //attempting something new.
        rules: {
          draggable: false, 
          selectable: true, 
          newRowButton: true,  
          newRowButtonAlways: true, 
        }
    };

    const pdfRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

const [title, setTitle] = useState(resource?.title || '');
    const [description, setDescription] = useState(resource?.description || '');
  const [isPrivate, setIsPrivate] = useState(resource?.isPrivate || 0);
  const [status, setStatus] = useState(resource?.status || 'draft');  
  const [category_id, setCategoryId] = useState(resource?.category_id ||  givenCategory || 1);
    const [resourceMeta, setResourceMeta] = useState(givenResourceMeta || [defaultMeta]);
  const [index, setIndex] = useState(0);
  const [isStanding, setIsStanding] = useState(
    givenResourceMeta?.[0] ? isThisStanding(givenResourceMeta[0].specific_style) : 
    isThisStanding(resourceMeta?.[0]?.specific_style || defaultMeta.specific_style)
  );
    const [isProblemPage, setIsProblemPage] = useState(false);
    const toggleUploadModal = () => {
    setUploadModalOpen(!uploadModalOpen);
  };
  const navigate = useNavigate();

  const [changeElementPanelPage, setChangeElementPanelPage] = useState(false);

  const changeElement=(position, newElement) => {
    const updatedResourceMeta = [...resourceMeta];
    updatedResourceMeta[position] = newElement;
    updateResourceMeta(updatedResourceMeta, "changeElement 2");
  }


  const handleSetIndex = (index) => {
    setIndex(index);
    
    //setChangeElementPanelPage(!changeElementPanelPage);
  
  };

  //settings
  const [settings, setSettings] = useState(defaultSettings);

  const handleSetSettings = (field, value)=> {
    setSettings(prevSettings => ({
      ...prevSettings,
      [field]: value,
    }));
  } 



//UNDO REDO BUTTONS
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);


  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));



  const handleUndo = () => {

    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    console.log("UNDO", previousState)
    if (previousState.length< index)
      setIndex(0)
    setUndoStack(prevStack => prevStack.slice(0, -1));
    setRedoStack(prevStack => [...prevStack, deepCopy(resourceMeta)]);
    setResourceMeta(previousState);
  };

  const handleRedo = () => {
    console.log("REDO", redoStack)
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    if (nextState.length< index)
      setIndex(0)
    setRedoStack(prevStack => prevStack.slice(0, -1));
    setUndoStack(prevStack => [...prevStack, deepCopy(resourceMeta)]);
    setResourceMeta(nextState);
  };




// Dependency array includes givenResourceMeta to trigger effect when it changes

  const handleSetStatus = (status) => {
    
    switch (status) {
    
      case 'draft':
        setStatus('draft');
        setIsPrivate(0);
        break;
      case 'published':
        setStatus('published');
        setIsPrivate(0);
        break;
      case 'private draft':
        setStatus('draft');
        setIsPrivate(1);
        break;
      case 'private published':
        setStatus('published');
        setIsPrivate(1);
        break;
      default:
        setStatus('draft');
        setIsPrivate(0);
        break;
        

    };
  }
  
  
  useEffect(() => {
    setCategoryId(givenCategory);
    console.log("fucnkign custom cat:", givenCategory)
  }, [givenCategory]);
  
  

  useEffect(() => {

    let updatedResourceMeta = [...resourceMeta];
    for (let i = 0; i < updatedResourceMeta.length; i++) {


      if (updatedResourceMeta[i].instruction == "CONTAINER") {
        updatedResourceMeta[i].specific_style = changeWidthToPx(updatedResourceMeta[0].specific_style, isStanding ? 842 : 1191);
        updatedResourceMeta[i].specific_style = changeHeightToPx(updatedResourceMeta[0].specific_style, isStanding ? 1191 : 842);
      }
    }
      setResourceMeta(updatedResourceMeta);
      console.log("RERENDER TRIGGER STANDING", updatedResourceMeta)
   }, [isStanding]);

  
  


  const toggleModal = (index=-1) => {
    if (index >= 0) {
      setIndex(index);
    }
    setIsModalOpen(!isModalOpen);
  };



/*
  const updateResourceMeta = (position, updatedData) => {
    const newResourceMeta = [...resourceMeta];
    newResourceMeta[position] = updatedData;
    setResourceMeta(newResourceMeta);
    };
  */
  const updateResourceMeta = (newResourceMeta, message) => {

    console.log("RERENDER TRIGGER UPDATERESOURCEMETA", newResourceMeta, message)

    setUndoStack(prevStack => {
      const newStack = [...prevStack, deepCopy(resourceMeta)];
      // Limit history size
      if (newStack.length > MAX_HISTORY) {
        newStack.shift();
      }
      return newStack;
    });
    // Clear the redo stack on new changes
    setRedoStack([]);



      //setIsProblemPage(failsafe);    //is this used? Maybe look at some point for cleanup
    setResourceMeta(newResourceMeta);
  };   
 
  





  const removeElement = (index, resourceMeta, updateResourceMeta) => {
    // Find the last descendant of the element at the given index

    const currentLastChildIndex = findLastDescendantIndex(index, resourceMeta);

    // Find the parent of the element at the given index


    // Split the array into two halves: before the element and after the last descendant
    const firstHalf = resourceMeta.slice(0, index);
    const secondHalf = resourceMeta.slice(currentLastChildIndex + 1);

    console.log("REMOVE RESOURCE HALVES:", firstHalf, secondHalf);

    // Combine the two halves to create the updated array
    let updatedMeta = firstHalf.concat(secondHalf);


    if(updateResourceMeta==null || updateResourceMeta == undefined)
      return updatedMeta
    if (index> updateResourceMeta.length-1)
      setIndex(0)

    // Update the resource meta using the provided callback
    updateResourceMeta(updatedMeta, "removeElement");
};







//Not sure when this is used...
const handleAddNewElement = (index, elements = [], resourceMeta, updateResourceMeta) => {
    console.log("handleAddNewElement ADD NEW ELEMENT,", index, elements, resourceMeta);

    // Start with the current resourceMeta
    let updatedResourceMeta = [...resourceMeta];

    elements.forEach(element => {
        // Create a new element based on the provided element or the default structure
        const newElement = element || {
            html_element: 'p',
            specific_style: 'height: 100px; width: auto; display:flex;',
            content_type: '',
            content_data: 'new',
            instruction: 'DEFAULT',
            depth: resourceMeta[index].depth + 1 // Set depth to be one level deeper than the parent
        };

        // Find the last descendant of the current element to determine the insertion position
        const lastDescendantIndex = findLastDescendantIndex(index, updatedResourceMeta);

        // Insert the new element right after the last descendant
        const insertionPosition = lastDescendantIndex + 1;

        // Create a new array with the new element inserted at the correct position
        updatedResourceMeta = [
            ...updatedResourceMeta.slice(0, insertionPosition),
            newElement,
            ...updatedResourceMeta.slice(insertionPosition)
        ];
    });

    // Update the parent state with the new resourceMeta array
    updateResourceMeta(updatedResourceMeta, "handleaddnewelement");
};
  

  const appendNewElements = (elements = [], rows = 1, changeFlexTo="") => {
  
    let UM = [...resourceMeta];

let neighbour = findNextNeighbourIndex(index, resourceMeta)

// If no neighbour is found, set `neighbour` to `UM.length` to append at the end.
neighbour = neighbour !== -1 ? neighbour : findLastDescendantIndex(index, UM)+1

UM = UM.slice(0, neighbour).concat(elements).concat(UM.slice(neighbour));

if (changeFlexTo!=""){
UM[index].specific_style= setValue("flex-direction",changeFlexTo, UM[index].specific_style, true)
UM[index].specific_style=setValue("display", "flex", UM[index].specific_style, true)

}
    updateResourceMeta(UM, "appendNewElements");
   }

  const post_type = 1;
  const typeName = "resource";
  const classNames = '';
  
const handleSubmit = () => {
    // Prepare the data object
    const data = {
      resource_id : resource?.id || null,
        category_id: parseInt(category_id, 10), // Assuming category_id is available in your state
        title,
        description,
        post_type: parseInt(post_type, 10), // Assuming post_type is available in your state
        typeName, // Assuming typeName is available in your state
        metaInfo: resourceMeta, // This assumes you want to send the whole resourceMeta array
        classNames, // Assuming classNames is available in your state
        status,
      isPrivate, 
      editor_used: 3
    };

    // Perform the fetch request
    fetch((resource ? '/api/update-resource':'/api/insert-new-resource'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
          alert('Resource inserted successfully with ID: ' + data.resourceId);
           setTimeout(() => {
                       window.location.reload();
                   
                }, 100); // Adjust the timeout as needed
             ResoursetypeName ? navigate(`/${ResoursetypeName}`) : navigate('/');
        } else {
            alert('Error inserting resource.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error);
    });
};

  

const absoluteDragger = (position, side, X, show = false) => {
  console.log("absoluteDragger", { position, side, X, show });
  let resourceMetaCopy = [...resourceMeta];
  let style = resourceMeta[position].specific_style;

  if (side == "left") {
    const currentLeft = getValue("left", style, true);
    const left = X.x + (currentLeft ? parseFloat(currentLeft) : 0.0);

    if (!show) {
      document.querySelector(`.position${position}`).style.left = left + "px";
    }
    if (show) {
      const newStyle = setValue(side, left, style);
      resourceMetaCopy[position].specific_style = newStyle;
      console.log("absoluteDragger", { newStyle });
      updateResourceMeta(resourceMetaCopy, "absoluteDragger left");
    }
  }

  if (side == "right") {
    const currentRight = getValue("left", style, true);
    const right = (X.x) + (currentRight ? parseFloat(currentRight) : 0.0);

    if (!show) {
      document.querySelector(`.position${position}`).style.left = right + "px";
    }
    if (show) {
      const newStyle = setValue("left", right, style);
      resourceMetaCopy[position].specific_style = newStyle;
      console.log("absoluteDragger", { newStyle });
      updateResourceMeta(resourceMetaCopy, "absoluteDragger right");
    }
  }

  if (side == "top") {
    const currentTop = getValue("top", style, true);
    const top = X.y + (currentTop ? parseFloat(currentTop) : 0.0);

    if (!show) {
      document.querySelector(`.position${position}`).style.top = top + "px";
    }
    if (show) {
      const newStyle = setValue(side, top, style);
      resourceMetaCopy[position].specific_style = newStyle;
      console.log("absoluteDragger", { newStyle });
      updateResourceMeta(resourceMetaCopy, "absoluteDragger top");
    }
  }

  if (side == "bottom") {
    const currentBottom = getValue("top", style, true);
    const bottom = X.y + (currentBottom ? parseFloat(currentBottom) : 0.0);

    if (!show) {
      document.querySelector(`.position${position}`).style.top = bottom + "px";
    }
    if (show) {
      const newStyle = setValue("top", bottom, style);
      resourceMetaCopy[position].specific_style = newStyle;
      console.log("absoluteDragger", { newStyle });
      updateResourceMeta(resourceMetaCopy, "absoluteDragger bottom");
    }
  }
};




  
  const changeDrag = (position, X, side, property ,show=false) => {
    /**
     * TO DO: 
     * 1. Make a function called getTrueWidth and one called getTrueHeight
     * 2. Make a functtion or make sure, that when we're reducing true with, it should probably reduce the neighbour's margin, next their padding, next width.
     * 2.a This does create some serious problems tho. What if I want to reduce the side margin, but not the top and bottom margin.
     * 2.b Perhaps there is never a true margin. There only exists margin-top, etc.. but we should have another function that changes one, which changes the others. 
     */

    console.log("CHANGE DRAG out", position, X, side, property ,show)

    if (side == "down") {
    
      console.log("DOWNDRAG", position, X, side, property ,show)

      const parentIndex=findParentIndex(index,resourceMeta)

      const parentHeight =resourceMeta[position].rules?.freeFloat? 9999999: parseFloat(getValue("height",resourceMeta[parentIndex].specific_style).replace("px", ""))
      
      const parentFlexRow = getValue("flex-direction",resourceMeta[parentIndex].specific_style ) =="row"


      const allNeighbours=resourceMeta[position].rules?.freeFloat? {leftNeighbours:[], rightNeighbours:[]}: findAllNeighbours(position, resourceMeta)

      const leftNeighbourHeights= allNeighbours.leftNeighbours.map(n=>getTrueHeight(n.data).total)
      const leftTotal= leftNeighbourHeights.reduce((acc, cur) => cur+acc,0)
      const rightNeighbourHeights=allNeighbours.rightNeighbours.map(n=>getTrueHeight(n.data).total)
      const rightTotal= rightNeighbourHeights.reduce((acc, cur) => cur+acc,0)
      const neighboursTrueHeight = leftTotal+rightTotal

      let resourceMetaCopy = [...resourceMeta];
  
      // Create a dynamic regex that matches e.g. "height:" or "width:" etc.
      const regex = new RegExp(`${property}:\\s*(\\d+(\\.\\d+)?)px`);
      const match = resourceMetaCopy[position].specific_style.match(regex);
    
      let currentValue = match
        ? parseInt(match[1])
        : document.querySelector(`.position${position}`).offsetHeight; // adjust fallback if needed
      
      const trueHeightToAdd=(X * -1);

      const elementTrueHeight=getTrueHeight(resourceMetaCopy[position]).total

      let newValue = currentValue + trueHeightToAdd

      //if column and possibly more children.

      const totalSize= trueHeightToAdd+elementTrueHeight+neighboursTrueHeight
      if ( totalSize>parentHeight && !parentFlexRow){

        console.log("STYLE WHAT BIGGER")
        //change the neighbours if possible. 
        if (allNeighbours.rightNeighbours.length>0){
          const nextNeighbour=allNeighbours.rightNeighbours[0]

          const reducedTrueHeight=reduceTrueHeight(nextNeighbour.data, totalSize-parentHeight, !show)
          
          console.log("STYLE WHAT:", reducedTrueHeight)
          if (!show){
            resourceMetaCopy[nextNeighbour.index].specific_style=reducedTrueHeight.style
        }
        if (show){
          document.querySelector(`.position${nextNeighbour.index}`).style.marginTop=reducedTrueHeight.marginTop+"px"
          document.querySelector(`.position${nextNeighbour.index}`).style.marginBottom=reducedTrueHeight.marginBottom+"px"

          document.querySelector(`.position${nextNeighbour.index}`).style.paddingTop=reducedTrueHeight.paddingTop+"px"
          document.querySelector(`.position${nextNeighbour.index}`).style.paddingBottom=reducedTrueHeight.paddingBottom+"px"

          document.querySelector(`.position${nextNeighbour.index}`).style.height=reducedTrueHeight.height+"px"

        }


          if (reducedTrueHeight.total<=0  && totalSize>parentHeight&& !show){
            console.log("STYLE WHAT DELETE",{neighbourHeight:reducedTrueHeight.total, leftNeighbourHeights,leftTotal,elementTrueHeight, rightNeighbourHeights,rightTotal,totalSize, parentHeight, neighboursTrueHeight, trueHeightToAdd, currentValue, shouldBe: parentHeight- ((elementTrueHeight-currentValue)+neighboursTrueHeight)})
            //should remove neighbour
            //perhaps show later. 
            //parentHeight- (elementTrueHeight-currentValue)+neighboursTrueHeight

            resourceMetaCopy=removeElement(nextNeighbour.index, resourceMetaCopy)
            newValue= currentValue+ rightNeighbourHeights[0]
          }

          else if(reducedTrueHeight.total<=0   && totalSize>parentHeight&& show){
            console.log("STYLE WHAT JUST SHOW DELETE",{neighbourHeight:reducedTrueHeight.total, leftNeighbourHeights,leftTotal,elementTrueHeight, rightNeighbourHeights,rightTotal,totalSize, parentHeight, neighboursTrueHeight, trueHeightToAdd, currentValue, shouldBe: parentHeight- ((elementTrueHeight-currentValue)+neighboursTrueHeight)})
            


            newValue=currentValue+ rightNeighbourHeights[0]
          }



        }
        else{
        newValue-=(trueHeightToAdd+elementTrueHeight+neighboursTrueHeight)-parentHeight

      }
      } 
      //probably redundant if I think for 2 secs, TOTALLY Forgot what this does. but keeping it for now
      else if (elementTrueHeight+neighboursTrueHeight>=parentHeight && trueHeightToAdd<0 && !parentFlexRow &&allNeighbours.rightNeighbours.length>0){
        console.log("STYLE WHAT HERE")
        const nextNeighbour=allNeighbours.rightNeighbours[0]
        const nextTotal= getTrueHeight(nextNeighbour.data)

        const reducedTrueHeight=reduceTrueHeight(nextNeighbour.data, totalSize-parentHeight, !show)
        
        console.log("STYLE WHAT:", reducedTrueHeight)
        if (!show){
          resourceMetaCopy[nextNeighbour.index].specific_style=reducedTrueHeight.style
      }
      if (show){
        document.querySelector(`.position${nextNeighbour.index}`).style.marginTop=reducedTrueHeight.marginTop+"px"
        document.querySelector(`.position${nextNeighbour.index}`).style.marginBottom=reducedTrueHeight.marginBottom+"px"

        document.querySelector(`.position${nextNeighbour.index}`).style.paddingTop=reducedTrueHeight.paddingTop+"px"
        document.querySelector(`.position${nextNeighbour.index}`).style.paddingBottom=reducedTrueHeight.paddingBottom+"px"

        document.querySelector(`.position${nextNeighbour.index}`).style.height=reducedTrueHeight.height+"px"

      }

      }


      //if row and therefore share trueHeight with none. 
      else if(trueHeightToAdd+elementTrueHeight>parentHeight && parentFlexRow){
        newValue-=(trueHeightToAdd+elementTrueHeight)-parentHeight
      }







  
      

      
      if (!show) {
        // Use the same dynamic regex for replacement
        resourceMetaCopy[position].specific_style = resourceMetaCopy[position].specific_style.replace(
          new RegExp(`${property}:\\s*[^;]+;`),
          `${property}:${newValue}px; `
        );
      }
      
      if (show) {
        document.querySelector(`.position${position}`).style[property] = `${newValue}px`;
      }
      
      console.log("ACTUAL DRAG:", { side, currentValue, newValue, X: X * -1 });
      console.log("UPDATED STYLE:", resourceMetaCopy[position].specific_style);
      

      if (trueHeightToAdd*-1>=elementTrueHeight && !show){
        resourceMetaCopy=removeElement(position, resourceMetaCopy)
        setIndex(0)
      }

      if (!show) updateResourceMeta(resourceMetaCopy,"changedrag1");
      applyOrGetPseudoStyles(resourceMeta[position], true, position)
      return;
    }

    if (side == "up") {
      console.log("DOWNDRAG", position, X, side, property ,show)

      const parentIndex=findParentIndex(index,resourceMeta)

      const parentHeight = resourceMeta[position].rules?.freeFloat? 9999999: parseFloat(getValue("height",resourceMeta[parentIndex].specific_style).replace("px", ""))
      
      const parentFlexRow = getValue("flex-direction",resourceMeta[parentIndex].specific_style ) =="row"


      const allNeighbours=resourceMeta[position].rules?.freeFloat? {leftNeighbours:[], rightNeighbours:[]}: findAllNeighbours(position, resourceMeta)

      const leftNeighbourHeights= allNeighbours.leftNeighbours.map(n=>getTrueHeight(n.data).total)
      const leftTotal= leftNeighbourHeights.reduce((acc, cur) => cur+acc,0)
      const rightNeighbourHeights=allNeighbours.rightNeighbours.map(n=>getTrueHeight(n.data).total)
      const rightTotal= rightNeighbourHeights.reduce((acc, cur) => cur+acc,0)
      const neighboursTrueHeight = leftTotal+rightTotal

      let resourceMetaCopy = [...resourceMeta];
  
      // Create a dynamic regex that matches e.g. "height:" or "width:" etc.
      const regex = new RegExp(`${property}:\\s*(\\d+(\\.\\d+)?)px`);
      const match = resourceMetaCopy[position].specific_style.match(regex);
    
      let currentValue = match
        ? parseInt(match[1])
        : document.querySelector(`.position${position}`).offsetHeight; // adjust fallback if needed
      
      const trueHeightToAdd=X

      const elementTrueHeight=getTrueHeight(resourceMetaCopy[position]).total

      let newValue = currentValue + trueHeightToAdd

      //if column and possibly more children.

      const totalSize= trueHeightToAdd+elementTrueHeight+neighboursTrueHeight
      if ( totalSize>parentHeight && !parentFlexRow){

        console.log("STYLE WHAT BIGGER")
        //change the neighbours if possible. 
        if (allNeighbours.leftNeighbours.length>0){
          const nextNeighbour=allNeighbours.leftNeighbours[0]

          const reducedTrueHeight=reduceTrueHeight(nextNeighbour.data, totalSize-parentHeight, !show)
          
          console.log("STYLE WHAT:", reducedTrueHeight)
          if (!show){
            resourceMetaCopy[nextNeighbour.index].specific_style=reducedTrueHeight.style
            
            
        }
        if (show){
          document.querySelector(`.position${nextNeighbour.index}`).style.marginTop=reducedTrueHeight.marginTop+"px"
          document.querySelector(`.position${nextNeighbour.index}`).style.marginBottom=reducedTrueHeight.marginBottom+"px"

          document.querySelector(`.position${nextNeighbour.index}`).style.paddingTop=reducedTrueHeight.paddingTop+"px"
          document.querySelector(`.position${nextNeighbour.index}`).style.paddingBottom=reducedTrueHeight.paddingBottom+"px"

          document.querySelector(`.position${nextNeighbour.index}`).style.height=reducedTrueHeight.height+"px"

        }


          if (reducedTrueHeight.total<=0  && totalSize>parentHeight&& !show){
            console.log("STYLE WHAT DELETE",{neighbourHeight:reducedTrueHeight.total, leftNeighbourHeights,leftTotal,elementTrueHeight, rightNeighbourHeights,rightTotal,totalSize, parentHeight, neighboursTrueHeight, trueHeightToAdd, currentValue, shouldBe: parentHeight- ((elementTrueHeight-currentValue)+neighboursTrueHeight)})
            //should remove neighbour
            //perhaps show later. 
            //parentHeight- (elementTrueHeight-currentValue)+neighboursTrueHeight

            resourceMetaCopy=removeElement(nextNeighbour.index, resourceMetaCopy)
            position=nextNeighbour.index
            setIndex(nextNeighbour.index)
            newValue= currentValue+ leftNeighbourHeights[0]
          }

          else if(reducedTrueHeight.total<=0   && totalSize>parentHeight&& show){
            console.log("STYLE WHAT JUST SHOW DELETE",{neighbourHeight:reducedTrueHeight.total, leftNeighbourHeights,leftTotal,elementTrueHeight, rightNeighbourHeights,rightTotal,totalSize, parentHeight, neighboursTrueHeight, trueHeightToAdd, currentValue, shouldBe: parentHeight- ((elementTrueHeight-currentValue)+neighboursTrueHeight)})
            


            newValue=currentValue+ leftNeighbourHeights[0]
          }



        }
        else{
        newValue-=(trueHeightToAdd+elementTrueHeight+neighboursTrueHeight)-parentHeight

      }
      } 
      //probably redundant if I think for 2 secs, TOTALLY Forgot what this does. but keeping it for now
      else if (elementTrueHeight+neighboursTrueHeight>=parentHeight && trueHeightToAdd<0 && !parentFlexRow &&allNeighbours.leftNeighbours.length>0){
        console.log("STYLE WHAT HERE")
        const nextNeighbour=allNeighbours.leftNeighbours[0]
        const nextTotal= getTrueHeight(nextNeighbour.data)

        const reducedTrueHeight=reduceTrueHeight(nextNeighbour.data, totalSize-parentHeight, !show)
        
        console.log("STYLE WHAT:", reducedTrueHeight)
        if (!show){
          resourceMetaCopy[nextNeighbour.index].specific_style=reducedTrueHeight.style
      }
      if (show){
        document.querySelector(`.position${nextNeighbour.index}`).style.marginTop=reducedTrueHeight.marginTop+"px"
        document.querySelector(`.position${nextNeighbour.index}`).style.marginBottom=reducedTrueHeight.marginBottom+"px"

        document.querySelector(`.position${nextNeighbour.index}`).style.paddingTop=reducedTrueHeight.paddingTop+"px"
        document.querySelector(`.position${nextNeighbour.index}`).style.paddingBottom=reducedTrueHeight.paddingBottom+"px"

        document.querySelector(`.position${nextNeighbour.index}`).style.height=reducedTrueHeight.height+"px"

      }

      }


      //if row and therefore share trueHeight with none. 
      else if(trueHeightToAdd+elementTrueHeight>parentHeight && parentFlexRow){
        newValue-=(trueHeightToAdd+elementTrueHeight)-parentHeight
      }







  
      

      
      if (!show) {
        // Use the same dynamic regex for replacement
        resourceMetaCopy[position].specific_style = resourceMetaCopy[position].specific_style.replace(
          new RegExp(`${property}:\\s*[^;]+;`),
          `${property}:${newValue}px; `
        );
        if (resourceMetaCopy[position].rules?.freeFloat)
          resourceMetaCopy[position].specific_style=setValue("top",(parseFloat(getValue("top", resourceMetaCopy[position].specific_style,true))-X)+"px", resourceMetaCopy[position].specific_style,true)
     
      }
      
      if (show) {
        document.querySelector(`.position${position}`).style[property] = `${newValue}px`;
        
        if (resourceMetaCopy[position].rules?.freeFloat)
          document.querySelector(`.position${position}`).style.top=(parseFloat(getValue("top", resourceMetaCopy[position].specific_style,true))-X)+"px"
     
      }
      
      console.log("ACTUAL DRAG:", { side, currentValue, newValue, X: X * -1 });
      console.log("UPDATED STYLE:", resourceMetaCopy[position].specific_style);
      

      if (trueHeightToAdd*-1>=elementTrueHeight && !show){
        resourceMetaCopy=removeElement(position, resourceMetaCopy)
        setIndex(0)
      }

      if (!show) updateResourceMeta(resourceMetaCopy,"changedrag2");
      applyOrGetPseudoStyles(resourceMeta[position], true, position)
      return;
    }


    if (side == "right") {
      console.log("RIGHTDRAG", position, X, side, property ,show)

      const parentIndex=findParentIndex(index,resourceMeta)

      const parentHeight =resourceMeta[position].rules?.freeFloat? 9999999: parseFloat(getValue("width",resourceMeta[parentIndex].specific_style).replace("px", ""))
      
      const parentFlexRow = getValue("flex-direction",resourceMeta[parentIndex].specific_style ) !="row"


      const allNeighbours=resourceMeta[position].rules?.freeFloat? {leftNeighbours:[], rightNeighbours:[]}: findAllNeighbours(position, resourceMeta)

      const leftNeighbourHeights= allNeighbours.leftNeighbours.map(n=>getTrueWidth(n.data).total)
      const leftTotal= leftNeighbourHeights.reduce((acc, cur) => cur+acc,0)
      const rightNeighbourHeights=allNeighbours.rightNeighbours.map(n=>getTrueWidth(n.data).total)
      const rightTotal= rightNeighbourHeights.reduce((acc, cur) => cur+acc,0)
      const neighboursTrueHeight = leftTotal+rightTotal

      let resourceMetaCopy = [...resourceMeta];
  
      // Create a dynamic regex that matches e.g. "height:" or "width:" etc.
      const regex = new RegExp(`${property}:\\s*(\\d+(\\.\\d+)?)px`);
      const match = resourceMetaCopy[position].specific_style.match(regex);
    
      let currentValue = match
        ? parseInt(match[1])
        : document.querySelector(`.position${position}`).offsetHeight; // adjust fallback if needed
      
      const trueHeightToAdd=X

      const elementTrueHeight=getTrueWidth(resourceMetaCopy[position]).total

      let newValue = currentValue + trueHeightToAdd

      //if column and possibly more children.
      const totalSize= Math.round( elementTrueHeight+neighboursTrueHeight +trueHeightToAdd)
      console.log("STYLE WHAT", newValue, totalSize>parentHeight , `${totalSize}>${parentHeight} `, trueHeightToAdd, "HERE THING:", elementTrueHeight+neighboursTrueHeight)
      
      if ( totalSize>=parentHeight && !parentFlexRow){

        console.log("STYLE WHAT BIGGER")
        //change the neighbours if possible. 
        if (allNeighbours.rightNeighbours.length>0){
          const nextNeighbour=allNeighbours.rightNeighbours[0]

          const reducedTrueHeight=reduceTrueWidth(nextNeighbour.data, totalSize-parentHeight, !show)
          
          console.log("STYLE WHAT:", reducedTrueHeight)
          if (!show){
            resourceMetaCopy[nextNeighbour.index].specific_style=reducedTrueHeight.style
        }
        if (show){
          document.querySelector(`.position${nextNeighbour.index}`).style.marginLeft=reducedTrueHeight.marginLeft+"px"
          document.querySelector(`.position${nextNeighbour.index}`).style.marginRight=reducedTrueHeight.marginRight+"px"

          document.querySelector(`.position${nextNeighbour.index}`).style.paddingLeft=reducedTrueHeight.paddingLeft+"px"
          document.querySelector(`.position${nextNeighbour.index}`).style.paddingRight=reducedTrueHeight.paddingRight+"px"

          document.querySelector(`.position${nextNeighbour.index}`).style.width=reducedTrueHeight.width+"px"

        }


        //DELETION
          if (reducedTrueHeight.total<=0  && totalSize>parentHeight&& !show){
            console.log("STYLE WHAT DELETE",{neighbourHeight:reducedTrueHeight.total, leftNeighbourHeights,leftTotal,elementTrueHeight, rightNeighbourHeights,rightTotal,totalSize, parentHeight, neighboursTrueHeight, trueHeightToAdd, currentValue, shouldBe: parentHeight- ((elementTrueHeight-currentValue)+neighboursTrueHeight)})
            //should remove neighbour
            //perhaps show later. 
            //parentHeight- (elementTrueHeight-currentValue)+neighboursTrueHeight

            resourceMetaCopy=removeElement(nextNeighbour.index, resourceMetaCopy)
            newValue= currentValue+ rightNeighbourHeights[0]
          }

          else if(reducedTrueHeight.total<=0   && totalSize>parentHeight&& show){
            console.log("STYLE WHAT JUST SHOW DELETE",{neighbourHeight:reducedTrueHeight.total, leftNeighbourHeights,leftTotal,elementTrueHeight, rightNeighbourHeights,rightTotal,totalSize, parentHeight, neighboursTrueHeight, trueHeightToAdd, currentValue, shouldBe: parentHeight- ((elementTrueHeight-currentValue)+neighboursTrueHeight)})
            


            newValue=currentValue+ rightNeighbourHeights[0]
          }
          //DELETION SHOW



        }
        else{

        newValue-=(trueHeightToAdd+elementTrueHeight+neighboursTrueHeight)-parentHeight
        console.log("STYLE WHAT IN ELSE",newValue )
      }
      } 
      //probably redundant if I think for 2 secs, TOTALLY Forgot what this does. but keeping it for now
      //There is a slight problem with how floats are added, because it does not always give exactly what we need,
      //so I rounded it up and gave it another 0.5 
      else if (Math.round(elementTrueHeight+neighboursTrueHeight+0.5)>=parentHeight && trueHeightToAdd<0 && !parentFlexRow &&allNeighbours.rightNeighbours.length>0){
        console.log("STYLE WHAT HERE")
        const nextNeighbour=allNeighbours.rightNeighbours[0]


        const reducedTrueHeight=reduceTrueWidth(nextNeighbour.data, totalSize-parentHeight, !show)
        
        console.log("STYLE WHAT:", reducedTrueHeight)
        if (!show){
          resourceMetaCopy[nextNeighbour.index].specific_style=reducedTrueHeight.style
      }
      if (show){
        document.querySelector(`.position${nextNeighbour.index}`).style.marginLeft=reducedTrueHeight.marginLeft+"px"
        document.querySelector(`.position${nextNeighbour.index}`).style.marginRight=reducedTrueHeight.marginRight+"px"

        document.querySelector(`.position${nextNeighbour.index}`).style.paddingLeft=reducedTrueHeight.paddingLeft+"px"
        document.querySelector(`.position${nextNeighbour.index}`).style.paddingRight=reducedTrueHeight.paddingRight+"px"

        document.querySelector(`.position${nextNeighbour.index}`).style.width=reducedTrueHeight.width+"px"

      }

      }


      //if row and therefore share trueHeight with none. 
      else if(trueHeightToAdd+elementTrueHeight>parentHeight && parentFlexRow){
        console.log("STYLE WHAT if row and therefore share trueHeight with none. ")
        newValue-=(trueHeightToAdd+elementTrueHeight)-parentHeight
      }







  
      

      
      if (!show) {
        // Use the same dynamic regex for replacement
        resourceMetaCopy[position].specific_style = resourceMetaCopy[position].specific_style.replace(
          new RegExp(`${property}:\\s*[^;]+;`),
          `${property}:${newValue}px; `
        );
      }
      
      if (show) {
        document.querySelector(`.position${position}`).style[property] = `${newValue}px`;
      }
      
      console.log("ACTUAL DRAG:", { side, currentValue, newValue, X: X * -1 });
      console.log("UPDATED STYLE:", resourceMetaCopy[position].specific_style);
      

      if (trueHeightToAdd*-1>=elementTrueHeight && !show){
        resourceMetaCopy=removeElement(position, resourceMetaCopy)
        setIndex(0)
      }

      if (!show) updateResourceMeta(resourceMetaCopy, "changedrag2");
      applyOrGetPseudoStyles(resourceMeta[position], true, position)
      return;
    }









    if (side == "left") {
      console.log("LEFTDRAG", position, X, side, property ,show)

      const parentIndex=findParentIndex(index,resourceMeta)

      const parentHeight = resourceMeta[position].rules?.freeFloat? 9999999: parseFloat(getValue("width",resourceMeta[parentIndex].specific_style).replace("px", ""))
      
      const parentFlexRow = getValue("flex-direction",resourceMeta[parentIndex].specific_style ) !="row"


      const allNeighbours=resourceMeta[position].rules?.freeFloat? {leftNeighbours:[], rightNeighbours:[]}: findAllNeighbours(position, resourceMeta)

      const leftNeighbourHeights= allNeighbours.leftNeighbours.map(n=>getTrueWidth(n.data).total)
      const leftTotal= leftNeighbourHeights.reduce((acc, cur) => cur+acc,0)
      const rightNeighbourHeights=allNeighbours.rightNeighbours.map(n=>getTrueWidth(n.data).total)
      const rightTotal= rightNeighbourHeights.reduce((acc, cur) => cur+acc,0)
      const neighboursTrueHeight = leftTotal+rightTotal

      let resourceMetaCopy = [...resourceMeta];
  
      // Create a dynamic regex that matches e.g. "height:" or "width:" etc.
      const regex = new RegExp(`${property}:\\s*(\\d+(\\.\\d+)?)px`);
      const match = resourceMetaCopy[position].specific_style.match(regex);
    
      let currentValue = match
        ? parseInt(match[1])
        : document.querySelector(`.position${position}`).offsetHeight; // adjust fallback if needed
      
      const trueHeightToAdd=X*-1

      const elementTrueHeight=getTrueWidth(resourceMetaCopy[position]).total

      let newValue = currentValue + trueHeightToAdd

      //if column and possibly more children.
      const totalSize= Math.round( elementTrueHeight+neighboursTrueHeight +trueHeightToAdd)
      console.log("STYLE WHAT", newValue, totalSize>parentHeight , `${totalSize}>${parentHeight} `, trueHeightToAdd, "HERE THING:", elementTrueHeight+neighboursTrueHeight)
      
      if ( totalSize>=parentHeight && !parentFlexRow){

        console.log("STYLE WHAT BIGGER")
        //change the neighbours if possible. 
        if (allNeighbours.leftNeighbours.length>0){
          const nextNeighbour=allNeighbours.leftNeighbours[0]

          const reducedTrueHeight=reduceTrueWidth(nextNeighbour.data, totalSize-parentHeight, !show)
          
          console.log("STYLE WHAT:", reducedTrueHeight)
          if (!show){
            resourceMetaCopy[nextNeighbour.index].specific_style=reducedTrueHeight.style
        }
        if (show){
          document.querySelector(`.position${nextNeighbour.index}`).style.marginLeft=reducedTrueHeight.marginLeft+"px"
          document.querySelector(`.position${nextNeighbour.index}`).style.marginRight=reducedTrueHeight.marginRight+"px"

          document.querySelector(`.position${nextNeighbour.index}`).style.paddingLeft=reducedTrueHeight.paddingLeft+"px"
          document.querySelector(`.position${nextNeighbour.index}`).style.paddingRight=reducedTrueHeight.paddingRight+"px"

          document.querySelector(`.position${nextNeighbour.index}`).style.width=reducedTrueHeight.width+"px"

        }


        //DELETION
          if (reducedTrueHeight.total<=0  && totalSize>parentHeight&& !show){
            console.log("STYLE WHAT DELETE",{neighbourHeight:reducedTrueHeight.total, leftNeighbourHeights,leftTotal,elementTrueHeight, rightNeighbourHeights,rightTotal,totalSize, parentHeight, neighboursTrueHeight, trueHeightToAdd, currentValue, shouldBe: parentHeight- ((elementTrueHeight-currentValue)+neighboursTrueHeight)})
            //should remove neighbour
            //perhaps show later. 
            //parentHeight- (elementTrueHeight-currentValue)+neighboursTrueHeight

            resourceMetaCopy=removeElement(nextNeighbour.index, resourceMetaCopy)
            position=nextNeighbour.index
            setIndex(nextNeighbour.index)
            newValue= currentValue+ leftNeighbourHeights[0]
           
          }

          else if(reducedTrueHeight.total<=0   && totalSize>parentHeight&& show){
            console.log("STYLE WHAT JUST SHOW DELETE",{neighbourHeight:reducedTrueHeight.total, leftNeighbourHeights,leftTotal,elementTrueHeight, rightNeighbourHeights,rightTotal,totalSize, parentHeight, neighboursTrueHeight, trueHeightToAdd, currentValue, shouldBe: parentHeight- ((elementTrueHeight-currentValue)+neighboursTrueHeight)})
            


            newValue=currentValue+ leftNeighbourHeights[0]
          }
          //DELETION SHOW



        }
        else{

        newValue-=(trueHeightToAdd+elementTrueHeight+neighboursTrueHeight)-parentHeight
        console.log("STYLE WHAT IN ELSE",newValue )
      }
      } 
      //probably redundant if I think for 2 secs, TOTALLY Forgot what this does. but keeping it for now
      //There is a slight problem with how floats are added, because it does not always give exactly what we need,
      //so I rounded it up and gave it another 0.5 
      else if (Math.round(elementTrueHeight+neighboursTrueHeight+0.5)>=parentHeight && trueHeightToAdd<0 && !parentFlexRow &&allNeighbours.leftNeighbours.length>0){
        console.log("STYLE WHAT HERE")
        const nextNeighbour=allNeighbours.leftNeighbours[0]


        const reducedTrueHeight=reduceTrueWidth(nextNeighbour.data, totalSize-parentHeight, !show)
        
        console.log("STYLE WHAT:", reducedTrueHeight)
        if (!show){
          resourceMetaCopy[nextNeighbour.index].specific_style=reducedTrueHeight.style
      }
      if (show){
        document.querySelector(`.position${nextNeighbour.index}`).style.marginLeft=reducedTrueHeight.marginLeft+"px"
        document.querySelector(`.position${nextNeighbour.index}`).style.marginRight=reducedTrueHeight.marginRight+"px"

        document.querySelector(`.position${nextNeighbour.index}`).style.paddingLeft=reducedTrueHeight.paddingLeft+"px"
        document.querySelector(`.position${nextNeighbour.index}`).style.paddingRight=reducedTrueHeight.paddingRight+"px"

        document.querySelector(`.position${nextNeighbour.index}`).style.width=reducedTrueHeight.width+"px"

      }

      }


      //if row and therefore share trueHeight with none. 
      else if(trueHeightToAdd+elementTrueHeight>parentHeight && parentFlexRow){
        console.log("STYLE WHAT if row and therefore share trueHeight with none. ")
        newValue-=(trueHeightToAdd+elementTrueHeight)-parentHeight //consider doing the Math.round here too... 
      }







  
      

      
      if (!show) {
        // Use the same dynamic regex for replacement
        resourceMetaCopy[position].specific_style = resourceMetaCopy[position].specific_style.replace(
          new RegExp(`${property}:\\s*[^;]+;`),
          `${property}:${newValue}px; `
        );

        if (resourceMetaCopy[position].rules?.freeFloat)
          resourceMetaCopy[position].specific_style=setValue("left",(parseFloat(getValue("left", resourceMetaCopy[position].specific_style,true))+X)+"px", resourceMetaCopy[position].specific_style,true)
      }
      
      if (show) {
        document.querySelector(`.position${position}`).style[property] = `${newValue}px`;
        
        if (resourceMetaCopy[position].rules?.freeFloat)
          document.querySelector(`.position${position}`).style.left=(parseFloat(getValue("left", resourceMetaCopy[position].specific_style,true))+X)+"px"
      }
      
      console.log("ACTUAL DRAG:", { side, currentValue, newValue, X: X * -1 });
      console.log("UPDATED STYLE:", resourceMetaCopy[position].specific_style);
      

      if (trueHeightToAdd*-1>=elementTrueHeight && !show){
        resourceMetaCopy=removeElement(position, resourceMetaCopy)
        setIndex(0)
      }

      if (!show) updateResourceMeta(resourceMetaCopy, "changedrag3");
      applyOrGetPseudoStyles(resourceMeta[position], true, position)
      return;
    }



};



  
  const AddNewElement = (position) => { 

    if (resourceMeta[position].instruction == "CONTAINER") {
      //otherwise the system breaks.
      return null;
    } 
    if (resourceMeta[position].instruction == "DEFAULT") {
      position += 1; 
    }

    let parentPosition = getParentPosition(position, resourceMeta);
    let currentPercentage = findFullPercentage(position, resourceMeta);
    let insertAt = getAllPositions(position, resourceMeta).sort((a, b) => b - a)[0] + 1;
    

    let newElement = {
            html_element: 'div',
            number_of_children: 0,
            specific_style: `height: auto; minHeight: 100px; position: relative; `,
            content_type: '', 
            content_data: '',
           instruction: 'EMPTY',
class_name: 'element'
}




    let copyRM= [...resourceMeta];
    console.log("INITIAL COPYRM", copyRM)
    copyRM[parentPosition].number_of_children = copyRM[parentPosition].number_of_children + 1;





    if (currentPercentage < 90) {
    
    newElement.specific_style += `flex: 0 0 ${100-currentPercentage}%`;

      copyRM.splice(insertAt, 0, newElement)
      updateResourceMeta(copyRM, "addnewelement");
      return; 

    }
  

    
    let percentToHit = 15 / resourceMeta[parentPosition].number_of_children

    const changeKids = (position, RM) => {
      let neighbour = findNeigbour(position, RM, "right");
      if (neighbour == null)
        return RM
      RM[neighbour].specific_style = changeFlex(RM[neighbour].specific_style, -1 * percentToHit);
      RM[neighbour].specific_style = changeWidth(RM[neighbour].specific_style, -1* percentToHit);
      changeKids(neighbour, RM);
      return RM;


    }
    copyRM = changeKids(parentPosition, copyRM);
    console.log("COPYRM", copyRM, (100-findFullPercentage(position, copyRM))) 
    newElement.specific_style += `flex: 0 0 ${100 - findFullPercentage(position, copyRM)}%; `
    newElement.specific_style += `width: ${100 - findFullPercentage(position, copyRM)}%;`
    copyRM.splice(insertAt, 0, newElement)
    console.log("COPYRM", copyRM)
    updateResourceMeta(copyRM,"changeKids");






    
    





  }
  
  const headerSize= "45"
  


    return (
        <>


<div style={{
  display: "flex", 
  backgroundColor: "#f9f9f9",
  backgroundImage: "linear-gradient(to right, rgba(72, 0, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(72, 0, 255, 0.1) 1px, transparent 1px)",
  backgroundSize: "50px 50px",
}}>


    

                <ElementPanel 

          position={index}
          resourceMeta={resourceMeta}
            updateResourceMeta={updateResourceMeta}
              handleAddNewElement={handleAddNewElement}
              removeElement={removeElement}
              addNewElement={AddNewElement}
            toggleUploadModal={toggleUploadModal}
            page={changeElementPanelPage}
            changeIndex={handleSetIndex}
            handleRedo={handleRedo}
            handleUndo={handleUndo}
            changeDrag={changeDrag}
            
            >


       


        


            </ElementPanel>
            
                 

           


       
      
    
         <div className='resource-canvas' style={{border: 'none', padding: "0px"}}>
          <div style={{background: "white", gap: "40px", padding: "15px", paddingBottom: "0px", paddingTop:"8px", height:"fit-content", display: "flex"}}>

<div style={{display: "flex", gap: "-10px", marginRight: "10px"}}>   
  <ArrowButton doFunc={handleUndo} canDo={undoStack.length>0} type="undo" />
       
        <ArrowButton doFunc={handleRedo} canDo={redoStack.length>0} type="redo" />
        </div>

          <Hint hintText="Choose between portrait and landscape orientation">
                <PortraitLandscapeSVG chosen={isStanding} onclick={() => setIsStanding(!isStanding)} degrees={-90} size={headerSize} />
                </Hint>
<Hint hintText={"The grid disables or shows the grid on the page."} >
<GridToggle settings={settings} handleSetSettings={handleSetSettings}   size={headerSize} />
</Hint>


< MarginPaddingToggle  settings={settings} handleSetSettings={handleSetSettings}   size={50} />

{/*
<Hint hintText={"Change the direction of the page."} >
  <ChangeDirection size={headerSize} />
</Hint>
*/ }



          </div>
          <div style={{padding: "30px"}}>
            <ElementBuilder  jsonData={resourceMeta} editing={true} changeElement={(i)=> handleSetIndex(i) } chosen={index} addElements={toggleModal} changeDrag={changeDrag} absoluteDragger={absoluteDragger} settings={settings}/> 
            </div>
          </div>
          </div>
     

        <Modal isOpen={uploadModalOpen} onClose={toggleUploadModal}>


          <CoolInput type="text" label={"Title"} onChange={setTitle} />
                <textarea
                    placeholder="Here you can give a description for others to read."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className='resource-options'>
                    <div>
                    <label className='small-label'> Category</label>
                <CategorySelect categoryId={category_id} onCategoryChange={setCategoryId} hasNull={false} />
                    </div>

                    <div>
                        <label className='small-label'>Status</label>
                    <select value={status} onChange={(e) => handleSetStatus(e.target.value)}>
                        <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="private published"> Private Published </option>
                <option value="private draft"> Private Draft </option>
                        {/* Add other status options as needed */}
                    </select>
                    </div>
                </div>
             

                {/* Submit Button */}
          <button onClick={handleSubmit}>Submit</button>
          <button style={{background: 'red'}} onClick={toggleUploadModal}>Close</button>


          </Modal>


         <Modal isOpen={isModalOpen} onClose={toggleModal}>
            <NewRowModal appendNewElements={appendNewElements} closeModal={toggleModal} resourceMeta={resourceMeta} position={index} changeElement={changeElement} updateResourceMeta={updateResourceMeta} />
        </Modal>

            <ResourceScaler/>
        </>
  );
};

export default CustomEditor;