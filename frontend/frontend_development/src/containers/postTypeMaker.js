import React, { useRef, useState, useEffect } from 'react';
import CategoriesContainer from './categoryBoxes';
import EditorSelect from './components/micro_components/editorSelect';
import Modal from './components/general/modal';
import DisplayConfigComponent from './components/micro_components/displayConfigComponent';

const ParentComponent = () => {
    const categoriesRef = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [typeName, setTypeName] = useState('');
    const [resourceTypes, setResourceTypes] = useState([]);
    const [previousSelectedResources, setPeviousSelectedResources] = useState([])
    const [selectedResourceType, setSelectedResourceType] = useState(null)
    const [selectedResourceTypeName, setSelectedResourceTypeName] = useState("New")
    const [showAddNewResourceType, setShowAddNewResourceType] = useState(false);
     const [selectedEditors, setSelectedEditors] = useState([]);
    const [description, setDescription] = useState('');
const [postName, setPostName] = useState('');
const [postNamePlural, setPostNamePlural] = useState('');
const [displayConfig, setDisplayConfig] = useState({});


     const handleEditorChange = (selectedEditorIds) => {
         setSelectedEditors(selectedEditorIds);
         console.log("selected editors: ", selectedEditorIds)
    };

    useEffect(() => {
        const fetchResourceTypes = async () => {
            try {
                const response = await fetch('/api/all-resource-types');
                if (response.ok) {
                    const result = await response.json();
                    setResourceTypes(result.data);
                } else {
                    console.error('Error fetching resource types.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchResourceTypes();
    }, []);

    const handleResourceTypeClick = async (type) => {
            console.log("selected resource type: ", type)
        try {
            setShowAddNewResourceType(false);
             setModalOpen(false);
            setSelectedResourceTypeName(type.name)
            setTypeName(type.name)  
            setSelectedResourceType(type.id)
            setDescription(type.description)
            setPostName(type.post_name)
            setPostNamePlural(type.post_name_plural)
            const response = await fetch(`/api/category-ids-by-post-type?postType=${type.id}`);
            if (response.ok) {
                const result = await response.json();
                const fetchedCategoryIds = result.data;
                setPeviousSelectedResources(fetchedCategoryIds)
                // Pass the fetched category IDs to the CategoriesContainer
                /*
                if (categoriesRef.current) {
                    categoriesRef.current.setSelectedCategoryIds(fetchedCategoryIds);
                }
            } else {
                console.error('Error fetching category IDs for post type.'); */
            }
            
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async () => {
        if (categoriesRef.current && typeName.trim() && postName.trim() && postNamePlural.trim()) {
            const selectedIds = categoriesRef.current.getSelectedIds();
            
            const response = await fetch('/api/add-resource-type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    typeName,
                    description,  // Now sending the description
                    postName,     // Now sending postName
                    postNamePlural, // Now sending postNamePlural
                    categoryIDs: selectedIds,
                    editorIDs: selectedEditors,
                    displayConfig: displayConfig
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                alert('Error adding resource type.');
            }
        } else {
            alert('Please provide a valid type name, post name, post name plural, and select at least one category.');
        }
    };



        const handleGetSelectedIds = () => {
        if (categoriesRef.current) {
            const selectedIds = categoriesRef.current.getSelectedIds();
            console.log(selectedIds);
        }
    };

    const handleInsertAllowedCategories = async () => {
    if (categoriesRef.current && selectedResourceType) {
        const selectedIds = categoriesRef.current.getSelectedIds();
        
        const response = await fetch('/api/change-resource-type', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id:selectedResourceType,
                    typeName,
                    description,  // Now sending the description
                    postName,     // Now sending postName
                    postNamePlural, // Now sending postNamePlural
                postTypes: [selectedResourceType],
                categoryIDs: selectedIds,
                editorIDs: selectedEditors,
                displayConfig: displayConfig
            })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
        } else {
            alert('Error inserting allowed categories.');
        }
    } else {
        alert('Please select a resource type and at least one category.');
    }
    };
    
    const handleMakeNewResource = () => {
        setShowAddNewResourceType(true);

         setSelectedResourceTypeName("")
            setTypeName("")  
            setSelectedResourceType(null)
            setDescription("")
            setPostName("")
        setPostNamePlural("")
        setPeviousSelectedResources([])
        setSelectedEditors([])
    };

   const handleChangeExistingResource = () => {
        setModalOpen(true);
    };



    const handleNameChange = (value) => { 
        setTypeName(value)
        setSelectedResourceTypeName(value)

    }

    const handleDisplayConfigChange = (value) => { 
        console.log("display config: ", value)
        setDisplayConfig(value)
    }

    const returnInputFields = () => (
        <div className='flex'>

    <div>
    <label>
        Type Name:
        <input type="text" value={typeName} onChange={(e) => handleNameChange(e.target.value)} placeholder="Enter Type Name"/>
    </label>
    <label>
        Description (optional):
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description"/>
                </label>
            </div>
            <div>
    <label>
        Post Name:
        <input type="text" value={postName} onChange={(e) => setPostName(e.target.value)} placeholder="Enter Post Name"/>
    </label>
    <label>
        Post Name Plural:
        <input type="text" value={postNamePlural} onChange={(e) => setPostNamePlural(e.target.value)} placeholder="Enter Post Name Plural"/>
                </label>
                </div>
</div>
    )



 return (
        <div>
         {/* Buttons */}
         <div>
            <button onClick={handleChangeExistingResource}>Change Existing Resource</button>
            <button onClick={handleMakeNewResource}>Make New Resource</button>
            </div>
            {/* Modal for choosing resource type */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div>
                    <h2>Resource Types:</h2>
                    <p>Chosen resource: {selectedResourceTypeName}</p>
                    <div className='innerDiv'>
                        {resourceTypes.map(type => (
                            <div key={type.id} onClick={() => handleResourceTypeClick(type)}>
                                {type.name}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Conditional rendering for adding new resource type */}
            {showAddNewResourceType && (
                <div>
                    <h2>Making new postType</h2>
                    {/* Additional content for adding new resource type */}
                </div>
            )}

            {returnInputFields()}
            <CategoriesContainer ref={categoriesRef} previousSelected={previousSelectedResources} />

            <EditorSelect 
                onEditorChange={handleEditorChange} 
                chooseOnlyOne={false} 
                postID={selectedResourceType} 
         />
         <DisplayConfigComponent postType={selectedResourceType}  onClick={handleDisplayConfigChange}/>

            {showAddNewResourceType ? (
                <button onClick={handleSubmit}>Add Resource Type</button>
            ) : (
                <button onClick={handleInsertAllowedCategories}>Insert Allowed Categories</button>
            )}
        </div>
    );
}

export default ParentComponent;
