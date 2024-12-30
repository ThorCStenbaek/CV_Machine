import React, { useState, useEffect, useContext } from 'react';


import ElementBuilder from '../elementBuilder';

const JustTheResource = ({ resource }) => {
    const [resourceMeta, setResourceMeta] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);








    useEffect(() => {
        const fetchResourceDetails = async () => {
            try {
                console.log("THIS RESOURCE ", resource);
                const response = await fetch(`/api/resource-meta?resourceId=${resource.id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data)
                setResourceMeta(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching resource details:", error);
                setLoading(false);
            }
        };

        fetchResourceDetails();
    }, [resource.id]);

 

    const handleGenerateScreenshot = () => {
    // Use 'fetch' to call your backend endpoint for generating a screenshot
    const apiUrl = `/api/generate-screenshot?url=${encodeURIComponent(window.location.href)}`;

    fetch(apiUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create a new object URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `screenshot-${Date.now()}.png`); // Set the file name for the download
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the object URL and removing the link element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error generating screenshot:', error);
        alert('Failed to generate screenshot. Please try again later.');
      });
};





    return (
        <>

                <div style={{position: 'relative'}}>
            <div style={{display: 'flex', flexDirection: 'column'}} onClick={handleGenerateScreenshot}>
                
                
                  
                    { <ElementBuilder jsonData={resourceMeta}/>
                     }
                      
                        
                  
                    </div>
            </div>
            </> )
  
};

export default JustTheResource;
