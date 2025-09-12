import { useState, useEffect } from "react";

import getSurfaceChildrenFromList from "../../util/getSurfaceChildrenFromList";
import getAllChildren from "../../util/getAllChildren";
import getAllChildrenBetter from "../../util/fixChildrenProblem";
import BaseQuill from "../../../containers/components/quill/baseQuill";
import { useContentElement } from "../useContentElement";


export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta, isStyle }) => {
  


    const [editorContent, setEditorContent] = useState("");

    const [elementID, setElementID] = useState(position);

const contentConfig = {
    defaultData: { 
      text:""
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
        
      
        }, [position, resourceMeta]);

    useEffect(() => {
    
       if (element.instruction!="CONTAINER"){

      
        let textRetriever = (position >= resourceMeta.length) ? document.querySelector(`.position${position - 1}`).outerHTML : document.querySelector(`.position${position}`).outerHTML;
        setTimeout(() => {
            
        
            const safeTextRetriever = textRetriever ? textRetriever : ""
        
        setEditorContent(safeTextRetriever);
   
            }, 100);
        }
    },[elementID, position])
    





    if (element.instruction === 'CONTAINER' || element.instruction ==='DEFAULT')
        return null




        //let lastChild = findLastDescendantIndex(indexedDB, resourceMeta)
        //let children =resourceMeta.slice(position+1, lastChild+1)
        //let children = children.map((child) => (resourceMeta[child]))

        const onQuillChange = (content) => {
    
            //setEditorContent(content)
            handleFieldChange("text", content)


        }


        console.log("BASEQUILL OUTER", editorContent)
                //here

                if (!isStyle)
        return (
  
                <BaseQuill
                selector={`.position${position} .baseText`}
                editorContent={editorContent}
                
                setEditorContent={setEditorContent} setMetaInfo={onQuillChange}  />
           
        );
        if (isStyle)
            return null
    }