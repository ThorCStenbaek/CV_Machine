import React from "react";


export const RenderElement = ({style, className, onClick, onMouseOver, onMouseOut, editing, data, children, extraElement})=>{

    let { html_element, path, content_data, specific_style, class_name, number_of_children, instruction } = data;


    const elementProps = {
        style: style,
        className: className,
        onClick,
        onMouseOver,
        onMouseOut
    };

    const renderMixedContent = (content, children, number_of_children) => {
       
        if (!children ) {
            return content;
        }
        //This fixes it for now but I am scared
        if (!content || number_of_children==null){
            number_of_children=children.length;

        }

        const contentFragments = content.split("$child$");
        const mixedContent = contentFragments.reduce((acc, fragment, index) => {
            acc.push(fragment);
            if (index < children.length && index < number_of_children) {
                acc.push(children[index]);
            }
            return acc;
        }, []);

        // Append any remaining children, respecting the number_of_children limit
        const childrenToAdd = Math.min(number_of_children - (contentFragments.length ), children.length - (contentFragments.length ));
        if (childrenToAdd > 0) {
            mixedContent.push(...children.slice(contentFragments.length, contentFragments.length+ childrenToAdd));
            }

        if (extraElement !== null){
           // mixedContent.push(extraElement)
        }
        
        return mixedContent;
    };

        // For other elements, use the content_data as the children
        return React.createElement(html_element, elementProps, ...renderMixedContent(content_data, children, number_of_children));
}