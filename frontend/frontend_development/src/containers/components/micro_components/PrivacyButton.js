import React, { useState } from 'react';

const PrivacyButton = ({ resource, onSubmit }) => {
  // Assume isPrivate useState is declared at a higher level and passed as a prop
  // For demonstration, it's declared here
  const [isPrivate, setIsPrivate] = useState(resource.isPrivate);

  const togglePrivacyAndUpdateResource = async () => {
    // Toggle privacy state
    const newPrivacyState = isPrivate === 0 ? 1 : 0;
    setIsPrivate(newPrivacyState);

    // Prepare the data to send, including toggled isPrivate value
    const dataToSend = {
      resource_id: resource.id,
      category_id: resource.category_id,
      title: resource.title,
      description: resource.description,
      post_type: resource.post_type,
      status: resource.status,
      isPrivate: newPrivacyState, // Use the updated privacy state
      editor_used: resource.editor_used,
      // Assuming metaInfo and other required fields are handled correctly
      // Example, replace with actual metaInfo data
    };

    try {
      const response = await fetch('/api/update-resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();
        if (response.ok) {
          onSubmit(newPrivacyState)
        console.log('Resource updated successfully:', responseData);
        // Additional success handling
      } else {
        throw new Error(`Failed to update resource: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  return (
    <button onClick={togglePrivacyAndUpdateResource}>
      {isPrivate === 0 ? 'Make Private' : 'Make Public'}
    </button>
  );
};

export default PrivacyButton;
