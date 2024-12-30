import React, { useState, useRef } from 'react';

const UserAdderToGroup = ({ allUsers, group }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [isInputFocused, setInputFocused] = useState(false);
    const dropdownRef = useRef(null);
    const blurTimeoutRef = useRef(null); // Add this ref to manage the timeout

    console.log("GROUPPP", group)

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedUserId(null);
    };

    const handleUserClick = (user) => {
        setSearchTerm(user.username);
        setSelectedUserId(user.userId);
    };

     const handleSubmit = async () => {
        const response = await fetch('/api/add-user-to-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: selectedUserId,
                groupId: group.groupId,
            }),
        });

        const data = await response.json();
        if (data.success) {
            setMessage(data.message);
        } else {
            setMessage('Error adding user to group.');
        }
    };

    const filteredUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ position: 'relative' }}>
            <h3>Add User to {group.groupName}</h3>

            <input
                type="text"
                placeholder="Search for user..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => {
                    if (blurTimeoutRef.current) {
                        clearTimeout(blurTimeoutRef.current);
                    }
                    blurTimeoutRef.current = setTimeout(() => {
                        setInputFocused(false);
                    }, 200);
                }}
                style={{ backgroundColor: selectedUserId ? '#ADD8E6' : 'white' }}
            />

            {isInputFocused && (
                <div
                    className="user-list"
                    ref={dropdownRef}
                    style={{ position: 'absolute', zIndex: 1, backgroundColor: 'white', border: '1px solid #ccc' }}
                    onMouseDown={(e) => e.preventDefault()} // Prevent default to avoid onBlur when clicking on the dropdown
                >
                    {filteredUsers.map((user) => (
                        <div
                            key={user.userId}
                            onClick={() => handleUserClick(user)}
                        >
                            {user.username}
                        </div>
                    ))}
                </div>
            )}

            <button onClick={handleSubmit}>Add User to Group</button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default UserAdderToGroup;
