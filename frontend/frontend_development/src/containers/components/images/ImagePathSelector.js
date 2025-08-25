import { useState } from "react";
import Modal from "../general/modal";
import PictureIcon from "../../../custom_editor/icons/imageIcon";
import FileUploadAndGallery from "./fileUploadAndGallery";
export const ImagePathSelector = ({ onImageSelected, currentPath = "" }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageChange = (image) => {
        onImageSelected(image.path);
        setIsModalOpen(false);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    console.log("CURRENT PATH?", currentPath)

    return (
        <>
            <div onClick={() => setIsModalOpen(true)}>
                {currentPath && currentPath!=""  && currentPath!="none"? (
                    <img 
                        src={`/${currentPath}`} 
                        alt="Selected" 
                        style={{ width: "150px", height: "150px", cursor: "pointer" }} 
                    />
                ) : (
                    <div style={{ position: 'relative', fill: 'grey', cursor: "pointer" }}>
                        <div style={{
                            position: 'absolute', 
                            width: "150px", 
                            height: "150px", 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center'
                        }}>
                            <h6>Select Image</h6>
                        </div>
                        <PictureIcon size="150px" />
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                <FileUploadAndGallery 
                    onImageSelect={handleImageChange} 
                    displayConfig={{ CanBeSelected: true }} 
                />
            </Modal>
        </>
    );
};