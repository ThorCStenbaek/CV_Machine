import React from "react";


export const RenderElement = ({style, className, onClick, onMouseOver, onMouseOut, editing, data, children, extraElement})=>{

    let { html_element, path, content_data, specific_style, class_name, number_of_children, instruction } = data;
   
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
        const fullPath = ensureFullPath(path);
        return (
        <div style={{position: "relative", height:"fit-content", width: "fit-content"}} onMouseOut={elementProps.onMouseOut} onClick={elementProps.onClick} onMouseOver={elementProps.onMouseOver}>
         
       { React.createElement(html_element, { style:elementProps.style,className:elementProps.className, src: fullPath, alt: content_data })}
       
        </div>
        )
    }

}