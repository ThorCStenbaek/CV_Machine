import React, {useState, useEffect} from "react";  
import TextIcon from "./icons/textIcon";
import ImageIcon from "./icons/imageIcon";

import VideoIcon from "./icons/videoIcon";

      const PMeta= {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: null,
        ordering: 0, // Default value, change as needed
        html_element: 'p' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: 'height: auto;', // Provide a value based on your application's logic
        content_type: '' , // Provide a value based on your application's logic
        content_data: '', // Provide a value based on your application's logic
        instruction: 'ELEMENT' // Provide a value based on your application's logic
};
    
      const ImageMeta= {
        ID: null, // This will be auto-incremented by the database
        resource_id: null, // You might need to provide this value based on your application's logic
        fileID: null,
        ordering: 0, // Default value, change as needed
        html_element: 'img' , // Provide a value based on your application's logic
        number_of_children: 0,
        specific_style: 'height: auto;', // Provide a value based on your application's logic
        content_type: '' , // Provide a value based on your application's logic
        content_data: '', // Provide a value based on your application's logic
        instruction: 'ELEMENT' // Provide a value based on your application's logic
    };


    const VideoMeta = {
    ID: null, // This will be auto-incremented by the database
    resource_id: null, // You might need to provide this value based on your application's logic
    fileID: null,
    ordering: 0, // Default value, change as needed
    html_element: 'video', // Using 'iframe' for embedded video
    number_of_children: 0,
    specific_style: 'height: auto;', // Provide a value based on your application's logic
    content_type: '', // Provide a value based on your application's logic
    content_data: '', // Provide a value based on your application's logic, usually the video URL
    instruction: 'ELEMENT' // Provide a value based on your application's logic
};



const ElementInnerChild = ({ position, resourceMeta, updateResourceMeta }) => {

    const [element, setElement] = useState(resourceMeta[position]);

 
    useEffect(() => {
        setElement(resourceMeta[position]);
    }, [resourceMeta, position]);

    useEffect(() => { }, [element]);

    const baseStyle = {
        display: 'flex',
        width: '50px',
        border: '1px solid rgb(0, 0, 0)',
        cursor: 'pointer',
        padding: '10px',
        boxSizing: 'border-box',
        margin: '10px',
        flexDirection: 'column',
        justifyContent: 'center',
        fill: 'grey'
    };

    const chosenStyle = {
        ...baseStyle,
        border: 'solid #3a70ff 1px',
        fill: '#3a70ff'// Add this style for the chosen element
    };


       if (!element) {
        return null;
    
    }


    if (element.instruction === "CONTAINER" || element.instruction === "DEFAULT") {
        return null
    }

    const handleClick = (instruction) => {
        //just a guard rail.
        if (element.instruction === instruction || element.instruction === "CONTAINER" || element.instruction === "DEFAULT") {
            return;
        }
        console.log("HANDLECLICK", instruction, element, position, resourceMeta)
        const number_of_children = element.number_of_children;
        let updatedResourceMeta = [...resourceMeta];
        updatedResourceMeta[position].number_of_children = 0;
        updatedResourceMeta[position].instruction = instruction;
        updatedResourceMeta.splice(position + 1, number_of_children)
        const getNewElements = () => {
        switch (instruction) {
            case "TEXT":
                return [PMeta];
            case "IMAGE":
                return [ImageMeta];
            case "TEXTIMAGE":
                return [PMeta, ImageMeta];
            case "IMAGETEXT":
                return [ImageMeta, PMeta];
            case "VIDEO":
                return [VideoMeta];
            default:
                return null;
        } 
        };
        const newElements = getNewElements();
        updatedResourceMeta[position].number_of_children = newElements.length;
        updatedResourceMeta.splice(position + 1, 0, ...newElements);
        updateResourceMeta(updatedResourceMeta);
        setElement(updatedResourceMeta[position]);
};



     console.log("elementEEE", element)
   return (
        <div style={{display: 'flex'}}>
            <div style={element.instruction === 'TEXT' ? chosenStyle : baseStyle} onClick={() => handleClick("TEXT")}>
                <TextIcon />
            </div>
            <div style={element.instruction === 'IMAGE' ? chosenStyle : baseStyle} onClick={() => handleClick("IMAGE")}>
                <ImageIcon />
           </div>

                       <div style={element.instruction === 'VIDEO' ? chosenStyle : baseStyle} onClick={() => handleClick("VIDEO")}>
                <VideoIcon />
           </div>
           {/*
            <div style={element.instruction === 'TEXTIMAGE' ? chosenStyle : baseStyle} onClick={() => handleClick("TEXTIMAGE")}>
                <TextIcon />
                <ImageIcon />
            </div>
            <div style={element.instruction === 'IMAGETEXT' ? chosenStyle : baseStyle} onClick={() => handleClick("IMAGETEXT")}>
                <ImageIcon />
                <TextIcon />
            </div>
            */}
        </div>
    );

}
 
export default ElementInnerChild;