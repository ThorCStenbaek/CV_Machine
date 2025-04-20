import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import createMetaObjects from '../../../util/metaObjects';
import ElementBuilder from '../elementBuilder';
import Modal from '../general/modal';
import FileUploadAndGallery from '../images/fileUploadAndGallery';
import { set } from 'date-fns';

// Define your modules and formats outside of the component to prevent re-creation on each render



const BaseQuill = ({ editorContent, setEditorContent, metaInfo, setMetaInfo, selector }) => {
  const [value, setValue] = useState(editorContent);
  const quillRef = useRef(null);
  const [resourceMeta, setResourceMeta] = useState(metaInfo) 
  const [isFocused, setIsFocused] = useState(false);
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
 const [showPage, setShowPage] = useState(false);
        const updateTimeoutRef = useRef(null);



  /*
 useEffect(() => {
    if (isFocused && quillRef.current) {
      quillRef.current.focus(); // Refocus the editor if it was focused before re-render
    }
  }, [isFocused]); // Depend on the focus state
*/



  // Assign the image handler to the toolbar module
const modules =  useMemo(() =>({
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean'],
      [{ 'align': [] }],
    ],

  },
}), []);

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'align'
];




  //runs infinitely
  
  useEffect(() => {
    if (editorContent !== value) {
      
      
      setValue(editorContent);
      
}
  }, [editorContent]);

  const handleQuillChange = (content, delta, source, editor) => {
    console.log("CONTENT TIME:  ", content)
    if (source === 'user') {
      setValue(content); // Update the content in the parent component's state
  
    
      if(selector){
        const element=document.querySelector(selector)
        if (element) element.innerHTML=content
      }

      deferUpdate(content)
    }
    };


    const deferUpdate =  (content) => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
  
      updateTimeoutRef.current = setTimeout(() => {

      
          // Code to execute after the wait
          try {
            
          
          //let metaObjects = createMetaObjects(document.querySelector(".ql-editor"));
          setMetaInfo(content);
         
    } catch (error) {
            console.log("BROTHER", error)
          }
    
        
    
        
        updateTimeoutRef.current = null;
      }, 1500);
    };




    

   const handleSave = async (content, delta, source, editor) => {
    console.log("VAL", value);
    // Perform your save logic here


    try {
        let metaObjects = await createMetaObjects(document.querySelector(".ql-editor"));
        console.log("metaaaaa:", metaObjects);
        setResourceMeta(metaObjects);
        setMetaInfo(metaObjects);
        //setEditorContent(value);
    } catch (error) {
        console.error("Error in createMetaObjects: ", error);
    }
};


// First, ensure your element exists


return (
  
    

     
    
      

       
        
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleQuillChange}
          modules={modules}
          formats={formats}

    
        />
       
        
        

      
      
      
    
  );
}

export default BaseQuill;
