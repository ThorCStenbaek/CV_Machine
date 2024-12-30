const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker'); // Adjust the path accordingly
const { editors } = require('../../util/database/database'); // Import the editors methods


// Route to get all editors
router.get('/all-editors', checkCookie, async (req, res) => {
    try {
        const allEditors = await editors.getAllEditors();
        res.json({ success: true, data: allEditors });
    } catch (err) {
        console.error("Error fetching all editors:", err);
        res.status(500).send('An error occurred while fetching all editors.');
    }
});

// Route to get editors by post type ID
router.get('/editors-by-post-type', checkCookie, async (req, res) => {
    const postTypeID = req.query.postTypeID;

    if (!postTypeID) {
        return res.status(400).send('postTypeID query parameter is required.');
    }

    try {
        const editorsByPostType = await editors.getEditorsByPostTypeID(postTypeID);
        res.json({ success: true, data: editorsByPostType });
    } catch (err) {
        console.error("Error fetching editors by post type ID:", err);
        res.status(500).send('An error occurred while fetching editors by post type ID.');
    }
});

// Route to get editor by resource ID
router.get('/editor-by-resource', checkCookie, async (req, res) => {
    const resourceID = req.query.resourceID;

    if (!resourceID) {
        return res.status(400).send('resourceID query parameter is required.');
    }

    try {
        const editorByResource = await editors.getEditorByResourceID(resourceID);
        res.json({ success: true, data: editorByResource });
    } catch (err) {
        console.error("Error fetching editor by resource ID:", err);
        res.status(500).send('An error occurred while fetching editor by resource ID.');
    }
});

router.post('/insert-allowed-editors-post-type', checkCookie, async (req, res) => {
    const { editorIDs, postTypeIDs } = req.body;

    // Validate the required parameters
    if (!editorIDs || editorIDs.length === 0 || !postTypeIDs || postTypeIDs.length === 0) {
        return res.status(400).send('Required parameters are missing or invalid.');
    }

    try {
        await editors.insertAllowedEditorsPostType(editorIDs, postTypeIDs);
        res.json({ success: true, message: 'Allowed editors post type updated successfully.' });
    } catch (err) {
        console.error("Error updating allowed editors post type:", err);
        res.status(500).send('An error occurred while updating the allowed editors post type.');
    }
});


router.post('/insert-resource-to-editor', checkCookie, async (req, res) => {
    const { resourceID, editorID } = req.body;

    if (resourceID === undefined || editorID === undefined) {
        return res.status(400).send('resourceID and editorID are required.');
    }

    try {
        await editors.insertResourceToEditor(resourceID, editorID);
        res.json({ success: true, message: 'Resource to editor updated successfully.' });
    } catch (err) {
        console.error("Error updating resource to editor:", err);
        res.status(500).send('An error occurred while updating the resource to editor.');
    }
});

module.exports = router;