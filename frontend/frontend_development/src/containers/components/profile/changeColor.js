import React, { useState, useEffect, useRef } from 'react';
import NameInitialsAvatar from '../micro_components/NameInitialsAvatar';

const UpdateUserColorForm = ({ initialColor, userID }) => {
  const [newColor, setNewColor] = useState(initialColor); // Initialize with the initial color
    const [message, setMessage] = useState('');
    const colorInputRef = useRef();
    console.log("initial color: ", initialColor)
  useEffect(() => {
    setNewColor(initialColor); // Update the color when the initialColor prop changes
  }, [initialColor]);

  const handleColorChange = (e) => {
    const selectedColor = e.target.value;
    setNewColor(selectedColor); // Only update the state, don't submit
    };
    

    const handleColorPickerClick = () => {
    colorInputRef.current.click(); // Trigger the color input click
  };

  const saveColor = async () => {
    // Construct the request options
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID, // Use the userID passed as a prop
        newColor,
      }),
    };

    try {
      // Adjust the API URL as necessary
      const response = await fetch('/api/update-user-color', requestOptions);
      const data = await response.json();

      if (data.success) {
        setMessage('User color updated successfully!');
        // Optionally, update the state to reflect the new color here if needed
      } else {
        setMessage('Failed to update user color.');
      }
    } catch (error) {
      console.error('Error updating user color:', error);
      setMessage('An error occurred while updating the user color.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <label htmlFor="colorInput" style={{ display: 'inline-block', margin:'0px',marginRight: '10px' }}>
          Choose a new color:
              </label>
              <div           style={{
            cursor: 'pointer',
            width: '30px',
            height: '30px',
            border: `2px solid ${newColor}`, // Border color is the same as the input color
            borderRadius: '50%',
            padding: '0', // Remove padding to ensure color fills the entire input
            WebkitAppearance: 'none', // Remove default styling
                  appearance: 'none',
            backgroundColor: newColor, // Fill the input with the selected color
              }}
              
              onClick={handleColorPickerClick}
              >
        <input
          type="color"
          id="colorInput"
          value={newColor}
          onChange={handleColorChange}
                      style={{ display: 'none' }}
                      ref={colorInputRef}
                      
                  />
                  </div>
      </div>
      <button onClick={saveColor} style={{ cursor: 'pointer' }}>Save Color</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateUserColorForm;
