const isAdmin = (input) => {
    // Define a variable to hold the user object, depending on the input structure
    let user = null;

    // Check if the input directly contains a 'role' property, assuming it's a user object
    if (input && input.role) {
        user = input;
    }
    // Otherwise, check if it's the userContext containing a 'currentUser' with a 'role'
    else if (input && input.currentUser && input.currentUser.role) {
        user = input.currentUser;
    }

    // Now, with the user object determined, check if the role is 'ADMIN'
    if (user && user.role && user.role.roleName === 'ADMIN') {
        return true;
    }
    return false;
}

export default isAdmin;
