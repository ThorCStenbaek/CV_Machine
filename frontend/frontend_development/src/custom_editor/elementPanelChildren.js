import React, {useState, useEffect} from "react";
import FileUploadAndGallery from "../containers/components/images/fileUploadAndGallery";
import Modal from "../containers/components/general/modal";
import BaseQuill from "../containers/components/quill/baseQuill";
import getAllChildren from "./util/getAllChildren";
import getSurfaceChildrenFromList from "./util/getSurfaceChildrenFromList";
import ElementBuilder from "../containers/components/elementBuilder";
import getAllChildrenBetter from "./util/fixChildrenProblem";
import PictureIcon from "./icons/imageIcon";
import CoolInput from "../containers/components/general/coolInput";
import findLastDescendantIndex from "./newUtils/findLastDescendant";

import { CVElements } from "./newClasses/CVElements";

const ElementPanelElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
    const [element, setElement] = useState(resourceMeta[position]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editorContent, setEditorContent] = useState("");
    const [elementID, setElementID] = useState(position);

  


    useEffect(() => {
        setElement(resourceMeta[position]);
        
  
        }, [position, resourceMeta]);


    

    const handleChange = (e) => {
        const updatedElement = { ...element, [e.target.name]: e.target.value };
        setElement(updatedElement);
        changeElement(position, updatedElement);
    };

    const handleImageChange = (image) => { 

        
        const updatedElement = {
             ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: image.ID,
        ordering: 0, // Default value, change as needed
        html_element: 'img' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: 'height: 100%; width: 100%;', // Provide a value based on your application's logic
        content_type: 'img' , // Provide a value based on your application's logic
        content_data: '', // Provide a value based on your application's logic
            instruction: 'ELEMENT',
            path: image.path,
            // Provide a value based on your application's logic
            
        }
        changeElement(position, updatedElement);

        setIsModalOpen(false);
    };

    const handleModalClose = () => {

        setIsModalOpen(false);
    };


    const CVelement= CVElements.get(element.instruction)

    if (CVelement){
        const InputElement=CVelement.inputElement
        return <InputElement position={position}  resourceMeta={resourceMeta} changeElement={changeElement} updateResourceMeta={updateResourceMeta}/>
    }




    if (element.instruction === 'CONTAINER' || element.instruction ==='DEFAULT')
        return null


 /**INSERT QUILL COMPONENT */
   if (element.html_element === 'img') {
        return (
            <>
                <label>
         
                    <div  onClick={() => setIsModalOpen(true)}>
                        {element.path && (element.path) ? (
                        
                        <img src={"/"+element.path} alt="Selected" style={{ width: "150px", height: "150px" }} />
                        ) : 
                        
                            <div style={{position: 'relative',fill: 'grey'}}> 
                                <div style={{position: 'absolute', width: "150px", height:  "150px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <h6 style={{  }}> Select Image</h6>
                                </div>
                                <PictureIcon  size="150px"/>
                                </div>
                        }

                    </div>


           
                </label>
                <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                    <FileUploadAndGallery onImageSelect={handleImageChange} displayConfig={{ CanBeSelected: true }} />
                </Modal>
            </>
        );
    }
    else if (element.html_element === 'video') {
        return (
            <div>
               
   
                <CoolInput label={"Video Url"} onChangeE={handleChange} value={element.content_data} name={"content_data"} />
            </div>
        );
    }








    return null
    // ... other cases or default return
};


const ElementChildren = ({ position, resourceMeta, removeElement, changeElement, updateResourceMeta }) => {


    useEffect(() => { }, [resourceMeta]);

    



  
    return (
        <div>

   
                    <div>

                        <ElementPanelElement position={position } resourceMeta={resourceMeta} changeElement={changeElement} updateResourceMeta={updateResourceMeta} />

               
                    </div>
           


        </div>
    )


}

export default ElementChildren;