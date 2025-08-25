import { useState, useEffect } from "react";
import Modal from "../../../containers/components/general/modal";
import PictureIcon from "../../icons/imageIcon";
import FileUploadAndGallery from "../../../containers/components/images/fileUploadAndGallery";
import { useContentElement } from "../useContentElement";



export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
  



    const [isModalOpen, setIsModalOpen] = useState(false);
  
const contentConfig = {
    defaultData: { 
      path:""
    },
    innerStyleDefaults: {
     
    }
  };

  const {
    setElement,
    handleFieldChange,
    deferHandleFieldChange,
    element,
    contentData,
    setContentData,
    handleNestedChange,
    handleStyleChange,
    handleAddItemToArray,
    updateElement
  } = useContentElement({
    contentConfig,
    initialElement: resourceMeta[position],
    position,
    changeElement
  });
  





    useEffect(() => {
        setElement(resourceMeta[position]);
        
        console.log("ELEMENT CHOSEN:", resourceMeta[position])
        }, [position, resourceMeta]);


    
        const handleImageChange = (image) => { 

        
            const updatedElement = {...element,
                path: image.path,
                // Provide a value based on your application's logic
                
            }
            handleFieldChange("path", image.path);
            //updateElement(updatedElement);
    
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
                        {contentData.path && (contentData.path) ? (
                        
                        <img src={"/"+contentData.path} alt="Selected" style={{ width: "150px", height: "150px" }} />
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