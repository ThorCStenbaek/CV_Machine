import { useState, useEffect } from "react";

import getSurfaceChildrenFromList from "../../util/getSurfaceChildrenFromList";
import getAllChildren from "../../util/getAllChildren";
import getAllChildrenBetter from "../../util/fixChildrenProblem";
import BaseQuill from "../../../containers/components/quill/baseQuill";

export const InputElement = ({ position, resourceMeta, changeElement, updateResourceMeta }) => {
  
    const [element, setElement] = useState(resourceMeta[position]);

    const [editorContent, setEditorContent] = useState("");
    const [elementID, setElementID] = useState(position);

  


    useEffect(() => {
        setElement(resourceMeta[position]);
        
        console.log("ELEMENT CHOSEN:", resourceMeta[position])
        }, [position, resourceMeta]);

    useEffect(() => {
    
       if (element.instruction!="CONTAINER"){
        let textRetriever = (position >= resourceMeta.length - 1) ? document.querySelector(`.position${position - 1}`).outerHTML : document.querySelector(`.position${position}`).outerHTML;
        setTimeout(() => {
            
        
            const safeTextRetriever = textRetriever ? textRetriever : ""
            console.log("ELEMENTID", safeTextRetriever)
        setEditorContent(safeTextRetriever);
        console.log("EDITOR CONTENT:", editorContent, safeTextRetriever)

            }, 100);
        }
    },[elementID, position])
    





    if (element.instruction === 'CONTAINER' || element.instruction ==='DEFAULT')
        return null




        //let lastChild = findLastDescendantIndex(indexedDB, resourceMeta)
        //let children =resourceMeta.slice(position+1, lastChild+1)
        //let children = children.map((child) => (resourceMeta[child]))

        const onQuillChange = (meta) => {
    

            // Update the current element
            const updatedElement = { ...element, number_of_children: getSurfaceChildrenFromList(meta).length };
            setElement(updatedElement);
 
            // Update the resourceMeta array
            let updatedResourceMeta = [...resourceMeta];
            updatedResourceMeta[position] = updatedElement;

            // Calculate number of children to delete
            const deleteCount = getAllChildren(position, resourceMeta).length;

            // Remove the previous children

            updatedResourceMeta.splice(position + 1, deleteCount);
     
            // Insert the new meta elements
            updatedResourceMeta.splice(position + 1, 0, ...meta.map(e=>{return({...e, depth:updatedElement.depth+1})})); // Insert without deleting any elements

            

            
            //Stupid fix.
            let prev= null
            for (let i = updatedResourceMeta.length; i > 0; i--) {

                if (prev!=null){
                if (updatedResourceMeta[i].html_element=='br' && prev.html_element=='br'){
                    updatedResourceMeta.splice(i, 1)
                }}
                prev = updatedResourceMeta[i]

            }
            let allChilds= getAllChildrenBetter(updatedResourceMeta, position)
        
            let number=0            
            for (let i = allChilds[allChilds.length-1]+1; i < updatedResourceMeta.length; i++) {
                if (updatedResourceMeta[i].instruction != "ELEMENT") {
                    number = i
                    break
                }
            }
            updatedResourceMeta.splice(allChilds[allChilds.length-1]+1, number-allChilds[allChilds.length-1]-1) 


            
            // Update the resourceMeta state
            updateResourceMeta(updatedResourceMeta, "input element quill");

        }


        console.log("BASEQUILL OUTER", editorContent)
                //here
        return (
  
                <BaseQuill editorContent={editorContent} setEditorContent={setEditorContent} setMetaInfo={onQuillChange}  />
           
        );
    }