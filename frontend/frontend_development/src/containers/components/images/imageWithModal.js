import React, { useState, useRef, useEffect } from 'react';
import Modal from '../general/modal';
import SelectedAvailableBoxes from '../general/SelectedAvailableBoxes';
import AddFileCategory from './addFileCategory';




const ImageWithModal = ({ image, onSelectImage, displayConfig, allImageCategories }) => {

  console.log("image", image , "allImages:", allImageCategories)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState(allImageCategories);
  const [map, setMap] = useState(new Map(allImageCategories.map((category) => [category.ID, category.Name])));//[category.ID]: category.Name})
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(image.categories.map(category => category.ID));
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };



  ///FOR CATEGORIES
   const boxRef = useRef();
    const handleAssociateCategories = (fileID) => {
    if (boxRef.current) {
        const selectedIds = boxRef.current.getSelectedIds();
      console.log(selectedIds);
      setSelectedCategories(selectedIds)

        // Define the API endpoint
        const apiEndpoint = '/api/files/associate_category';

        // Prepare the request body with the fileID and the selected category IDs
        const requestBody = {
            fileID: fileID, // Ensure this variable is correctly set to the desired file ID
            categoryIDs: selectedIds
        };

        // Make the POST request
        fetch(apiEndpoint, {
            method: 'POST',
            credentials: 'include', // Needed for cookies to be sent along with the request
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
          .then(data => {
            alert('Categories updated successfully!')
            setCategoryModalOpen(false)

            console.log('Success:', data);
            // Handle the successful association here
        })
        .catch(error => {
            console.error('Error updating file-category associations:', error);
            // Handle the error here
        });
    }
};

  const handleNewCat = (newCategory) => {
    console.log("handle cat:")
    console.log(newCategory)
    const obj= {ID: newCategory.id, Name: newCategory.name}
    setAllCategories(prevCategories => [...prevCategories, obj]);
    console.log(allCategories)
setMap(prevMap => new Map([...Array.from(prevMap), [newCategory.id, newCategory.name]]));

  }

  useEffect(() => {
    setFilteredCategories(allCategories.filter(category => !image.categories.some(selectedCategory => selectedCategory.ID === category.ID)).map(category => category.ID)) 

  }, [allCategories, map])




  console.log("image", image , "allImages:", allImageCategories, "nameMap", map)

  return (
    <div>
      <img
        src={`/${image.path.replace(/\\/g, '/')}`}
        alt={image.filename}
        style={{ height: '200px', width: '200px', objectFit: 'cover', margin: '5px', border: '1px solid black' }}
        onClick={toggleModal}
      />

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="flex">
          <div className="image-holder">
            <img src={`/${image.path.replace(/\\/g, '/')}`} alt={image.filename} style={{ maxWidth: '50%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div className="info-holder">
            <div className="">
                        <p>Filename: {image.filename}</p>
          <p>ID: {image.ID}</p>


              <p>Private: {image.isPrivate ? 'Yes' : 'No'}</p>
              <div>
                <p style={{ display: 'inline-block' }}>Categories: {image.categories.map(cat => <span> {cat.Name}, </span>)} </p>
                <a className='clickable-a' onClick={()=>setCategoryModalOpen(true)}> Change Categories</a>
                </div>
                  </div>
          </div>
        </div>
        {displayConfig.CanBeSelected && (
          <button onClick={() => onSelectImage(image)}>Select Image</button>
        )}
      </Modal>

      
      <Modal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
     
  
          <div>
          <SelectedAvailableBoxes ref={boxRef}
    selected={selectedCategories} 
    available={filteredCategories} 
    nameMap={map} 
    
          />
          <AddFileCategory onUpload={handleNewCat} />
              
          <button onClick={() => handleAssociateCategories(image.ID)}>Save</button>
          <button style={{background: 'red'}} onClick={()=>setCategoryModalOpen(false)}>Cancel</button>

          </div>
      </Modal>
    </div>
  );
};

export default ImageWithModal;
