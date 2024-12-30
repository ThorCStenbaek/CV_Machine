import React, { useContext } from 'react';
import CurrentUserContext from '../../../util/CurrentUserContext';
import isAdmin from '../../../util/isAdmin';
import UpdateUserColorForm from './changeColor';

const Profile = () => {
    const userContext = useContext(CurrentUserContext);
    const user = userContext.currentUser; // Assuming the user data is stored under currentUser
console.log("MEEEE", userContext)
    // Ensure user details are available
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Profile</h1>
            {/* Displaying the full name */}
            <h2>{`${user.firstname} ${user.lastname}`}</h2>
            <p>Email: {user.email}</p>

            {/* Displaying the user's color with a visual indicator */}
           

            {/* Conditional rendering for Admin role */}
            {isAdmin(user) && <h3>Role: Admin</h3>}

            {/* ChangeColor component for updating color, assuming it accepts a user or userID prop */}

        <UpdateUserColorForm initialColor={user.color} userID={userContext.currentUser.id} />

            {/* Alternatively, if ChangeColor uses context or doesn't need props for the user, you can just include it without passing props */}
            {/* <ChangeColor /> */}

            {/* If isAdmin needs adjustment based on your utility function, ensure it correctly evaluates user's role */}
        </div>
    );
}

export default Profile;

