const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker'); 
const {getUserId} = require('../../util/database/database_user'); 
const {files } = require('../../util/database/database'); 


router.post('/files/insert_category', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
  
    // Using req.body suggests this should be a POST request, not GET.
    // Consider changing the method to POST if you're sending data in the body.
    const { name, type } = req.body;

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            console.error("Error while fetching the user ID:", err);
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId || !name || !type) {
            console.error("Required parameters are missing.");
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            // The variable name here might be misleading since it's not about user files, but a category insertion.
            // Consider renaming `userFiles` to something more descriptive, like `newCategory`.
            const newCategory = await files.insertFileCategory(name, type);
            console.log(`A new FILE category has been inserted: ID ${newCategory.id}, Name ${newCategory.name}`);
            res.status(201).json(newCategory); // Using status 201 for creation
        } catch (error) {
            console.error("Error inserting a new category:", error);
            res.status(500).send('An error occurred while inserting the category.');
        }
    });
});



router.delete('/files/delete_category', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;

    // Assuming the ID of the category to delete is passed as a query parameter or in the body
    // Using req.query for DELETE is more common as DELETE requests don't typically have a body
    // But you should use whichever is more suitable for your front-end implementation
    const categoryId = parseInt(req.query.categoryId || req.body.categoryId) || -1;

    getUserId(userCookie, async (err, userId) => {
        try {
            // Assuming this is an async function that returns a userId or throws an error
        
            if (!userId || categoryId === -1) {
                return res.status(400).send('Required parameters are missing.');
            }

            const isDeleted = await files.deleteFileCategory(categoryId);
            if (isDeleted) {
                console.log(`Category with ID ${categoryId} has been deleted.`);
                res.status(200).send(`Category with ID ${categoryId} has been successfully deleted.`);
            } else {
                console.log(`No category found with ID ${categoryId}.`);
                res.status(404).send(`No category found with ID ${categoryId}.`);
            }
        } catch (err) {
            console.error("Error processing your request:", err);
            res.status(500).send('An error occurred while processing your request.');
        }
    });
});




router.get('/files/all_categories', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
   // default to -1 if not provided


    getUserId(userCookie, async (err, userId) => {
        
        if (err) 
            return res.status(500).send('An error occurred while fetching the user ID.');
        // Validate the required parameters
        if (!userId ) 
            return res.status(400).send('Required parameters are missing.');
        

        try {


            const allCats = await files.getAllFileCategories()
         
            res.json(allCats);
        } catch (err) {
            console.error("Error fetching file categories:", err);
            res.status(500).send('An error occurred while fetching the file categories.');
        }
    });
});



router.get('/files/category/:catID', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
   // default to -1 if not provided
    const catID = parseInt(req.params.catID);

    getUserId(userCookie, async (err, userId) => {
        
        if (err) 
            return res.status(500).send('An error occurred while fetching the user ID.');
        // Validate the required parameters
        if (!userId || !catID) 
            return res.status(400).send('Required parameters are missing.');
        

        try {


            const allCats = await files.getFileIDsByCategory(catID)

            let allFiles = []
            for (let i = 0; i < allCats.length; i++) {
                const file = await files.getFilesForUser(userId, allCats[i])
                allFiles.push(file)
            }
            //this is really stupid, but it returns an array of arrays
            allFiles= allFiles.flatMap(x => x) //flatten the array

    
            res.json(allFiles);
        } catch (err) {
            console.error(`Error fetching files from category: ${catID}`, err);
            res.status(500).send(`An error occured while fetching files from category: ${catID}`);
        }
    });
});





/**
 * CATEGORY ASSOCIATION ROUTES
 */

router.get('/files/category_associations/:fileID', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;
    const fileID = parseInt(req.params.fileID);
    getUserId(userCookie, async (err, userId) => {
        try {
            // Again, assuming this is a method you implement

            if (!userId || isNaN(fileID)) {
                return res.status(400).send('Required parameters are missing or invalid.');
            }

            const associations = await files.getFileCategoryAssociations(fileID);
            if (associations.length > 0) {
                res.json(associations);
            } else {
                res.status(404).send('No associations found for the specified file ID.');
            }
        } catch (error) {
            console.error("Error fetching file-category associations:", error);
            res.status(500).send('An error occurred while fetching the file-category associations.');
        }
    });
});


router.post('/files/associate_category', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;
    const { fileID, categoryIDs } = req.body;
    getUserId(userCookie, async (err, userId) => {
        try {


            if (!userId) {
                return res.status(401).send('Unauthorized or invalid user ID.');
            }
            if (!fileID || !Array.isArray(categoryIDs) ) {
                return res.status(400).send('Required parameters are missing or invalid.');
            }

            await files.updateFileCategoryAssociations(fileID, categoryIDs);
            res.status(201).send(`Successfully updated associations for fileID: ${fileID}`);
        } catch (error) {
            console.error("Error updating file-category associations:", error);
            res.status(500).send('An error occurred while updating the file-category associations.');
        }
    });
});











module.exports = router;
