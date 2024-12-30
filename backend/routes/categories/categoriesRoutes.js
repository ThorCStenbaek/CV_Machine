const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker'); // Adjust the path accordingly
const { categories } = require('../../util/database/database'); // Assuming this is where the function is exported from
const {getUserId} = require('../../util/database/database_user'); 
const { editors } = require('../../util/database/database');


router.get('/categories', checkCookie, (req, res) => {
    const categoryIdentifier = req.query.identifier;
    
    // Access the user cookie and extract the userID ugm
    const userCookie = req.signedCookies.user;
     const postType = req.query.postType ||-1;


    getUserId(userCookie, (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }



        // Pass the userID as an argument to the unfoldCategories function
        categories.unfoldCategories(categoryIdentifier, userId, postType, (err, categories) => {
            if (err) {
                return res.status(500).send('An error occurred while fetching categories.');
            }

          res.json(categories);

        });
    });
  
});

router.get('/nested-categories', checkCookie, async (req, res) => {
    // Access the user cookie and extract the userID
    const userCookie = req.signedCookies.user;
    const postType = req.query.postType ||-1;

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Call getNestedCategories
        try {
            const nestedCategories = await categories.getNestedCategories(postType);
            res.json({ success: true, data: nestedCategories });
        } catch (err) {
            console.error("Error fetching nested categories:", err);
            res.status(500).send('An error occurred while fetching nested categories.');
        }
    });
});


router.get('/category-ids-by-post-type', checkCookie, async (req, res) => {
    // Access the user cookie and extract the userID
    const userCookie = req.signedCookies.user;
    const postType = req.query.postType;

    if (!postType) {
        return res.status(400).send('postType query parameter is required.');
    }

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Call getCategoryIdsForPostType
        try {
            const categoryIds = await categories.getCategoryIdsForPostType(postType);
            res.json({ success: true, data: categoryIds });
        } catch (err) {
            console.error("Error fetching category IDs for post type:", err);
            res.status(500).send('An error occurred while fetching category IDs for the post type.');
        }
    });
});

router.post('/insert-allowed-categories', checkCookie, async (req, res) => {
    const { postTypes, categoryIDs } = req.body;

    // Validate the required parameters
    if (!postTypes || postTypes.length === 0 || !categoryIDs || categoryIDs.length === 0) {
        return res.status(400).send('Required parameters are missing or invalid.');
    }

    try {
        await categories.insertAllowedCategories(postTypes, categoryIDs);
        res.json({ success: true, message: 'Allowed categories for the given post types inserted successfully.' });
    } catch (err) {
        console.error("Error inserting allowed categories:", err);
        res.status(500).send('An error occurred while inserting the allowed categories.');
    }
});







router.post('/insert-category', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;
    const { id, name, description, subCategoryOfNameOrId, allowPostTypes, imageID } = req.body;


    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }
        if (!name || !description ) {
            return res.status(400).send('Missing required parameters.');
        }

        try {
            let result;
            if (id) {
             
                // Update the existing category
                result = await categories.updateCategory(id, name, description, subCategoryOfNameOrId, allowPostTypes);
                if (imageID) {

                    await categories.insertOrUpdateFileCategory( imageID,id);
                }
                res.json({ success: true, message: 'Category updated successfully.', categoryId: id });
            } else {
                // Insert a new category
            
                const insertedId = await categories.doInsert(name, description, userId, subCategoryOfNameOrId, allowPostTypes);

                // Insert the image ID if available
                if (imageID) {
                    await categories.insertOrUpdateFileCategory(imageID,insertedId);
                }
                res.json({ success: true, message: 'Category inserted successfully.', categoryId: insertedId });
            }
        } catch (err) {
            console.error("Error in category operation:", err);
            res.status(500).send('An error occurred during the category operation.');
        }
    });
});


router.post('/delete-category', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;
    const { toBeDeleted, newParent } = req.body;
    console.log("delete-category", req.body);
    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Optional: Add additional validation for toBeDeleted and newParent if needed

        try {
            // Call deleteCategory function
            categories.deleteCategory(toBeDeleted, newParent, (err, result) => {
                if (err) {
                    console.error("Error deleting category:", err);
                    return res.status(500).send('An error occurred while deleting the category.');
                }
                res.json({ success: true, message: 'Category deleted successfully.', result: result });
            });
        } catch (err) {
            console.error("Error in delete category operation:", err);
            res.status(500).send('An error occurred during the delete category operation.');
        }
    });
});







module.exports = router;
