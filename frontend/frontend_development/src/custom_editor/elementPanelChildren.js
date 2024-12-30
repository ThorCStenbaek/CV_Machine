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

const ElementPanelElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
    const [element, setElement] = useState(resourceMeta[position]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editorContent, setEditorContent] = useState("");
    const [elementID, setElementID] = useState(position);

  


    useEffect(() => {
        setElement(resourceMeta[position]);
        
        }, [position, resourceMeta]);

    useEffect(() => {
        console.log("ELEMENTID", elementID)
        let textRetriever = (position >= resourceMeta.length - 1) ? document.querySelector(`.position${position - 1}`).outerHTML : document.querySelector(`.position${position}`).outerHTML;
        setTimeout(() => {
            
        
            const safeTextRetriever = textRetriever ? textRetriever : ""
            console.log("ELEMENTID", safeTextRetriever)
        setEditorContent(safeTextRetriever);

            }, 100);
    },[elementID])
    

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
    console.log("SELECTED ELEMENT", element, elementID)
    if (element.instruction === 'CONTAINER' || element.instruction ==='DEFAULT')
        return null


 /**INSERT QUILL COMPONENT */
    if (element.html_element === 'p') {

        let children = getAllChildren(position, resourceMeta)
        children = children.map((child) => (resourceMeta[child]))

        const onQuillChange = (meta) => {
    

            // Update the current element
            const updatedElement = { ...element, number_of_children: getSurfaceChildrenFromList(meta).length };
            setElement(updatedElement);
 
            // Update the resourceMeta array
            let updatedResourceMeta = [...resourceMeta];
            updatedResourceMeta[position] = updatedElement;

            // Calculate number of children to delete
            const deleteCount = getAllChildren(position, resourceMeta).length;

            // Remove the previous children

            updatedResourceMeta.splice(position + 1, deleteCount);
     
            // Insert the new meta elements
            updatedResourceMeta.splice(position + 1, 0, ...meta); // Insert without deleting any elements

            

            
            //Stupid fix.
            let prev= null
            for (let i = updatedResourceMeta.length; i > 0; i--) {

                if (prev!=null){
                if (updatedResourceMeta[i].html_element=='br' && prev.html_element=='br'){
                    updatedResourceMeta.splice(i, 1)
                }}
                prev = updatedResourceMeta[i]

            }
            let allChilds= getAllChildrenBetter(updatedResourceMeta, position)
        
            let number=0            
            for (let i = allChilds[allChilds.length-1]+1; i < updatedResourceMeta.length; i++) {
                if (updatedResourceMeta[i].instruction != "ELEMENT") {
                    number = i
                    break
                }
            }
            updatedResourceMeta.splice(allChilds[allChilds.length-1]+1, number-allChilds[allChilds.length-1]-1) 


            
            // Update the resourceMeta state
            updateResourceMeta(updatedResourceMeta);

        }


        console.log("BASEQUILL OUTER", editorContent)
                //here
        return (
  
                <BaseQuill editorContent={editorContent} setEditorContent={setEditorContent} setMetaInfo={onQuillChange}  />
           
        );
    } else if (element.html_element === 'img') {
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
    // ... other cases or default return
};


const ElementChildren = ({ position, resourceMeta, removeElement, changeElement, updateResourceMeta }) => {
    console.log("MYRESOURCE", resourceMeta[position])

    useEffect(() => { }, [resourceMeta]);

    
  
    return (
        <div>

            {resourceMeta.map((child, index) => {
                if (index <= position)    {
                    return null
                }
                if (index > position + resourceMeta[position].number_of_children) {
                    return null
                }
                if (resourceMeta[position].instruction === 'CONTAINER' || resourceMeta[position].instruction ==='DEFAULT') {
                    return null
                }
                
                return (
                    <div>

                        <ElementPanelElement position={index} resourceMeta={resourceMeta} changeElement={changeElement} updateResourceMeta={updateResourceMeta} />

               
                    </div>
                )
            })}


        </div>
    )


}

export default ElementChildren;