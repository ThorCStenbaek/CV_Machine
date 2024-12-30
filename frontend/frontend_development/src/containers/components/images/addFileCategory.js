import React, { useState } from 'react';

function AddFileCategory({ onUpload }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('image'); // Assuming 'image' is a default type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage(''); // Clear any previous success message

    try {
      const response = await fetch('api/files/insert_category', {
        method: 'POST',
        credentials: 'include', // for sending cookies with the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCategory = await response.json();
      onUpload(newCategory); // Calling the provided function with the new category data
      setName(''); // Clear the input field
      setSuccessMessage('Category added successfully!'); // Set success message
    } catch (error) {
      console.error('Failed to add category:', error);
      setError('Failed to add category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
              <label style={{margin: '0px', fontSize: '12px'}} htmlFor="name">Add new category</label>
              <div>
        <input
          className='small-input-field'
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          required
        />
        <button className='small-button' type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : '+'}
                  </button>
                  </div>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </form>
  );
}

export default AddFileCategory;
