const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker');
const {user, userRoles} = require('./../../util/database/database');
const {groups} = require('./../../util/database/database');
const {getUserId} = require('../../util/database/database_user'); 
const {updateUserColor} = require('../../util/database/database_user'); 


router.get('/all-users-and-groups-details', checkCookie, async (req, res) => {
    console.log("API request for all user and group details with associations.");

    try {
        const allUsersDetails = await user.getAllUsersDetailsGroupsAndRoles();
        const allGroupsDetails = await groups.getAllGroupsAndUsers();

        const combinedResult = {
            users: allUsersDetails,
            groups: allGroupsDetails
        };

       
        res.json(combinedResult);
    } catch (err) {
        console.error("Error fetching all user and group details:", err);
        res.status(500).send('An error occurred while fetching all user and group details.');
    }
});


router.post('/add-user', checkCookie, (req, res) => {
    let { username, email, firstname, lastname, password, userRolesName } = req.body;

    // Check if all necessary fields are provided
    if (!username || !firstname || !lastname || !password || !userRolesName) {
        return res.status(400).send('Required parameters are missing.');
    }
    if (email === '') {
        email = null;
     }

    // Insert the user
    user.insertUser(username, email, firstname, lastname, password, userRolesName, (err, userId) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).send('An error occurred while inserting the user.');
        }

        console.log(`User added with ID: ${userId}`);
        res.json({ success: true, userId: userId });
    });
});


router.get('/all-role-names', checkCookie, async (req, res) => {
    console.log("API request for all role names.");

    try {
        const roleNames = await userRoles.getAllRoleNames();
        console.log("All role names fetched:", roleNames);
        res.json({ roleNames });
    } catch (err) {
        console.error("Error fetching role names:", err);
        res.status(500).send('An error occurred while fetching all role names.');
    }
});


router.get('/get-user-details', checkCookie, async (req, res) => { 
  const userCookie = req.signedCookies.user;
    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            let userDetails = await user.getUserDetails(userId);
            userDetails.id = userId;
            res.json(userDetails);
        } catch (err) {
            console.error("Error fetching user saved resources:", err);
            res.status(500).send('An error occurred while fetching the user saved resources.');
        }
    });

})


router.post('/update-user-color', checkCookie, async (req, res) => {
    const { newColor } = req.body;
const userCookie = req.signedCookies.user;
    // Check if all necessary fields are provided
    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        try {
            // Call the updateUserColor function with the provided userID and newColor
            const lastID = await updateUserColor(userId, newColor);
            console.log(`Color updated for userID ${userId}, new entry ID: ${lastID}`);
            res.json({ success: true, message: 'User color updated successfully.', lastID: lastID });
        } catch (err) {
            console.error("Error updating user color:", err);
            res.status(500).send('An error occurred while updating the user color.');
        }
    });
});


router.get('/get-users', checkCookie, async (req, res) => {
    console.log("API request for all user and group details with associations.");
    const userCookie = req.signedCookies.user;
    getUserId(userCookie, async (err, userId) => {
        try {

            const isAdmin = await user.isAdmin(userId);

            if (!isAdmin) {
                return res.status(403).send('You do not have permission to access this resource.');
            }

            const { roleName, exclude } = req.query;
        
            // Validate query parameters
            if (!roleName) {
                return res.status(400).send('Role name is required as a query parameter.');
            }

            // Convert exclude from string to boolean
            const excludeBool = exclude === 'true';

            const users = await user.getUsersByRoleName(roleName, excludeBool);

            res.json({ success: true, users });
            console.log(`Successfully retrieved users with role: ${roleName}, exclude: ${excludeBool}. User count: ${users.length}`);
        } catch (err) {
            console.error(`Error processing request for users by role '${req.query.roleName}', exclude: ${req.query.exclude}`, err);
            res.status(500).send('An error occurred while processing your request.');
        }
    });
})




module.exports = router;