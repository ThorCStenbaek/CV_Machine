import React, { useState, useEffect, useContext } from 'react';
import Modal from './general/modal';// Ensure this is the correct path to the Modal component
import UserList from './users/userList';
import UserSelector from './users/UserSelector';

import isAdminOrCreator from '../../util/isAdminOrCreator';

import CurrentUserContext from '../../util/CurrentUserContext';

const StatusDisplay = ({ status, isPrivate, permissions, resourceID, resource }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const[permissionUsers, setPermissionUsers] = useState(permissions.permissionUsers);
    const[permissionGroups, setPermissionGroups] = useState(permissions.permissionGroups);
    const [changed, setChanged] = useState(0);


    const userContext= useContext(CurrentUserContext)

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("/api/all-users-and-groups-details", {
                    method: 'GET',
                    credentials: 'include', // to ensure cookies are sent
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log("us?",data)
                setAllUsers(data.users);

            } catch (error) {
                console.error('Error:', error);

            }
        })();
    }, []);


    const handleRemoval = async (userId) => {
        console.log(userId, resourceID )
        try {
            const response = await fetch("/api/remove-resource-permission", {
                method: 'DELETE',
                credentials: 'include', // to ensure cookies are sent
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resourceID, userID: userId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            else {
                setChanged(changed + 1)
                setPermissionUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                console.log(permissionUsers)
                //here
            }

            const result = await response.json();
            console.log("Removal result:", result);
            alert(result.message);
        } catch (error) {
            console.error('Error:', error);
            alert('Error removing user from resource permission.');
        }
    };


    const handleInsertion = async (userId, groupId = null, accessLevel = "") => {
         console.log(userId, resourceID )
    try {
        const response = await fetch("/api/insert-resource-permission", {
            method: 'POST',
            credentials: 'include', // to ensure cookies are sent
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resourceID, userId, groupId, accessLevel })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        else {

        const userToAdd = allUsers.find(user => user.userId === userId);
            console.log("useToAdd", userToAdd)
            console.log("allUsers",allUsers)
        // If the user is found, add it to permissionUsers
            if (userToAdd) {
            setChanged(changed + 1)
                setPermissionUsers(prevUsers => [...prevUsers, userToAdd]);
                console.log(permissionUsers)
            //here
        } else {
            console.log('User not found');
    }
        }

        const result = await response.json();
        console.log("Insertion result:", result);
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
        alert('Error inserting resource permission.');
    }
};





    const handleDivClick = () => {
        setModalOpen(true);
    };

    useEffect(() => { 

    },[permissionUsers])

    const AdminOrCreator= isAdminOrCreator(userContext, resource)

    return (
        <div>
            <div onClick={handleDivClick}>
                <p>{status}</p>
                {isPrivate === 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">
                        <path d="M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 22 11 L 22 9 C 22 5.2715823 19.036581 2.2685653 15.355469 2.0722656 A 1.0001 1.0001 0 0 0 15 2 z M 15 4 C 17.773666 4 20 6.2263339 20 9 L 20 11 L 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 z"/>
                    </svg>
                )}
            </div>
            <Modal key={changed } isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div>
                    <h3>Permissions</h3>
                    {(isAdminOrCreator(userContext, resource) )?
                        <UserSelector allUsers={allUsers} onHandle={handleInsertion} /> : null}
                    
                    <UserList users={permissionUsers} groups={permissionGroups} Allusers={allUsers.users}  displayConfig={{ 
                        username: true, 
                        firstname: true, 
                        lastname: true, 
                                        userRole: false,
                                        showActionButton: AdminOrCreator,
                                        actionButtonLabel: 'Remove from permissions',
                        modalContent: (user, actionInput, setActionInput) => (
                            <>
                                <p>Are you sure you want to delete {user.firstname} {user.lastname} ({user.username}) from?</p>

                            
                            
                                    
                                
                            </>
                        ),
                                        actionConfirmButtonLabel: 'Confirm removal',
                        requireConfirmation: false,
                            }}
                            onAction={(user, input, closeModal) => {
                    
                        handleRemoval(user.id);

                            console.log("Removing user:", user.id);
                            closeModal();
                        
                        }} />
                    

                </div>
            </Modal>
        </div>
    );
};

export default StatusDisplay;
