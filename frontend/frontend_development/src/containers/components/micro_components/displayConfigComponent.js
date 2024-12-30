import React, { useState, useEffect } from 'react';

const DisplayConfigComponent = ({ onClick, postType }) => {
  const [config, setConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);

 const displayNamesSet1 = {
   'title': 'Show Title',
    'categoryName': 'Show Category',
    'description': 'Show Description',
    'author': 'Show Author',
    'date': 'Show Date',
    'userRating': 'Show User Rating',
    'comments': 'Show Comments',
    'status': 'Show Status',
   'savedByUser': 'Show if Saved by User',
   //Inside the post
   'zoomButtons': 'Show Zoom Buttons',
   'doNotShowDescription': 'Do not show Description',
   'allowPDF': 'Allow download as PDF',
   'isCopyable': 'Allow Copying of Resource',
   'noCommentTree': 'Do not allow reply to comments directly',
    'allowShareWithParents': 'Allow sharing with Parents',
  
    // ... other keys for the first set
  };

  const displayNamesSet2 = {
    'showInHeader': 'Show in Header',
    'allowCategoryCards': 'Allow Category Cards',
    'allowShowAllRecent': 'Show All Recent posts',
      'classicForum': 'Show posts like classic Forum'
    // ... other keys for the second set
  };

useEffect(() => {
  // Initialize config with all keys set to false
  const initialConfig = [...Object.keys(displayNamesSet1), ...Object.keys(displayNamesSet2)]
    .reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

  setConfig(initialConfig);
  onClick(initialConfig);
}, []);


useEffect(() => {
  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/post-display-config/${postType}`);
      if (response.ok) {
        const data = await response.json();
        // Merge server config with initial config
        setConfig(prevConfig => ({ ...prevConfig, ...data.data }));
        onClick(prevConfig => ({ ...prevConfig, ...data.data }));
      } else {
        console.error('Failed to fetch configuration');
      }
    } catch (error) {
      console.error('Error fetching configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (postType) {
    fetchConfig();
  } else {
    setIsLoading(false);
  }
}, [postType]);


  const handleCheckboxChange = (key) => {
    const updatedConfig = { ...config, [key]: !config[key] };
    setConfig(updatedConfig);
    if (onClick) onClick(updatedConfig);
  };

  const renderCheckboxes = (displayNames) => (
    Object.entries(displayNames).map(([key, displayName]) => (
      <label key={key}>
        {displayName}
        <input
          type="checkbox"
          checked={!!config[key]}
          onChange={() => handleCheckboxChange(key)}
        />
      </label>
    ))
  );

  return (
    <div className="display-config-layout">
      <div className="column">
        {isLoading ? <p>Loading...</p> : renderCheckboxes(displayNamesSet1)}
      </div>
      <div className="column">
        {isLoading ? <p>Loading...</p> : renderCheckboxes(displayNamesSet2)}
      </div>
    </div>
  );
};

export default DisplayConfigComponent;
