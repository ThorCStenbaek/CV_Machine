import React, { useState, useEffect, useRef } from 'react';
import ResourceTypesContainer from './resourceType';
import CategorySelect from '../micro_components/categorySelect';
import Modal from '../general/modal';
import Category from './category';
import DeleteCategoryButton from '../micro_components/deleteCategoryButton';
import FileUploadAndGallery from '../images/fileUploadAndGallery';
import ImageWithModal from '../images/imageWithModal';
import NoImageSVG from '../images/noImageSVG';


const InsertCategoryComponent = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [subCategoryOfNameOrId, setSubCategoryOfNameOrId] = useState(null);
    const [categories, setCategories] = useState([]);
    const resourceTypesRef = useRef(null);  // Create a ref to access the ResourceTypesContainer
    const [isModalOpen, setModalOpen] = useState(false);
    const [categoryID, setCategoryID] = useState(null);
    const [allowedPostTypes, setAllowedPostTypes] = useState([]); // This is the array of allowed post types that will be sent to the server
    const [isModalImageOpen, setIsModalImageOpen] = useState(false);
    const [fileCategories, setFileCategories] = useState([]);

    const [image, setImage] = useState(null); // This is the array of allowed post types that will be sent to the server
  const toggleImageModal = () => {
    setIsModalImageOpen(!isModalImageOpen);
  };
    const onHandleImage = (image) => {
        console.log("iamge: ", image)
        setIsModalImageOpen(!isModalImageOpen);
        setImage(image);
        setModalOpen(false)



    }



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




    const handleSubmit = async () => {
        if (!name.trim() || !description.trim() ) {
            alert('Please fill in all required fields.');
            return;
        }

        // Get the selected resource types from the ResourceTypesContainer
        const selectedResourceTypes = resourceTypesRef.current.getSelectedIds();
        console.log(categoryID,name, description, subCategoryOfNameOrId, selectedResourceTypes)
        try {
            const response = await fetch('/api/insert-category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id:categoryID,
                    name,
                    description,
                    subCategoryOfNameOrId:parseInt(subCategoryOfNameOrId,10),
                    allowPostTypes: selectedResourceTypes,
                    imageID: (image ? image.ID : null)
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                alert('Error inserting category.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchNestedCategories = async () => {
            try {
                const response = await fetch('/api/nested-categories');
                if (response.ok) {
                    const result = await response.json();
                    setCategories(result.data);
                    console.log("cats:", result.data)
                } else {
                    console.error('Error fetching nested categories.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchNestedCategories();
        
    }, []);

    const recursiveCategoryOptions = (categories, prefix = '') => {
        let options = [];
        categories.forEach(category => {
            options.push(
                <option key={category.ID} value={category.ID}>
                    {prefix + category.Name}
                </option>
            );
            if (category.sub_categories) {
                options = options.concat(recursiveCategoryOptions(category.sub_categories, prefix + '--'));
            }
        });
        return options;
    };

    const handleTest = () => { 

        console.log("cats:", categories)
    }

    const handleCategoryClick = (category, add) => {
        setName(category.Name)
        setDescription(category.description)
        setSubCategoryOfNameOrId(category.sub_category_of)
        setModalOpen(false) 
        setCategoryID(category.ID)
        setAllowedPostTypes(category.allowed_post_types)
        setImage(category.file[0])
        console.log("what am I getting here", category)
    }

    const handleChangeExistingCategory = () => { 
        setModalOpen(true)  
    }
    const handleMakeNewCategory = () => { 
        setName("")
        setDescription("")
        setSubCategoryOfNameOrId(null)
        setCategoryID(null)
        setAllowedPostTypes([])
    }

    const handleOnDelete = async (categoryId, newParentId) => {

        console.log("delete", categoryId, newParentId)

        try {
            setName("")
            setDescription("")
            setSubCategoryOfNameOrId(null)
            setCategoryID(null)
            setAllowedPostTypes([])

            const response = await fetch('/api/delete-category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    toBeDeleted: categoryId,
                    newParent: parseInt( newParentId, 10)
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                alert('Error deleting category.');
            }
        } catch (error) {
            console.error('Error:', error);
        }




    }


   

 
    

    

    return (
        <>
                  <div>
            <button onClick={handleChangeExistingCategory}>Change Existing Category</button>
            <button onClick={handleMakeNewCategory}>Make New Category</button>
            </div>    
            {categoryID && <DeleteCategoryButton categoryID={categoryID} onDelete={handleOnDelete} />}

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                       <div className='flex'>
            <div className="available-categories">
                    <h2>Available Categories</h2>
                    <div className='innerDiv'>
                {categories.map(category => (
                    <Category key={category.ID} category={category} onCategoryClick={handleCategoryClick} add={true} includeSubs={true} />
                ))}
                        </div>
                    </div>
                     </div>
            </Modal>
        
        <div>
       
            <h2>Insert Category</h2>

            <div>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category Name"
                    />
                </label>
            </div>

            <div>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Category Description"
                    />
                </label>
            </div>

            <div>
        <label>
                    Sub Category Of:
                    <CategorySelect 
                        categoryId={subCategoryOfNameOrId} 
                        onCategoryChange={setSubCategoryOfNameOrId}
                        hasNull={true} // Add this if you want a 'None' option
                    />
                </label>
            </div>

            <div>
                    <ResourceTypesContainer ref={resourceTypesRef} selected={allowedPostTypes } />


                </div>
                
                {image ? <> {console.log("yeeeeeee") }<ImageWithModal image={image}  displayConfig={{CanBeSelected:false}} allImageCategories={fileCategories}/> <a onClick={toggleImageModal}>Change image</a> </>: <NoImageSVG onClick={toggleImageModal}/>}
                
            
                  <Modal isOpen={isModalImageOpen} onClose={() => setIsModalImageOpen(false)}>
        <FileUploadAndGallery onImageSelect={onHandleImage} displayConfig={{CanBeSelected:true}}/>
      </Modal>


            <button onClick={handleSubmit}>Insert Category</button>
            </div>
            </>
    );
}

export default InsertCategoryComponent;
