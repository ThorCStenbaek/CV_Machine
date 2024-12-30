const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker');
const { categories } = require('./../../util/database/database');
const {resources} = require('./../../util/database/database');
const {editors} = require('./../../util/database/database');


router.post('/add-resource-type', checkCookie, async (req, res) => {
    const { typeName, description, postName, postNamePlural, categoryIDs, editorIDs } = req.body;

    console.log(req.body)
    // Validate the required parameters
    if (!typeName || !postName || !postNamePlural || !categoryIDs || categoryIDs.length === 0) {
        return res.status(400).send('Required parameters are missing or invalid.');
    }

    try {
        // The function now expects the new parameters as well
        const postTypeID = await categories.insertResourceTypeAndAllowedCategories(typeName, description, postName, postNamePlural, categoryIDs);
        await editors.insertAllowedEditorsPostType(editorIDs, [postTypeID]);
        res.json({ success: true, message: 'Resource type name and allowed categories inserted successfully.' });
    } catch (err) {
        console.error("Error inserting resource type name and allowed categories:", err);
        res.status(500).send('An error occurred while inserting the resource type name and allowed categories.');
    }
});



router.get('/all-resource-types', checkCookie, async (req, res) => {
    try {
        const resourceTypeNames = await resources.getAllResourceTypeNames();
        
        res.json({ success: true, data: resourceTypeNames });
    } catch (err) {
        console.error("Error fetching resource type names:", err);
        res.status(500).send('An error occurred while fetching the resource type names.');
    }
});


router.post('/change-resource-type', checkCookie, async (req, res) => {
    const {id,typeName, description, postName, postNamePlural, postTypes, categoryIDs, editorIDs, displayConfig } = req.body;

    // Validate the required parameters
    if (!postTypes || postTypes.length === 0 || !categoryIDs || categoryIDs.length === 0) {
        return res.status(400).send('Required parameters are missing or invalid.');
    }

    try {
        await resources.updateResourceTypeName(id,typeName, description, postName, postNamePlural, postTypes, categoryIDs);
        await categories.insertAllowedCategories(postTypes, categoryIDs);
        await editors.insertAllowedEditorsPostType(editorIDs, postTypes);
        await resources.updatePostTypeDisplayConfig(id, displayConfig);
        res.json({ success: true, message: 'Allowed categories for the given post types inserted successfully.' });
    } catch (err) {
        console.error("Error inserting allowed categories:", err);
        res.status(500).send('An error occurred while inserting the allowed categories.');
    }
});

    
router.post('/update-post-type-display-config', checkCookie, async (req, res) => {
    const { postTypeId, configKeyValuePairs } = req.body;

    // Validate the required parameters
    if (!postTypeId || !configKeyValuePairs || configKeyValuePairs.length === 0) {
        return res.status(400).send('Required parameters are missing or invalid.');
    }

    try {
        await resources.updatePostTypeDisplayConfig(postTypeId, configKeyValuePairs);
        res.json({ success: true, message: 'Post type display configuration updated successfully.' });
    } catch (err) {
        console.error("Error updating post type display configuration:", err);
        res.status(500).send('An error occurred while updating the post type display configuration.');
    }
});

router.get('/post-display-config/:postId', checkCookie, async (req, res) => {
    const postId = req.params.postId;

    if (!postId) {
        return res.status(400).send('Post ID is required.');
    }

    try {
        const displayConfig = await resources.getDisplayConfigByPostId(postId);
        res.json({ success: true, data: displayConfig });
    } catch (err) {
        console.error("Error fetching post display configuration:", err);
        res.status(500).send('An error occurred while fetching the post display configuration.');
    }
});





module.exports = router;
