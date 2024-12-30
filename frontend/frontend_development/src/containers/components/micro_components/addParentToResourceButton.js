 
import React, { useState, useEffect, useRef } from 'react';
import SelectedAvailableBoxes from '../general/SelectedAvailableBoxes';
import Modal from '../general/modal';



const AddParentToResourceButton = ({ sosuUserId, resourceId }) => {
  const [parentUsers, setParentUsers] = useState([]);
  const [resourceUsers, setResourceUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasChanged, setHasChanged] = useState(false); // This is a boolean that will be set to true when the user has made changes to the selected users
    const [map, setMap] = useState(new Map());
    
    useEffect(() => {
        setLoading(true);
      console.log("not calling sosu")
      if (sosuUserId) {
        console.log("calling sosu")
      fetch('/api/get-parent-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers/token as needed
        },
        body: JSON.stringify({ sosuUserId:sosuUserId }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch parent users');
        }
        return response.json();
      })
          .then(data => { console.log(data); setParentUsers(data); setMap(new Map(data.map(user => [user.ID, user.username])))})  
      .catch(err => setError(err.message));
    }

    if (resourceId) {
      const queryParams = new URLSearchParams({ resourceId }).toString();
      fetch(`/api/get-users-for-resource?${queryParams}`, {
        method: 'GET',
        headers: {
          // Add authentication headers/token as needed
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users for resource');
          }
          setLoading(false);
        return response.json();
      })
      .then(data => setResourceUsers(data.users)) // Assuming the API returns an object with a users array
      .catch(err => setError(err.message));
    }
  }, [sosuUserId, resourceId]); // Re-fetch when these IDs change

    useEffect(() => {
        console.log('isModalOpen', isModalOpen);
        console.log('parentUsers', parentUsers);
        console.log('resourceUsers', resourceUsers);
        console.log("reouceId", resourceId)
        console.log("sosu", sosuUserId)
    },[parentUsers, resourceUsers, isModalOpen, resourceId, sosuUserId])
    

      const boxRef = useRef();

  const handleConfirm = () => {
    setModalOpen(false);
    addResourceToUsers();
  }
  
    const addResourceToUsers = () => {
          const selectedIDs = boxRef.current.getSelectedIds();
    fetch('/api/add-resource-to-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as needed, such as Authorization if your API requires it
      },
      body: JSON.stringify({
        resourceId:resourceId,
        userIds: selectedIDs
      }),
    })
      .then(response => {
      setResourceUsers(parentUsers.filter(user => selectedIDs.includes(user.ID)));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert('Resource added to users successfully');
      return response.json();
    })
    .then(data => {
      console.log(data);
  
    })
    .catch(err => {
      console.error("Error adding resource to users:", err);
      setError('An error occurred while adding the resource to the users.');
    });
  };



    
    
    
    

    return (
        <>
        <button className='new-button' onClick={() => setModalOpen(true)}>
     
          <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.75 14V11.75H22V10.25H19.75V8H18.25V10.25H16V11.75H18.25V14H19.75Z" fill="black"/>
<path d="M11 4C8.79 4 7 5.79 7 8C7 10.21 8.79 12 11 12C13.21 12 15 10.21 15 8C15 5.79 13.21 4 11 4Z" fill="black"/>
<path d="M3 18C3 15.34 8.33 14 11 14C13.67 14 19 15.34 19 18V20H3V18Z" fill="black"/>
          </svg>
              <p style={{color: 'black', margin: '0px'}}>Share parents</p>

    
          </button>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            >
                {!loading && 
                    <SelectedAvailableBoxes
                       
                    ref={boxRef}
                    available={parentUsers.filter(user => !resourceUsers.some(Ruser => user.ID == Ruser.ID)).map(user => user.ID)}
                    selected={resourceUsers.map(user => user.ID)}    
                    nameMap={map}
                    selectedName={"Parents with resource"}
                    availableName={"Parents without resource"}
                    text={"Select or deselect parents to add to the resource"}
                    />
                    
                  
                    
                }
          <button onClick={handleConfirm}>Confirm Changes</button>
          <button style={{background: 'red'}} onClick={() => setModalOpen(false)}>Cancel</button>
            

        </Modal>
        </>
  );
};

export default AddParentToResourceButton;
