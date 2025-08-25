import React from "react";


export const RenderElement = ({style, className, onClick, onMouseOver, onMouseOut, editing, data, children, extraElement})=>{

    let { html_element, content_data, specific_style, class_name, number_of_children, instruction } = data;
   
    //content_data = JSON.parse(content_data);


    const ensureFullPath = (path) => {
  
        const domain = window.location.origin; // Automatically gets the current domain
        return  `${domain}/${path}`
    };


    const elementProps = {
        style: style,
        className: className,
        onClick,
        onMouseOver,
        onMouseOut
    };

 if (html_element === 'img') {
        const fullPath = ensureFullPath(content_data.path);
        console.log("FULL PATH:", fullPath)
        return (
 
      React.createElement(html_element, { style:elementProps.style,className:elementProps.className, src: fullPath, alt: content_data })
       
 
        )
    }

}