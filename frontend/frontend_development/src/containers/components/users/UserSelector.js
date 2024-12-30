import React, { useState, useRef } from 'react';

const UserSelector = ({ allUsers, onHandle }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInputFocused, setInputFocused] = useState(false);
    const dropdownRef = useRef(null);
    const blurTimeoutRef = useRef(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedUserId(null);
    };

    const handleUserClick = (user) => {
        setSearchTerm(user.username);
        setSelectedUserId(user.userId);
    };

    const handleSubmit = () => {
        if (selectedUserId) {
            onHandle(selectedUserId);
        } else {
            alert('Please select a user.');
        }
    };

    const filteredUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ position: 'relative' }}>
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
                    onMouseDown={(e) => e.preventDefault()}
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

            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default UserSelector;
