import React from 'react';

const ResourceItem = ({ resource, onResourceClick }) => {
    return (
        <div 
            className={`resource-item ${resource.chosen ? 'chosen' : ''}`}
            onClick={() => onResourceClick(resource)}
        >
            {resource.name}
        </div>
    );
};

export default ResourceItem;
