import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import createMetaObjects from '../../../util/metaObjects';
import ElementBuilder from '../elementBuilder';
import Modal from '../general/modal';
import FileUploadAndGallery from '../images/fileUploadAndGallery';
import { set } from 'date-fns';

// Define your modules and formats outside of the component to prevent re-creation on each render



const QuillComponent = ({ editorContent, setEditorContent, metaInfo, setMetaInfo }) => {
  const [value, setValue] = useState(editorContent);
  const quillRef = useRef(null);
  const [resourceMeta, setResourceMeta] = useState(metaInfo) 
  const [isFocused, setIsFocused] = useState(false);
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
 const [showPage, setShowPage] = useState(false);
  


  const onHandleImage = (image) => {
    console.log("image: ", image);
    closeImageModal();


    // Ensure the editor and the selection range are available
    quillRef.current.focus()
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    console.log("editor: ",editor,"range: ", range)
    if (range) {
      // Insert the image into the editor at the selection range
    

      setTimeout(() => editor.insertEmbed(range.index, 'image', `/${image.path}`), 100); 
      setTimeout(() => editor.setSelection(range.index + 1), 150);
      
      setTimeout(() => {
      // Update the value state with the current content of the editor
      const updatedContent = editor.root.innerHTML;
      setValue(updatedContent); // This will update the content in your component's state
      //setEditorContent(updatedContent); // If you want to lift the state up to the parent component
    }, 200); // Adjust timeout if needed
    }
  };
  
  
  
   
 useEffect(() => {
    if (isFocused && quillRef.current) {
      quillRef.current.focus(); // Refocus the editor if it was focused before re-render
    }
  }, [isFocused]); // Depend on the focus state


    
    
  // Create a stable imageHandler using useMemo, which will not change unless quillRef changes
  const openImageModal = () => {
    console.log("Opening modal");

      quillRef.current.blur(); // Refocus the editor if it was focused before re-render

    setIsModalImageOpen(true);
  };

  const closeImageModal = () => {
    console.log("Closing modal");
    setIsModalImageOpen(false);
       setTimeout(() => quillRef.current.focus(), 0); 
  };

  const imageHandler = useCallback(() => {

    openImageModal();
  }, []);
/*
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    console.log("inpussst", input)
    //use this react: <FileUploadAndGallery onImageSelect={onHandleImage} displayConfig={{CanBeSelected:true}}/>

    input.onchange = async () => {
      const file = input.files[0];
      // TODO: Upload `file` to your server and get back the image URL

      const editor = quillRef.current.getEditor(); // Access the Quill editor instance
      const range = editor.getSelection(true); // Get the current selection range

      if (range) {
        // TODO: Upload the file to your server and get the image URL
        // For now, we will just use a placeholder for demonstration
        const link = '/aaaa.webp'; // Replace this with the actual image URL

        // Insert the image into the editor
        editor.insertEmbed(range.index, 'image', link);
      }
    };
  }, []);
  */



  // Assign the image handler to the toolbar module
const modules =  useMemo(() =>({
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
        'image': imageHandler
      }
  },
}), [imageHandler]);

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];





  useEffect(() => {
    //setValue(editorContent);
  }, [editorContent]);

  const handleQuillChange = async (content, delta, source, editor) => {
    if (source === 'user') {
      setValue(content); // Update the content in the parent component's state
              let metaObjects = await createMetaObjects(document.querySelector(".ql-editor"));
        console.log("metaaaaa:", metaObjects);
        setResourceMeta(metaObjects);
        setMetaInfo(metaObjects);
    }
    };
    

   const handleSave = async (content, delta, source, editor) => {
    console.log(value);
    // Perform your save logic here


    try {
        let metaObjects = await createMetaObjects(document.querySelector(".ql-editor"));
        console.log("metaaaaa:", metaObjects);
        setResourceMeta(metaObjects);
        setMetaInfo(metaObjects);
        setEditorContent(value);
    } catch (error) {
        console.error("Error in createMetaObjects: ", error);
    }
};

  const handleSetShowPage =  (bool) => {
    
    
  setShowPage(bool);
    
     
    
   }
  

return (
  <>
    
    <>
      
      <div style={{ display: "none" }}>
        <button onClick={() =>handleSetShowPage(false) } >Show Editor</button> 
      <div className='resource-canvas'>
          <ElementBuilder jsonData={resourceMeta} />
          </div>
           
      </div>
    
      
      </>
    
       <div  style={{ display: (showPage ? "none":"block" )}}>
         <button  style={{display: 'none'}}  onClick={() => handleSetShowPage(true)} onMouseEnter={handleSave}>Show page</button> 
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleQuillChange}
          modules={modules}
          formats={formats}
        onBlur={handleSave}
        
        />
        <Modal isOpen={isModalImageOpen} onClose={closeImageModal}>
        <FileUploadAndGallery onImageSelect={onHandleImage} displayConfig={{CanBeSelected: true}} />
      </Modal>
        
    </div> 
      

      
    </>
  );
}

export default QuillComponent;
