import React from 'react';
import PdfViewer from './pdfViewer';
const ElementComponent = ({editing, data, children, onClick, onMouseOver=()=>console.log("MouseOver"), onMouseOut=()=>console.log("MouseOut"), extraElement=null }) => {
    if (!data) {
        return null;
    }
    console.log("extraElement", extraElement)
    // Destructure data for easier access
    let { html_element, path, content_data, specific_style, class_name, number_of_children } = data;

    //use childen and mutate content_data 
    //Come back to this...
    //this does not work. Shows [object object]
        const renderMixedContent = (content, children, number_of_children) => {
        console.log("children", children)
        if (!children ) {
            return content;
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
            mixedContent.push(extraElement)
        }
        
        return mixedContent;
    };



    // Function to ensure the path includes the domain
    const ensureFullPath = (path) => {
  
        const domain = window.location.origin; // Automatically gets the current domain
        return  `${domain}/${path}`
    };

    // Determine the type of element to create
  const convertStyleStringToObject = (styleString) => {
        const styleObject = {};

        if (styleString) {
            const styleEntries = styleString.split(';');
            styleEntries.forEach(entry => {
                const [property, value] = entry.split(':');
                if (property && value) {
                    styleObject[property.trim()] = value.trim();
                }
            });
        }

        return styleObject;
    };

    // Prepare common properties for all elements
    const elementProps = {
        style: convertStyleStringToObject(specific_style),
        className: class_name,
        onClick,
        onMouseOver,
        onMouseOut
    };

    // Special handling for images
 if (html_element === 'img') {
        const fullPath = ensureFullPath(path);
        return React.createElement(html_element, { ...elementProps, src: fullPath, alt: content_data });
    }

    // Special handling for videos (YouTube or Vimeo)
    if (html_element === 'video') {
        // Assuming content_data contains the video URL
        const videoUrl = content_data;
        
        // Extract YouTube or Vimeo video ID
        let videoId = '';
        let thumbnailUrl = '';
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            videoId = videoUrl.split('v=')[1] || videoUrl.split('/').pop();
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        } else if (videoUrl.includes('vimeo.com')) {
            videoId = videoUrl.split('/').pop();
            // Vimeo thumbnails require an API call to get the thumbnail URL, so we'll use a placeholder here
            thumbnailUrl = `https://vumbnail.com/${videoId}.jpg`;
        }

        if (editing) {
            elementProps.style.height = "100%";
            elementProps.style.width = "100%";
            // Display thumbnail instead of video
            return (
                <img
                    {...elementProps}
                    src={thumbnailUrl}
                    alt="Video Thumbnail"
                />
            );
        }

        // Display the actual video if not editing
        const embedUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
            ? `https://www.youtube.com/embed/${videoId}`
            : `https://player.vimeo.com/video/${videoId}`;

        elementProps.style.height = "100%";
        elementProps.style.width = "100%";

        return (
            <iframe
                {...elementProps}
                src={embedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        );
    }

    if (html_element === 'pdf') {
        // Assuming content_data contains the PDF URL
        console.log("pdf",html_element, path, content_data, specific_style, class_name, number_of_children)
    return <PdfViewer file={`/${path}`} />
    }


        // For other elements, use the content_data as the children
        return React.createElement(html_element, elementProps, ...renderMixedContent(content_data, children, number_of_children));
        }

export default ElementComponent;

// Usage example:
// import ElementComponent from './ElementComponent'; // adjust the import path as needed
// const jsonData = { /* your JSON data */ };
// <ElementComponent data={jsonData} />
