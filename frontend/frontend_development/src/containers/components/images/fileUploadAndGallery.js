import React, { useState, useEffect } from 'react';
import FileUploadComponent from '../file_upload';
import ImageGallery from './imageGallery';
import Modal from '../general/modal';

const FileUploadAndGallery = ({ onImageSelect, displayConfig }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshGallery, setRefreshGallery] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [apiString, setApiString] = useState('/api/files?fileId=-1');
    const [prevApiString, setPrevApiString] = useState('');
    const [fileCategories, setFileCategories] = useState([]);

    const [chosen, setChosen] = useState('all');

    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (refreshGallery || apiString !== prevApiString) {
        
            console.log("API STRING", apiString)    
        
        fetch(apiString)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setImages(data);
            setLoading(false);
          })
          .catch(error => {
            setError(error);
            setLoading(false);
          });
            }
      }, [refreshGallery, apiString]);

    
    
    useEffect(() => {
    // Fetch file categories only once on component mount
    fetch('/api/files/all_categories')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
        .then(data => {
          console.log("all file categories", data)
        setFileCategories(data); // Assuming the API returns an array of categories
      })
      .catch(error => {
        console.error("Error fetching file categories:", error);
      });
}, []); // Empty dependency array ensures this runs only onc
    
    useEffect(() => {
     
    }, [chosen, images]);
    
    
    const handleAppendMetaInfo = (metaObject) => {
        console.log(metaObject);
        setRefreshGallery(true);
        setModalOpen(false);
    };

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };  

    const uploadType = 'image';

    
  const handleClick = (api, newChoice) => {

    if (newChoice == chosen) 
      return;
    
        setLoading(true)
           setChosen(newChoice);
        setApiString(api);
     
    
  }
  
  const displayCategories = () => {
      setShowCategories(!showCategories)

   }


return (
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%'}}>
            {/* <div style={{display: 'flex', marginBottom: '20px', flexDirection: 'column', width: '25vh', marginTop: '30vh'}}>

            <button className={`clickable-button ${chosen=='all' ? 'chosen-button' : ''}`} onClick={() => handleClick('/api/files?fileId=-1', 'all')}>All Images</button>
            <button className={`clickable-button ${chosen=='mine' ? 'chosen-button' : ''}`}  onClick={() => handleClick('/api/my_files', 'mine')}>My uploads</button>
      
      <button className={`clickable-button ${chosen == 'imagesByUsers' ? 'chosen-button' : ''}`} onClick={() => handleClick(`/api/files_used`, `imagesByUsers`)}  >Images by users</button>


      <p className='plusminus-toggle' onClick={displayCategories} >Categories {showCategories ? "-" :  "+"} </p>
      <div style={{ overflow: 'hidden', transition: '1s all', maxHeight: (showCategories ? '1000px' : '0px'), display: 'flex', flexDirection: 'column' }}>
        {fileCategories.map(category => (
          <button className={`clickable-button ${chosen==category.ID ? 'chosen-button' : ''}`} onClick={()=>  handleClick(`/api/files/category/${category.ID}`, `${category.ID}`)} key={category} >{category.Name}</button>
        ))}
      </div>

            
      


        </div>      */}
        <div style={{width: '100%'}}>
            <h2 style={{ textAlign: 'center' }}>Image Gallery</h2>
                                      <button   onClick={() => setModalOpen(true)}>Upload File</button>
       
            { chosen != 'imagesByUsers' || loading ?
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>

                <ImageGallery 
                    images={images} 
                    loading={loading} 
                    error={error} 
                    onImageSelect={onImageSelect} 
                    displayConfig={displayConfig} 
                    key={refreshGallery} 
                    allImageCategories={fileCategories}
                />
            </div>
                :
                 images.map((user) => {
        // Check if the user has resources and they are not empty
        if (user.Resources && user.Resources.length > 0) {
            return (
                <div key={user.UserID} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <h3>{user.Firstname} {user.Lastname}</h3>
                    {user.Resources.map((resource) => (
                        <React.Fragment key={resource.ResourceID}>
                            <p>{resource.ResourceTitle}</p>
                            <ImageGallery images={resource.Files} loading={loading} error={error} onImageSelect={onImageSelect} displayConfig={displayConfig} key={refreshGallery} allImageCategories={fileCategories} />
                        </React.Fragment>
                    ))}
                </div>
            );
        } else {
            // Optionally return null or some placeholder if there are no resources
            return null;
        }
    })
                }

            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <h2>Upload File</h2>
                <FileUploadComponent onAppendMetaInfo={handleAppendMetaInfo} type={uploadType} onImageSelect={onImageSelect} showCats={true} categories={fileCategories} />
            </Modal>
        </div>
    </div>
);

};

export default FileUploadAndGallery;
