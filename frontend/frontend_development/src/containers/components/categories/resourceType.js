import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import ResourceItem from './resourceItem'; // assuming this is a simple component that renders the resource type

const ResourceTypesContainer = forwardRef((props, ref) => {
    const [resourceTypes, setResourceTypes] = useState([]);
    const selected = props.selected || []; // Access 'selected' from props

    const fetchResourceTypes = useCallback(() => {
        return fetch('/api/all-resource-types')
            .then(response => response.json())
            .then(responseData => {
                // Extract the array from the "data" property
                const data = responseData.data;

                // Enhance the data with chosen and pseudoChosen fields
                return data.map(resource => ({
                    ...resource,
                    chosen: selected.includes(resource.id), // Mark as chosen if in selected list
                    pseudoChosen: false
                }));
            });
    }, [selected]); // Add 'selected' as a dependency

    useEffect(() => {
        fetchResourceTypes()
            .then(enhancedData => {
                setResourceTypes(enhancedData);
            })
            .catch(error => console.error('Error fetching resource types:', error));
    }, [fetchResourceTypes]);

    const handleResourceClick = (resource) => {
        const updatedResources = resourceTypes.map(r => {
            if (r.id === resource.id) {
                return { ...r, chosen: !r.chosen };
            }
            return r;
        });
        setResourceTypes(updatedResources);
    };

    const getSelectedResourceIds = () => {
        return resourceTypes
            .filter(resource => resource.chosen)
            .map(resource => resource.id);
    };

    // Exposing the getSelectedResourceIds function to the parent
    useImperativeHandle(ref, () => ({
        getSelectedIds: getSelectedResourceIds
    }));

    

 return (
        <div className='flex'>
            <div className="available-resources">
             <h2>Available Resource Types</h2>
             <div className='innerDivCat'>
                {resourceTypes.filter(r => !r.chosen).map(resource => (
                    <ResourceItem key={resource.id} resource={resource} onResourceClick={handleResourceClick} />
                ))}
                 </div>
            </div>
            <div className="selected-resources">
             <h2>Selected Resource Types</h2>
             <div className='innerDivCat'>
                {resourceTypes.filter(r => r.chosen).map(resource => (
                    <ResourceItem key={resource.id} resource={resource} onResourceClick={handleResourceClick} />
                ))}
                 </div>
            </div>
        </div>
    );
});

export default ResourceTypesContainer;
