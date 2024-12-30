import React, { useState } from 'react';
import UserRow from './userRow';
import Modal from '../general/modal';
import GroupDetails from './groupDetails';
import UserAdderToGroup from './addUserToGroup';
import useFetch from '../../../util/useFetch';
const UserList = ({ users, Allusers, groups, displayConfig, onAction }) => {

        //const { data, loading, error } = useFetch('/api/all-users-and-groups-details');    
  console.log(users)

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)

    const [userUsers, setUserUsers] = useState(users)
    
    console.log("UL", groups, Allusers)

    if (!users || users.length === 0) {
        return <p>No users available.</p>;
    }

    return (
        <>
            <div>
                <h3>Users:</h3>
                <table>
                    <thead>
                        <tr>
                            {displayConfig.username && <th>Username</th>}
                            {displayConfig.email && <th>Email</th>}
                            {displayConfig.firstname && <th>First Name</th>}
                            {displayConfig.lastname && <th>Last Name</th>}
                            {displayConfig.userGroups && <th>User Groups</th>}
                            {displayConfig.userRole && <th>User Role</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {userUsers.map(user => (
                            <UserRow
                                key={user.userId}
                                user={user}
                                setSelectedGroup={setSelectedGroup}
                                setModalOpen={setModalOpen}
                                setSelectedUser={setSelectedUser}
                                displayConfig={displayConfig}
                                onAction={
                                onAction
                                }
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <UserAdderToGroup allUsers={Allusers} group={selectedGroup}  />
                <GroupDetails allGroups={groups} group={selectedGroup} currentUser={selectedUser} />
            </Modal>
        </>
    );
};

export default UserList;
