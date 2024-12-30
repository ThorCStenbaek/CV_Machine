import React, { useState, useEffect } from 'react';
import EditorIcon1 from './editor-icons/editorIcon1';
import EditorIcon2 from './editor-icons/editorIcon2';
import EditorIcon3 from './editor-icons/editorIcon3';

const editorIcons = {
  1: EditorIcon1,
  2: EditorIcon2,
  3: EditorIcon3

  // Add other editor icons here
};



const EditorSelect = ({ onEditorChange, chooseOnlyOne, postID, givenEditors }) => {
    const [editors, setEditors] = useState(givenEditors || []);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEditors, setSelectedEditors] = useState([]);
    console.log("given editors: ", givenEditors)
    console.log("editors: ", editors)





    useEffect(() => {
        const fetchEditors = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!givenEditors){
                const response = await fetch('/api/all-editors');
                if (response.ok) {
                    const allEditors = await response.json();
                    setEditors(allEditors.data);
                   
           
                } else {
                    throw new Error('Error fetching editors.');
                    }
                }
                else{ setEditors(givenEditors)}
                
                if (postID) {
                    const responseByPost = await fetch(`/api/editors-by-post-type?postTypeID=${postID}`);
                    if (responseByPost.ok) {
                        const editorsByPost = await responseByPost.json();
                        setSelectedEditors(editorsByPost.data.map(editor => editor.id));
                         onEditorChange(editorsByPost.data.map(editor => editor.id))
                    } else {
                        //throw new Error('Error fetching selected editors.');
                    }
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEditors();
    }, [postID]);

    const handleEditorSelection = (editorId) => {
        if (chooseOnlyOne) {
            setSelectedEditors([editorId]);
            onEditorChange([editorId]);
        } else {
            const updatedSelection = selectedEditors.includes(editorId)
                ? selectedEditors.filter(id => id !== editorId)
                : [...selectedEditors, editorId];
            setSelectedEditors(updatedSelection);
            onEditorChange(updatedSelection);
        }
        console.log(selectedEditors);
    };


    if (isLoading) return <p>Loading editors...</p>;
    if (error) return <p>Error loading editors: {error}</p>;

    const getEditorIconComponent = (editorId) => {
    const IconComponent = editorIcons[editorId];
    return IconComponent ? <IconComponent /> : null;
  };

  if (isLoading) return <p>Loading editors...</p>;
  if (error) return <p>Error loading editors: {error}</p>;

    
    
    return (
      
        
        <div className="editor-grid">
            {givenEditors ?
            givenEditors.map(editor => (
        <div key={editor.id} 
             className={`editor-item ${selectedEditors.includes(editor.id) ? 'selected' : ''}`}
             onClick={() => handleEditorSelection(editor.id)}>
          <div className="editor-image">
            {getEditorIconComponent(editor.id)}
          </div>
          <div className="editor-info">
            <h3 className="editor-name">{editor.name}</h3>
            <p className="editor-description">{editor.description}</p>
          </div>
        </div>
      ))
            
            : 
      editors.map(editor => (
        <div key={editor.id} 
             className={`editor-item ${selectedEditors.includes(editor.id) ? 'selected' : ''}`}
             onClick={() => handleEditorSelection(editor.id)}>
          <div className="editor-image">
            {getEditorIconComponent(editor.id)}
          </div>
          <div className="editor-info">
            <h3 className="editor-name">{editor.name}</h3>
            <p className="editor-description">{editor.description}</p>
          </div>
        </div>
      ))} 
    </div>
  );
};

export default EditorSelect;
