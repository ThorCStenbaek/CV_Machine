import { useState, useEffect } from "react";
import Modal from "../../../containers/components/general/modal";
import PictureIcon from "../../icons/imageIcon";
import FileUploadAndGallery from "../../../containers/components/images/fileUploadAndGallery";
export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
  
    const [element, setElement] = useState(resourceMeta[position]);


    const [isModalOpen, setIsModalOpen] = useState(false);
  


    useEffect(() => {
        setElement(resourceMeta[position]);
        
        console.log("ELEMENT CHOSEN:", resourceMeta[position])
        }, [position, resourceMeta]);


    
        const handleImageChange = (image) => { 

        
            const updatedElement = {...element,
                path: image.path,
                // Provide a value based on your application's logic
                
            }
            changeElement(position, updatedElement);
    
            setIsModalOpen(false);
        };
    
        const handleModalClose = () => {
    
            setIsModalOpen(false);
        };





    if (element.instruction === 'CONTAINER' || element.instruction ==='DEFAULT')
        return null




        //let lastChild = findLastDescendantIndex(indexedDB, resourceMeta)
        //let children =resourceMeta.slice(position+1, lastChild+1)
        //let children = children.map((child) => (resourceMeta[child]))
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