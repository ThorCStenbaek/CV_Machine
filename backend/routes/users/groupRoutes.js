const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker');
const {getUserId} = require('../../util/database/database_user'); 
const { groups } = require('./../../util/database/database');


router.post('/add-user-to-group', checkCookie, async (req, res) => {
    const { userId, groupId } = req.body;

    // Validate the required parameters
    if (!userId || !groupId) {
        return res.status(400).send('Required parameters are missing.');
    }

    try {
        const result = await groups.insertUserToGroup(userId, groupId);
        res.json({ success: true, message: result });
    } catch (err) {
        console.error("Error inserting user to group:", err);
        res.status(500).send('An error occurred while inserting the user to the group.');
    }
});

// Remove user from group
router.delete('/remove-user-from-group', checkCookie, async (req, res) => {
    const { userId, groupId } = req.body;

    // Validate the required parameters
    if (!userId || !groupId) {
        return res.status(400).send('Required parameters are missing.');
    }

    try {
        const result = await groups.removeUserFromGroup(userId, groupId);
        res.json({ success: true, message: result });
    } catch (err) {
        console.error("Error removing user from group:", err);
        res.status(500).send('An error occurred while removing the user from the group.');
    }
});


module.exports = router;