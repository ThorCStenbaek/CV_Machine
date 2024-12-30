import React, {useState, useEffect} from "react";
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


const ElementPanel = ({ position, resourceMeta, updateResourceMeta, handleAddNewElement, removeElement, addNewElement,toggleUploadModal, children, page }) => {
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
  
  const [activeTab, setActiveTab] = useState('pageSettings');
  const [exitModal, setExitModal] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    setActiveTab('design')
  }, [page]);
  
  
  useEffect(() => {
    setElementData(resourceMeta[position]);
  }, [position, resourceMeta]);

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
    updateResourceMeta(updatedResourceMeta);
  };

  const changeElement=(position, newElement) => {
    const updatedResourceMeta = [...resourceMeta];
    updatedResourceMeta[position] = newElement;
    updateResourceMeta(updatedResourceMeta);
  }









  
const removeAllChildren = (parentPosition, resourceMeta) => {
    const getChildPositions = (parentPosition, resourceMeta) => {
        let positions = [];
        const childrenCount = resourceMeta[parentPosition].number_of_children;

        for (let i = 1; i <= childrenCount; i++) {
            positions.push(parentPosition + i);
        }
        return positions;
    };

    let childPositions = getChildPositions(parentPosition, resourceMeta);
    
    // Reverse the array to start removing from the last child
    childPositions.reverse().forEach(childPos => {
        resourceMeta.splice(childPos, 1);
    });

    // Update the parent's number_of_children
    resourceMeta[parentPosition].number_of_children = 0;

    // Update the state or return the updated resourceMeta if needed
  updateResourceMeta(resourceMeta);
  setElementData({...elementData, number_of_children: 0, instruction: "EMPTY"})
};

// Call this function where necessary, providing the parent position and current resourceMeta

  
  
  const safeElementData = elementData || {}; // Fallback to an empty object if elementData is null or undefined

   return (
     <>
       <div>
   <div className="tabs" style={{ display: 'flex' }}>
    <button
      style={{ flex: 1, margin: 0, borderRadius: '0px', backgroundColor: activeTab === 'pageSettings' ? '#0e7abd' : '#198fd9' }}
      onClick={() => setActiveTab('pageSettings')}
      className={activeTab === 'pageSettings' ? 'active' : ''}
    >
      Page Settings
    </button>
    <button
      style={{ flex: 1, margin: 0, borderRadius: '0px', backgroundColor: activeTab === 'design' ? '#0e7abd' : '#198fd9' }}
      onClick={() => setActiveTab('design')}
      className={activeTab === 'design' ? 'active' : ''}
    >
      Design
    </button>
  </div>


      <div className="element-panel" style={{  height: "100vh", boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px', minWidth: '25vw', maxWidth: '30vw', padding: '10px' }}>
        


        {activeTab === 'pageSettings' && (
          <div className="page-settings-content">
            {children}
            
    
          </div>
        )}

        {activeTab === 'design' && (
          <div className="design-content">
            <form className="custom-editor-form" style={{ minWidth: '350px' }} onSubmit={handleSubmit}>
              <ElementInnerChild
                position={position}
                resourceMeta={resourceMeta}
                changeElement={changeElement}
                removeAllChildren={removeAllChildren}
                handleAddNewElement={handleAddNewElement}
                updateResourceMeta={updateResourceMeta}
              />
              <ElementChildren
                resourceMeta={resourceMeta}
                position={position}
                removeElement={removeElement}
                changeElement={changeElement}
                updateResourceMeta={updateResourceMeta}
              />
              <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                {elementData.instruction === "TEXT" && (
                  <div style={{ borderBottom: '1px solid lightgrey', paddingBottom: "10px", paddingLeft: '10px' }}>
                    <h4 style={{ marginBottom: '0px' }}>Font Color</h4>
                    <ChangeColor position={position} resourceMeta={resourceMeta} updateResourceMeta={updateResourceMeta} />
                  </div>
                )}
                <div style={{ borderBottom: '1px solid lightgrey', paddingBottom: "10px", paddingLeft: '10px' }}>
                  <h4 style={{ marginBottom: '0px' }}>Background Color</h4>
                  <ChangeBackgroundColor position={position} resourceMeta={resourceMeta} updateResourceMeta={updateResourceMeta} />
                </div>
              </div>
              {elementData.instruction !== 'CONTAINER' && (
                <>
                  <button type="button" onClick={removeElement} style={{ background: "red" }}>
                    Delete {elementData.instruction === 'DEFAULT' ? 'row' : 'block'}
                  </button>
                  <button type="button" onClick={() => addNewElement(position)}>add block</button>
                </>
              )}
            </form>
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

};
  // Create a new element based on the defaultMeta structure
  

  




const CustomEditor = ({resource=null, givenResourceMeta=null, givenCategory, ResoursetypeName}) => {
    const defaultMeta= {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: null,
        ordering: 0, // Default value, change as needed
        html_element: 'div' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: 'height: 1191px; padding: 20px; width: 842px;  display: flex; flex-direction: column; box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);', // Provide a value based on your application's logic
        content_type: '' , // Provide a value based on your application's logic
        content_data: '', // Provide a value based on your application's logic
        instruction: 'CONTAINER' // Provide a value based on your application's logic
    };

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


  const handleSetIndex = (index) => {
    setIndex(index);
    setChangeElementPanelPage(!changeElementPanelPage);
  
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
  const updateResourceMeta = (newResourceMeta, failsafe = true) => {

      setIsProblemPage(failsafe);
    setResourceMeta(newResourceMeta);
  };   
  useEffect(() => { console.log("rm: ", resourceMeta) }, [resourceMeta]);
  


  useEffect(() => {
 

 

    console.log("TRYYYYYY")
    const [bool, newResourceMeta] = findProblemPage(resourceMeta, isStanding);
    console.log("AFTER FUNC")
        setIsProblemPage(true);
    if (bool && isProblemPage) {
      console.log("BEFORE SET", bool, newResourceMeta)
      setResourceMeta(newResourceMeta);
          //setIsProblemPage(false);
    }

      console.log("AFTER SET")

  }, [resourceMeta]);
  

   /*
    const removeElement = () => { 
        // Calculate the insertion position for the new element
        
      
  const getBetterParent = (position, resourceMeta) => {
    
    if (resourceMeta[position].instruction == "DEFAULT") 
      return findNeigbourSpecific(position, resourceMeta, 'left', 'STOP', ['CONTAINER'])
    
    return findNeigbourSpecific(position, resourceMeta, 'left', 'CONTAINER', ['DEFAULT'])

  }
      
   
      let position = index;
      
      console.log("REMOVE RM BEFORE", position, resourceMeta)


        let positions = getAllPositions(position, resourceMeta)
        positions = positions.sort((a, b) => b - a);
       
        let lastPosition = positions[0]+1


      const parentPosition = getBetterParent(position, resourceMeta);
      let RM= [...resourceMeta]
        RM[parentPosition].number_of_children = RM[parentPosition].number_of_children - 1;
      console.log("REMOVE RM", "parent", parentPosition, RM[parentPosition])
        let con= findNeigbourSpecific(parentPosition, RM, 'left', 'STOP', ['CONTAINER'])
        if (RM[parentPosition].number_of_children == 0) {
          position = parentPosition; 

  
        }
      
      let updatedResourceMeta = [
        ...RM.slice(0, con),
        (RM[parentPosition].number_of_children == 0) || RM[position].instruction=='DEFAULT' ? {...RM[con], number_of_children: RM[con].number_of_children - 1} : RM[con],
        ...RM.slice(con, position),

        ...(lastPosition>=RM.length ? [] : RM.slice(lastPosition))
      ];
      console.log("REMOVE RM:", updatedResourceMeta)
      updatedResourceMeta=updatedResourceMeta.filter((element) => element != RM[con])
    
      console.log("REMOVE RM:", updatedResourceMeta, "positions: ", positions, "lastPosition: ", lastPosition) 
    updateResourceMeta(updatedResourceMeta);


  }
*/
  const removeElement = () =>
  {
    let elementType = resourceMeta[index].instruction;

    if (elementType === "DEFAULT") {
  
      let parentPosition = findNeigbourSpecific(index, resourceMeta, 'left', 'STOP', ['CONTAINER']);
      let RM = [...resourceMeta];
      let parent = RM[parentPosition]; parent.number_of_children -= 1;

      let lastChild = findNeigbourSpecific(index, RM, 'right', 'findNothing', ['DEFAULT', 'CONTAINER',]);

      let newRM = RM.slice(0, parentPosition)

      newRM.push(parent)
      newRM=newRM.concat(RM.slice(parentPosition + 1, index))
      newRM= lastChild != null ? newRM.concat(RM.slice(lastChild, RM.length)): newRM
      
      console.log("NEWRM", lastChild)
      console.log("NEWRM", RM)
      if (lastChild == null)
        setIndex(0)
      updateResourceMeta(newRM);

     }

    else if (elementType === "CONTAINER") {

      let RM = [...resourceMeta];
      let nextContainer = findNeigbourSpecific(index, RM, 'Right', 'STOP', ['CONTAINER']);
     

  

      let newRM = RM.slice(0, index)

      if (nextContainer != null) {
        newRM.concat(RM.slice(nextContainer, RM.length))
       }
      
      console.log("NEWRM CONTAINER",newRM)
      updateResourceMeta(newRM);


    }
    else {
      let RM = [...resourceMeta];
      let parentPosition = findNeigbourSpecific(index, RM, 'left', 'STOP', ['DEFAULT']);
      let parent = RM[parentPosition]; parent.number_of_children -= 1;

      let nextNeighbour= findNeigbourSpecific(index, RM, 'right', 'CONTAINER', ['DEFAULT', 'CONTAINER', 'EMPTY', 'TEXT', 'IMAGE', 'VIDEO']);

      let nextDefault = findNeigbourSpecific(index, RM, 'right', 'STOP', ['DEFAULT', 'CONTAINER']);
      let newRM = []
      if (parent.number_of_children != 0) {
        newRM= RM.slice(0, parentPosition)
        newRM.push(parent)
        newRM = newRM.concat(RM.slice(parentPosition + 1, index))
        nextNeighbour != null ? newRM = newRM.concat(RM.slice(nextNeighbour, RM.length)) : newRM=newRM
      }
      else {
        let containerParent = findNeigbourSpecific(parentPosition, RM, 'left', 'STOP', ['CONTAINER']);
        let container = RM[containerParent]
        container.number_of_children -= 1;
        newRM = RM.slice(0, containerParent)
        newRM.push(container)
        newRM = newRM.concat(RM.slice(containerParent + 1, parentPosition))
        console.log("remove", newRM, nextDefault, RM.slice(nextDefault))
        newRM = newRM.concat(RM.slice(nextDefault))
       
        
      }
      console.log("NEWRM", newRM)
      //setIndex(0)
      updateResourceMeta(newRM);

      
    }




    }









  const handleAddNewElement = (index, elements = []) => {
  // Function to calculate the insertion position for a new element
    const getInsertionPosition = (currentIndex, resourceMeta) => {
    
      
    const children = resourceMeta[currentIndex].number_of_children;
    let sum = 0;
    
    for (let i = 0; i < children; i++) {
      sum += getInsertionPosition(currentIndex + sum + 1, resourceMeta);
    }

    return sum + 1;
  };

  // Start with the current resourceMeta
  let updatedResourceMeta = [...resourceMeta];

    elements.forEach(element => {
    
    // Create a new element based on the provided element or the default structure
    const newElement = element || {
      html_element: 'p',
      number_of_children: 0,
      specific_style: 'height: 100px; width: auto; display:flex;  ',
      content_type: '',
      content_data: 'new',
      instruction: 'DEFAULT'
    };

    // Update the number_of_children of the current element
    const updatedElementData = {
      ...updatedResourceMeta[index],
      number_of_children: updatedResourceMeta[index].number_of_children + 1
    };

      // Calculate the insertion position for the new element
    
    const insertionPosition = getInsertionPosition(index, updatedResourceMeta) + index;

    // Create a new array with the updated current element and the new element
    updatedResourceMeta = [
      ...updatedResourceMeta.slice(0, insertionPosition),
      newElement,
      ...updatedResourceMeta.slice(insertionPosition)
    ];

    // Update the current element in the array
    updatedResourceMeta[index] = updatedElementData;
  });

  // Update the parent state with the new resourceMeta array
  updateResourceMeta(updatedResourceMeta);
  };
  
  const appendNewElements = (elements = [], rows = 1) => {
    console.log("CONTAINER INDEX: ", index)
    let UM = [...resourceMeta];

let neighbour = findNeigbourSpecific(index + 1, UM, 'right', 'STOP', ['CONTAINER']);
// If no neighbour is found, set `neighbour` to `UM.length` to append at the end.
neighbour = neighbour !== null ? neighbour : UM.length;

// Since `neighbour` is now correctly set to `UM.length` when no neighbour is found,
// `UM.slice(neighbour)` will be an empty array, effectively appending `elements` at the end.
UM = UM.slice(0, neighbour).concat(elements).concat(UM.slice(neighbour));
    UM[index].number_of_children = UM[index].number_of_children + rows;
    console.log("UM:", UM, "NEIGHBOUR: ", neighbour)
    updateResourceMeta(UM);
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






  


  function findAndRemoveElement(position, resourceMeta) {

    let updatedResourceMeta = [...resourceMeta];
    
    let lastChild = position;
    for (let i = position+1; i < updatedResourceMeta.length; i++) {
    
      if (updatedResourceMeta[i].instruction == "EMPTY" || updatedResourceMeta[i].instruction == "TEXT" || updatedResourceMeta[i].instruction == "IMAGE" || updatedResourceMeta[i].instruction == "VIDEO") {
        lastChild = i-1;
        break;
      }
    }

    for (let i = position; i >= 0; i--) {
      if (updatedResourceMeta[i].instruction == "DEFAULT") {
        
        updatedResourceMeta[i].number_of_children = updatedResourceMeta[i].number_of_children - 1;
        break;
      }


     }

    updatedResourceMeta.splice(position, lastChild - position +1);

    return updatedResourceMeta;
   }


  
  const changeDrag = (position, X, side) => {
    /**
     * TO DO: 
     * 1. Get the entire percentage of the all columns --> 100%
     * 2. Does it have any neighbours? If not, then check percentage. If 100%, then don't change, 
     *    otherwise you can change the percentage of the current column until it reaches 100%.
     */


    if (side == "down") {
      let resourceMetaCopy = [...resourceMeta];
      
      const regex = /height:\s*(\d+(\.\d+)?)px/;
      const match = resourceMetaCopy[position].specific_style.match(regex);


    
      let currentHeight = match ? parseInt(match[1]) : document.querySelector(`.position${position}`).offsetHeight;
      let newHeight = currentHeight + (X * -1)

      resourceMetaCopy[position].specific_style = resourceMetaCopy[position].specific_style.replace(/height:\s*[^;]+;/, `height:${newHeight}px;`)

      updateResourceMeta(resourceMetaCopy);
      return; 
    }




   

    let total = findPercentageOf(Math.abs(X), 615);
    
  let resourceMetaCopy = [...resourceMeta];

    const neighbour = findNeigbour(position, resourceMeta, side);
 
  const regex = /flex: 0 0 (\d+(\.\d+)?)%/;



    const match = resourceMetaCopy[position].specific_style.match(regex);
    
    let neighbourMatch = (neighbour) ? resourceMetaCopy[neighbour].specific_style.match(regex) : null;


    let currentFlexPercentage = parseFloat(match[1]);
    
    let neighbourFlexPercentage = (neighbour) ? parseFloat(neighbourMatch[1]) :  100-findFullPercentage(position, resourceMeta);

 
    
  if (match ) {
    // Extract the numeric percentage values from the match


    if (total > neighbourFlexPercentage && side == "left" && X <0) {
      
    
      total = neighbourFlexPercentage;
    }
    else if (total > neighbourFlexPercentage && side == "right" && X >0) {
      total = neighbourFlexPercentage;
    }


    if (side === "left") {
      let newCurrentFlexPercentage = (X<0)? currentFlexPercentage + total : currentFlexPercentage - total;
      let newNeighbourFlexPercentage = (X<0) ? neighbourFlexPercentage - total : neighbourFlexPercentage + total;
     
      // Ensure new percentages are not negative
      newCurrentFlexPercentage = Math.max(0, newCurrentFlexPercentage);
      newNeighbourFlexPercentage = Math.max(0, newNeighbourFlexPercentage);

      resourceMetaCopy[position].specific_style = resourceMetaCopy[position].specific_style.replace(regex, `flex: 0 0 ${newCurrentFlexPercentage}%`);
      
      if (neighbour)
        resourceMetaCopy[neighbour].specific_style = resourceMetaCopy[neighbour].specific_style.replace(regex, `flex: 0 0 ${newNeighbourFlexPercentage}%`);
    } else {
      let newCurrentFlexPercentage =  (X<0)? currentFlexPercentage - total : currentFlexPercentage + total; 
      let newNeighbourFlexPercentage = (X<0) ? neighbourFlexPercentage + total : neighbourFlexPercentage - total;
  
      // Ensure new percentages are not negative
      newCurrentFlexPercentage = Math.max(0, newCurrentFlexPercentage);
      newNeighbourFlexPercentage = Math.max(0, newNeighbourFlexPercentage);

      resourceMetaCopy[position].specific_style = resourceMetaCopy[position].specific_style.replace(regex, `flex: 0 0 ${newCurrentFlexPercentage}%`);
      if (neighbour)
      resourceMetaCopy[neighbour].specific_style = resourceMetaCopy[neighbour].specific_style.replace(regex, `flex: 0 0 ${newNeighbourFlexPercentage}%`);
    }
  } else {
    console.log("No matching flex pattern found.");
    }

    if (neighbour){
    if (total+0.1 > neighbourFlexPercentage && side == "left" && X <0) {

    resourceMetaCopy= findAndRemoveElement(neighbour, resourceMetaCopy);
    
    }
    else if (total+0.1 > neighbourFlexPercentage && side == "right" && X > 0) {
     
      resourceMetaCopy= findAndRemoveElement(neighbour, resourceMetaCopy);
      }
      }




  updateResourceMeta(resourceMetaCopy);
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
            specific_style: `height: auto; minHeight: 100px; position: relative; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; `,
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
      updateResourceMeta(copyRM);
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
    updateResourceMeta(copyRM);






    
    





  }
  
  const headerSize= "35"
  



    return (
        <>


            <div style={{
          display: "flex", 
              
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
            >
                      <HeaderPanel isStanding={isStanding} setIsStanding={setIsStanding} size={headerSize} title={title} setTitle={setTitle}>

              <Hint hintText={"The grid disables or shows the grid on the page."} >
         <GridToggle position={index} resourceMeta={resourceMeta} updateResourceMeta={updateResourceMeta} size={headerSize} />
          </Hint>
        
              
              <Hint hintText={"Change the direction of the page."} >
                <ChangeDirection size={headerSize} />
              </Hint>
        </HeaderPanel>



            </ElementPanel>
            
                 

           


          <div style={{ width: '20px', }}>
      
      </div>
         <div className='resource-canvas' style={{border: 'none'}}>
            <ElementBuilder jsonData={resourceMeta} editing={true} changeElement={(i)=> handleSetIndex(i) } chosen={index} addElements={toggleModal} changeDrag={changeDrag} /> 
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
            <NewRowModal appendNewElements={appendNewElements} closeModal={toggleModal} />
        </Modal>

            <ResourceScaler/>
        </>
  );
};

export default CustomEditor;