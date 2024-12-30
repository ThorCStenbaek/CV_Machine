import React, { useState, useEffect, useRef } from 'react';
import SelectedAvailableBoxes from './components/general/SelectedAvailableBoxes';
const UsersToParents = () => {
  const [usersNotParents, setUsersNotParents] = useState([]);
    const [usersParents, setUsersParents] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [allowedParents, setAllowedParents] = useState([]);
    const [map, setMap] = useState(null);
    
   const boxRef = useRef();
  const fetchUsers = async (roleName, exclude) => {
    try {
      const response = await fetch(`/api/get-users?roleName=${roleName}&exclude=${exclude}`, {
        method: 'GET',
        credentials: 'include', // For handling cookies if your API requires authentication
        headers: {
          // Include any necessary headers, such as Authorization, if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Use the appropriate state setter based on the 'exclude' parameter
      if (exclude) {
  setUsersNotParents(data.users);
} else {
  setUsersParents(data.users);
  // Correctly create the map with user IDs as keys and usernames (or another string property) as values
  const newMap = new Map(data.users.map(user => [user.id, user.username])); // Assuming 'username' is the property you want to display
  setMap(newMap);
}

        console.log("users", data.users)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    };
    
    
  const fetchAllowedParents = async (ID) => {
  try {
    const response = await fetch(`/api/get-parent-users`, {
      method: 'POST', // Changed from GET to POST
      credentials: 'include', // For handling cookies if your API requires authentication
      headers: {
        'Content-Type': 'application/json', // Added Content-Type header for JSON
      },
      body: JSON.stringify({ sosuUserId: ID }), // Body moved here from GET request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setAllowedParents(data); // Assuming setAllowedParents is a useState setter function defined elsewhere
    console.log("allowedParents", data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};





  useEffect(() => {
    fetchUsers('PARENT', true); // Fetch users that are not parents and update state
    fetchUsers('PARENT', false); // Fetch users that are parents and update state
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleUserSelect = (userId) => {
    // Toggle selection
    setSelectedUser(selectedUser === userId ? null : userId);
  };
    
    useEffect(() => {
    if (selectedUser) {
      fetchAllowedParents(selectedUser);
        }
    }, [selectedUser]);


const updateAllowedParents = async () => {
    if (!selectedUser || !boxRef.current) {
      console.log('No user selected or boxRef is not available.');
      return;
    }

    const selectedIds = boxRef.current.getSelectedIds(); // Assuming this method exists and works as expected

    try {
      const response = await fetch('/api/update-parent-users', {
        method: 'POST',
        credentials: 'include', // For handling cookies if your API requires authentication
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary headers, such as Authorization, if needed
        },
        body: JSON.stringify({
          sosuUserId: selectedUser,
          parentsID: selectedIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Update successful:', data.message);
      //alert user 
      alert (data.message)
      // Handle successful update here (e.g., show a message to the user)
    } catch (error) {
      console.error("Error updating allowed parents:", error);
      // Handle error here (e.g., show an error message to the user)
    }
  };
  console.log("MAP", map)

    
    return (
    <div>
      <h2>Users</h2>
      <div style={{ maxHeight: '200px', overflowY: 'scroll', maxWidth: '300px' }}>
        <ul>
          {usersNotParents.map(user => (
            <li key={user.id} 
                onClick={() => handleUserSelect(user.id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedUser === user.id ? 'blue' : 'transparent',
                  color: selectedUser === user.id ? 'white' : 'black'
                }}>
              {user.username}
            </li>
          ))}
        </ul>
            </div>
            {
            map && selectedUser && allowedParents &&   
    
            <SelectedAvailableBoxes ref={boxRef} selected={allowedParents.map(user => user.ID)}
                        available={usersParents.filter(user => !allowedParents.some(Ruser => user.id == Ruser.ID)).map(user => user.id)}
            nameMap={map} 
            selectedName="Parents assigned to sosu" 
            availableName="Parents not assigned to sosu" 
                />
            }
            <button onClick={updateAllowedParents}>Update parents</button>
    </div>
  );
};


export default UsersToParents;
