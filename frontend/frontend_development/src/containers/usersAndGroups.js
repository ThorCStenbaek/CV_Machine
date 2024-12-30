import React, {useState } from 'react';
import useFetch from './../util/useFetch';
import UserList from './components/users/userList';
import AddUserForm from './components/users/createUser';
import Modal from './components/general/modal';
const UsersAndGroupsContainer = () => {
    const { data, loading, error } = useFetch('/api/all-users-and-groups-details');
    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = (user=null) => {
        setModalOpen(false);

        if (user){
            let string= "User: "+user+ " created!"
            window.alert(string)
        }
    };



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>No data available.</p>;

    return (
        <>
            <div>
            <button onClick={handleOpenModal}>Create New User</button> {/* Button to open the modal */}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <AddUserForm  onhandleSubmit={handleCloseModal}/>
            </Modal>
            <UserList users={data.users} Allusers={data.users} groups={data.groups} displayConfig={{ 
        username: true, 
        email: true, 
        firstname: true, 
        lastname: true, 
        userGroups: true, 
                userRole: true,
                requireConfirmation: true,
                showActionButton: true
                ,
         actionButtonLabel: 'Delete User',
        modalContent: (user, actionInput, setActionInput) => (
            <>
                <p>Are you sure you want to delete {user.firstname} {user.lastname} ({user.username})?</p>
                <p>Please type their username to confirm:</p>
                <input 
                    type="text" 
                    value={actionInput}
                    onChange={(e) => setActionInput(e.target.value)}
                />
            </>
        ),
        actionConfirmButtonLabel: 'Confirm Deletion'
            }}
            onAction={(user, input, closeModal) => {
        if (input === user.username) {
            // Perform deletion
            console.log("Deleting user:", user.username);
            closeModal();
        } else {
            alert('Username does not match. Please try again.');
        }
    }}
            
            />
                {/* You can also render group details similarly */}
                </div>
        </>
    );
}

export default UsersAndGroupsContainer;
