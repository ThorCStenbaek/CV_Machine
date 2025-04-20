import React from "react";

export const RenderElement = ({style, className, onClick, onMouseOver, onMouseOut, editing, data, children, extraElement}) => {
    let { html_element, path, content_data, specific_style, class_name, number_of_children, instruction } = data;

    const elementProps = {
        style: style,
        className: className,
        onClick,
        onMouseOver,
        onMouseOut
    };

    // Create a new element with content_data.text as innerHTML
    const createContentElement = () => {
        if (!content_data?.text) return null;
        
        // You can change 'p' to whatever HTML element you prefer
        const Element = html_element || 'p';
        
        // Use dangerouslySetInnerHTML to set the HTML content
        return React.createElement(Element, {
            ...elementProps,
            dangerouslySetInnerHTML: { __html: content_data.text }
        });
    };

    return (
        <div className="baseText">
            {createContentElement()}
            {children}
            {extraElement}
        </div>
    );
};