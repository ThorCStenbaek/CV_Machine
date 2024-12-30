import React, { useState, useEffect } from 'react';

const GroupDetails = ({ group, allGroups, currentUser }) => {
    // Initialize users state at the top level
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!group) return;

        const selectedGroup = allGroups.find(g => g.groupId === group.groupId);
        if (!selectedGroup) return;

        // Sort users so that the currentUser is at the top, and set it to state
        const sortedUsers = [...selectedGroup.users].sort((a, b) => {
            if (a.userId === currentUser) return -1;
            if (b.userId === currentUser) return 1;
            return 0;
        });

        setUsers(sortedUsers);
    }, [group, allGroups, currentUser]); // Depend on group, allGroups, and currentUser

    const handleRemoveUser = async (userId) => {
        try {
            const response = await fetch('/api/remove-user-from-group', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    groupId: group?.groupId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Update the users state to remove the user locally
                setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                console.log(data.message);
            } else {
                console.error('Error removing user from group.');
            }
        } catch (err) {
            console.error('An error occurred:', err);
        }
    };

    if (!group || users.length === 0) return null;

    return (
        <>
            <h2>Users in {group.groupName}</h2>
            <ul>
                {users.map(user => (
                    <li key={user.userId}>
                        {user.username} ({user.firstname} {user.lastname})
                        <button onClick={() => handleRemoveUser(user.userId)}>Remove from Group</button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default GroupDetails;
