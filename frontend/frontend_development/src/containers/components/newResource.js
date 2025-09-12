import React, { useState, useEffect, useRef } from 'react';
import FileUploadComponent from './file_upload'; // Assuming it's in the same directory
import QuillComponent from './quill/quillTest'; // Assuming it's in the same directory
import CategorySelect from './micro_components/categorySelect';
import EditorSelect from './micro_components/editorSelect';
import CustomEditor from '../../custom_editor/CustomEditor';
import ElementBuilder from './elementBuilder';
import CenteredWrapper from './micro_components/centeredWrapper';
import Modal from './general/modal';
import { useLocation } from 'react-router-dom';
import CoolInput from './general/coolInput';

import { useNavigate } from 'react-router-dom';

//function NewResourceComponent({post_type, typeName, chosenEditor})
function NewResourceComponent({ postType, resource = null, resourceMeta = null }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const cat = searchParams.get('cat');


    const [category_id, setCategoryId] = useState(resource?.category_id || ''); // This might need to be an integer
    const [title, setTitle] = useState(resource?.title ||'');
    const [description, setDescription] = useState(resource?.description ||'');
    const [post_type, setPostType] = useState(postType.id); // This might need to be an integer
    const [typeName, setTypeName] = useState(postType.name);
    const [metaInfo, setMetaInfo] = useState(resourceMeta || []);
    const [classNames, setClassNames] = useState([]);
    const [status, setStatus] = useState(resource?.status ||'draft'); // Default status
    const [isPrivate, setIsPrivate] = useState(false); // Default to public
    const [editor, setEditor] = useState(resource?.editor_used || 0); // This will be the editor instance from the editor library you choose to use


    const [editorContent, setEditorContent] = useState('');
    const [prevEditorContent, setPrevEditorContent] = useState(''); // This will be the editor instance from the editor library you choose to use
    const [editors, setEditors] = useState([]);
      const fileUploadRef = useRef(null);

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const navigate = useNavigate();
    
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

  const handleUploadFileFromParent = async () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.uploadFile();
    }
  };




    useEffect(() => {
        if (cat) {
            setCategoryId(cat);
            console.log("CAT", cat)
        }
    }, [cat]);


    const toggleUploadModal = (e) => {
        setUploadModalOpen(!uploadModalOpen);
        
    }


    useEffect(() => {
         setTimeout(() => {
         
        let textRetriever = (resourceMeta) ? document.querySelector(`.resource-elements`).outerHTML : document.querySelector(`.resource-elements`).outerHTML;
      
        
            const safeTextRetriever = textRetriever ? textRetriever : ""
       
        setEditorContent(safeTextRetriever);

            }, 500);
    },[])




    const appendToMetaInfo = (newItem) => {
        console.log("newItem", newItem)
        setMetaInfo(prevMetaInfo => [...prevMetaInfo, newItem]);
       
    }

     useEffect(() => {
        fetch(`/api/editors-by-post-type?postTypeID=${postType.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setEditors(data.data);
                    console.log("nw r: ", data.data)

                    if (data.data.length === 1) {
                        setEditor(data.data[0].id);
                    }
                } else {
                    console.error('Failed to fetch editors');
                }
            })
            .catch(error => console.error('Error fetching editors:', error));
    }, [postType.id]);

    const handleEditorSelect = (editorId) => {
        setEditor(editorId[0]);
    };








    const handleSubmit = async () => {
        // Validation or conversion to proper types should be done here

       

        console.log("MY META", metaInfo)

        fetch((resource ? '/api/update-resource':'/api/insert-new-resource'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({resource_id: resource?.id || null,
                category_id: parseInt(category_id, 10), // Convert to integer
                title,
                //the editor == 2 is the forum. It has no description, but get's it from the text in the forum. 
                description: (editor==2) ? document.querySelector(".ql-editor").innerText : description,
                post_type: parseInt(post_type, 10), // Convert to integer
                typeName,
                metaInfo,
                classNames,
                status, // Include status in the request
                isPrivate, // Include isPrivate in the request
                editor_used: editor
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Resource inserted successfully with ID: ' + data.resourceId);

              
                // After reload, navigate to a different route (replace with your desired route)
                setTimeout(() => {
                       window.location.reload();
                   
                }, 100); // Adjust the timeout as needed
             navigate(`/${typeName}`);
            } else {
                alert('Error inserting resource.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error);
        });
    };








    if (editor===3)
    return(
<CustomEditor givenCategory={category_id} typeName={typeName} />
        )


    if (editor === 2) {
        
        return (
            <>
                <CenteredWrapper>
                    <div>
            <h2>  {typeName}</h2>
                <h3>Title</h3>
                <CoolInput label="Title" name="title" value={title} onChangeE={(e) => setTitle(e.target.value)} required />

                <QuillComponent editorContent={editorContent} setEditorContent={setEditorContent} metaInfo={metaInfo} setMetaInfo={setMetaInfo} />
                

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
        </div>

</CenteredWrapper>
        </>
        
        );


    }

    if (editor === 1) {
        return (
                  <>
                <CenteredWrapper>
                    <div>
            <h2>  {typeName}</h2>
                <h3>Title</h3>
                <CoolInput label="Title" name="title" value={title} onChangeE={(e) => setTitle(e.target.value)} required />

                  <FileUploadComponent  ref={fileUploadRef} onAppendMetaInfo={appendToMetaInfo} showButton={false}  accept={"image/*,application/pdf"} />
                

                        <div className='resource-options'>
                              <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
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
        </div>

</CenteredWrapper>
        </>

        )
    }


    if (editor === 0)
        return (
            <CenteredWrapper>
                <div>
                    <h2>Select an Editor</h2>
                    <EditorSelect chooseOnlyOne={true} onEditorChange={handleEditorSelect} givenEditors={editors}/>
                </div>
                </CenteredWrapper>
                )
    

}

export default NewResourceComponent;
