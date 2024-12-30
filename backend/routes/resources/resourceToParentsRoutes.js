const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker');
const { parent} = require('./../../util/database/database');
const {user} = require('./../../util/database/database');
const { getUserId } = require('../../util/database/database_user'); 




router.get('/get-users-for-resource', checkCookie, (req, res) => {
    
    const userCookie = req.signedCookies.user;

    getUserId(userCookie, async (err, APIUserId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        const { resourceId } = req.query;

        const isAdmin = await user.isAdmin(APIUserId);
        if (!isAdmin) 
            console.log(`Unauthorized access attempt by user ${APIUserId} for resource ID ${resourceId}.`);
        
        // Validate the required parameters
    if (!resourceId) {
        return res.status(400).send('Resource ID is required.');
    }

        try {
            let UserIDs = await parent.getUsersForResource(resourceId);
            

            //filters incase the user is not an admin. 
            if (!isAdmin) {
                const allowedIDs = await parent.getParentUserIdsForSosuUser(APIUserId);
                UserIDs = UserIDs.filter(id => allowedIDs.includes(id));
            
            }


            let users=[]
            for (let i = 0; i < UserIDs.length; i++) {
                let newUser = await user.getUserDetails(UserIDs[i]);
                newUser.ID=UserIDs[i];
                users.push(newUser);
            }
            res.json({ success: true,  users });
            console.log( users)
        } catch (err) {
            console.error("Error fetching parents:", err);
            res.status(500).send('An error occurred while fethcing parents.');
        }
    });
});


router.post('/remove-user-from-resource', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;

    getUserId(userCookie, async (err, APIUserId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        const { resourceId, userId } = req.body;

        // Validate the required parameters
        if (!userId || !resourceId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            const wasDeleted = await parent.removeUserFromResource(resourceId, userId);
            if (wasDeleted) {
                res.json({ success: true, message: 'User was successfully removed from the resource.' });
            } else {
                res.status(404).send('No such user-resource combination was found.');
            }
        } catch (err) {
            console.error("Error removing user from resource:", err);
            res.status(500).send('An error occurred while removing the user from the resource.');
        }
    });
});



router.post('/add-resource-to-users', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;

    getUserId(userCookie, async (err, APIUserId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        const { resourceId, userIds } = req.body;

        // Validate the required parameters
        if (!userIds || !resourceId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            const allAllowedIDs = await parent.getParentUserIdsForSosuUser(APIUserId);
            const deleteIDs = allAllowedIDs.filter(id => !userIds.includes(id));
            const wasAdded = await parent.updateResourceUsers(resourceId, deleteIDs, userIds);
            console.log("WAS ADDED:", wasAdded)
            console.log("USERIDS:", deleteIDs)

            res.json({ success: true, message: 'Resource was successfully added to the users.' });
        } catch (err) {
            console.error("Error adding resource to user:", err);
            res.status(500).send('An error occurred while adding the resource to the user.');
        }
    });
});


//link sosu to parent


router.post('/get-parent-users', checkCookie, async (req, res) => {
    let { sosuUserId } = req.body;

    if (!sosuUserId) {
        console.log(`Request failed: 'sosuUserId' is missing in the request body.`);
        return res.status(400).send('sosuUserId is required.');
    }

    try {
        const userCookie = req.signedCookies.user; // Ensure userCookie is defined
        getUserId(userCookie, async (err, APIUserId) => {

            // Checking if the requested sosuUserId matches the API user's ID or if the API user is an admin
            if (APIUserId !== sosuUserId) {
                const isAdmin = await user.isAdmin(APIUserId);
                if (!isAdmin) {
                    console.log(`Unauthorized access attempt by user ${APIUserId} for sosuUserId ${sosuUserId}.`);
                    return res.status(403).send('You are not authorized to view this resource.');
                }
                console.log(`Admin user ${APIUserId} accessing records for sosuUserId ${sosuUserId}.`);
            } else {
                console.log(`User ${APIUserId} accessing their own parent records.`);
            }

            const parents = await parent.getParentUserIdsForSosuUser(sosuUserId);
            const detailedParents = [];
            for (let i = 0; i < parents.length; i++) {
                let parentUser = await user.getUserDetails(parents[i]);
                parentUser.ID= parents[i];
                detailedParents.push(parentUser);

            }

            console.log(`Successfully retrieved parent user IDs for sosuUserId ${sosuUserId}.`);
            console.log("PARENTS:", parents)
            res.json(detailedParents);
        });
    } catch (err) {
        console.error("Error retrieving parent user IDs:", err);
        res.status(500).send('An error occurred while retrieving the parent user IDs.');
    }
});




router.post('/update-parent-users', checkCookie, (req, res) => {
    let { sosuUserId, parentsID } = req.body;
            const userCookie = req.signedCookies.user;

    if (!sosuUserId) {
        return res.status(400).send('sosuUserId is required.');
    }

    getUserId(userCookie, async (err, APIUserId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }
        
        if (APIUserId !== sosuUserId) {
            const isAdmin = await user.isAdmin(APIUserId);
            if (!isAdmin) 
                //return res.status(403).send('You are not authorized to view this resource.');
                console.log("You are not authorized to view this resource.");
                sosuUserId = APIUserId;

            
        }
    


        // Validate the required parameters
        if (!sosuUserId || !parentsID) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            console.log("beforecall:", sosuUserId, parentsID)
            parentsID=parentsID.filter(id => id != null);
            const parents = await parent.updateParentUserIdsForSosuUser(sosuUserId, parentsID)
            console.log("it worked", parents)
            res.json({ success: true, message: 'Resource was successfully added to the users.' });
        } catch (err) {
            console.error("Error adding resource to user:", err);
            res.status(500).send('An error occurred while adding the resource to the user.');
        }
    });
});





router.post('/add-single-parent', checkCookie, (req, res) => {
    let { sosuUserId, parentID } = req.body;
    console.log("LOGGING", sosuUserId, parentID)
            const userCookie = req.signedCookies.user;

    if (!sosuUserId) {
        return res.status(400).send('sosuUserId is required.');
    }

    getUserId(userCookie, async (err, APIUserId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }
        
        if (APIUserId !== sosuUserId) {
            const isAdmin = await user.isAdmin(APIUserId);
            if (!isAdmin) 
                //return res.status(403).send('You are not authorized to view this resource.');
                console.log("You are not authorized to view this resource.");
                sosuUserId = APIUserId;

            
        }
    


        // Validate the required parameters
        if (!sosuUserId || !parentID) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {

            const parents = await parent.addLinkBetweenUsers(sosuUserId, parentID)
            console.log("it worked", parents)
            res.json({ success: true, message: 'Resource was successfully added to the users.' });
        } catch (err) {
            console.error("Error adding resource to user:", err);
            res.status(500).send('An error occurred while adding the resource to the user.');
        }
    });
});



module.exports = router;

