const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker');
const { resources } = require('./../../util/database/database');
const { insertRating,  } = require('./../../util/database/resources/db_resource_ratings')
const {getUserId} = require('../../util/database/database_user'); 
const { saveResourceForUser,  } = require('../../util/database/resources/db_resource_saved'); 
const {getCommentsForResource, insertComment, } = require('../../util/database/resources/db_resource_comments');
const { insertNewResource, getResourceMetaByResourceId } = require('../../util/database/resources/db_resource_meta')
const {getUserSavedResources, getUserComments, getUserRatings,getUserResources } =require('../../util/database/resources/db_resource_user')
const {permissions} =require('./../../util/database/database')
const {getAllRatings} =require('./../../util/database/resources/db_resource_ratings')
const {generateScreenshots} = require('./../../util/screenshots/resourceShots');
const {user} = require('./../../util/database/database');


// Get resources by category

/*
router.get('/resources-by-category', checkCookie, async (req, res) => {
    const categoryId = req.query.categoryId; 
    console.log("API request for categoryId:", categoryId);
    
    try {
        const resourceData = await resources.getResourcesByCategory(categoryId);
        console.log("Resources fetched:", resourceData);
        res.json(resourceData);
    } catch (err) {
        console.error("Error fetching resources:", err);
        res.status(500).send('An error occurred while fetching resources by category.');
    }
});
*/


// Get resource meta by resource ID
router.get('/resource-meta', checkCookie, (req, res) => {
    const resourceId = req.query.resourceId; 
    console.log("API request for resourceId:", resourceId);

    resources.getResourceMetaByResourceId(resourceId)
        .then(metaInfo => {
           
            res.json(metaInfo);
        })
        .catch(err => {
            console.error("Error fetching resource meta data:", err);
            res.status(500).send('An error occurred while fetching resource meta data.');
        });
});



router.post('/insert-rating', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    console.log("INSERTING RATING...")
    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        const { resourceId, ratingValue } = req.body;

        // Validate the required parameters
        if (!userId || !resourceId || !ratingValue) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            const ratingId = await insertRating(userId, resourceId, ratingValue);
            res.json({ success: true, ratingId });
            console.log(ratingId)
        } catch (err) {
            console.error("Error inserting or updating rating:", err);
            res.status(500).send('An error occurred while inserting or updating the rating.');
        }
    });
});


router.post('/save-resource', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    console.log("saving resource")
    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        const { resourceId } = req.body;

        // Validate the required parameters
        if (!userId || !resourceId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            const savedResourceId = await saveResourceForUser(userId, resourceId);
            res.json({ success: true, savedResourceId });
        } catch (err) {
            console.error("Error saving resource for user:", err);
            res.status(500).send('An error occurred while saving the resource for the user.');
        }
    });
});


router.get('/comments-for-resource', checkCookie, (req, res) => {
    const resourceId = req.query.resourceId; 
    

    getCommentsForResource(resourceId)
        .then(commentsTree => {
       
            res.json(commentsTree);
        })
        .catch(err => {
            console.error("Error fetching comments tree:", err);
            res.status(500).send('An error occurred while fetching comments for the resource.');
        });
});


router.post('/insert-comment', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    
    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        const { resourceId, commentText, replyTo } = req.body;
        console.log("INSERTING COMMENT...")
        // Validate the required parameters
        if (!userId || !resourceId || !commentText) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            const commentId = await insertComment(userId, resourceId, commentText, replyTo);
            res.json({ success: true, commentId });
        } catch (err) {
            console.error("Error inserting comment:", err);
            res.status(500).send('An error occurred while inserting the comment.');
        }
    });
});


router.post('/insert-new-resource', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;



    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Destructure your parameters and set defaults for status and isPrivate
        const {
            category_id,
            title,
            description,
            post_type,
            typeName,
            metaInfo,
            classNames,
            status = 'draft', // Default to 'draft' if not provided
            isPrivate = 0,
            editor_used
        } = req.body;

        // Validate the required parameters
        if (!userId || !category_id || !title || !post_type || !typeName || !metaInfo ) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            // Pass the status and isPrivate to the insertNewResource function
            const resourceId = await insertNewResource(
                category_id,
                userId,
                title,
                description,
                post_type,
                typeName,
                metaInfo,
                classNames,
                status,
                isPrivate,
                editor_used
            );
                
            //impotant for generating resource images
            const currentDateTime = new Date().toISOString();
            if (editor_used ==3)
            //resources.screenshots.generateAndInsertScreenshots(resourceId)    
        
            
            resources.setLastUpdated(resourceId, currentDateTime)
 

            res.json({ success: true, resourceId });
        } catch (err) {
            console.error("Error inserting new resource:", err);
            res.status(500).send('An error occurred while inserting the new resource.');
        }
    });
});



/**
 EXPECTED CLEANUPP LATER. FOR NOW JUST PUT THEM HERE. 
 */

 // Get user comments
router.get('/user-comments', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    const start = parseInt(req.query.start) || 0; // default to 0 if not provided
    const numberOfComments = parseInt(req.query.numberOfComments) || 10; // default to 10 if not provided

    console.log("API request for user comments. Start:", start, "Number of comments:", numberOfComments, );

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            console.log("REQUESTING COMMENTS:", userId)
            const userComments = await getUserComments(userId, start, numberOfComments);
            console.log("User comments fetched:", userComments);
            res.json(userComments);
        } catch (err) {
            console.error("Error fetching user comments:", err);
            res.status(500).send('An error occurred while fetching the user comments.');
        }
    });
});


// Get user ratings
router.get('/user-ratings', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    const start = parseInt(req.query.start) || 0; // default to 0 if not provided
    const numberOfRatings = parseInt(req.query.numberOfRatings) || 10; // default to 10 if not provided

    console.log("API request for user ratings. Start:", start, "Number of ratings:", numberOfRatings);

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            const userRatings = await getUserRatings(userId, start, numberOfRatings);
            console.log("User ratings fetched:", userRatings);
            res.json(userRatings);
        } catch (err) {
            console.error("Error fetching user ratings:", err);
            res.status(500).send('An error occurred while fetching the user ratings.');
        }
    });
});


// Get user saved resources
router.get('/user-saved-resources', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    const start = parseInt(req.query.start) || 0; // default to 0 if not provided
    const numberOfSaved = parseInt(req.query.numberOfSaved) || 10; // default to 10 if not provided


   
    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            let userSavedResources = await getUserSavedResources(userId, start, numberOfSaved);
            
   
            //get the meta too

            console.log("User saved resources fetched:", userSavedResources);
            res.json(userSavedResources);
        } catch (err) {
            console.error("Error fetching user saved resources:", err);
            res.status(500).send('An error occurred while fetching the user saved resources.');
        }
    });
});



router.get('/user-created-resources', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    const start = parseInt(req.query.start) || 0; // default to 0 if not provided
    const numberOfResources = parseInt(req.query.numberOfResources) || 10; // default to 10 if not provided
    const status = req.query.status || "published"; // default to 'published' if not provided
    const withMeta = req.query.withMeta === 'true';


    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
           let userResources = await getUserResources(userId, status, start, numberOfResources);
            
           userResources= userResources.map(r=>{return({...r, screenshot: process.env.DOMAIN_URL + "/screenshots/" + r.id + ".webp"})})

           if (withMeta) {
                userResources = await Promise.all(userResources.map(async (r) => ({
                    ...r,
                    meta: await resources.getResourceMetaByResourceId(r.id),
                })));
            }
            
            
            
            console.log("User created resources fetched:", userResources);
            res.json(userResources);
        } catch (err) {
            console.error("Error fetching user created resources:", err);
            res.status(500).send('An error occurred while fetching the user created resources.');
        }
    });
});


router.get('/all-ratings', async (req, res) => {
    try {
        const ratings = await getAllRatings();
        res.json({ success: true, data: ratings });
    } catch (error) {
        console.error("Error fetching all ratings:", error);
        res.status(500).send('An error occurred while fetching all ratings.');
    }
});




/**PERMISSIONS MOVE LATER */

router.delete('/remove-resource-permission', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;
    const { resourceID, userID } = req.body;

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Check if the logged-in user has the right to perform this action


        try {
            const success = await permissions.removeUserResourcePermission(userID, resourceID);
            if (success) {
                res.json({ success: true, message: 'Resource permission removed successfully.' });
            } else {
                res.status(404).send('Permission not found.');
            }
        } catch (err) {
            console.error("Error removing resource permission:", err);
            res.status(500).send('An error occurred while removing the resource permission.');
        }
    });
});


router.post('/insert-resource-permission', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;
    const { resourceID, userId, groupId, accessLevel } = req.body;

    // Optional: Fetch the user ID from the cookie, if needed
    getUserId(userCookie, async (err, loggedInUserId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Optional: Check if the logged-in user has the right to perform this action
        // Implementation depends on your application's authorization logic

        try {
            const lastID = await permissions.insertResourcePermission(resourceID, userId, groupId, accessLevel);
            res.json({ success: true, message: 'Resource permission inserted successfully.', lastID: lastID });
        } catch (err) {
            console.error("Error inserting resource permission:", err);
            res.status(500).send('An error occurred while inserting the resource permission.');
        }
    });
});



router.get('/resource/:id', async (req, res) => {
    const resourceId = parseInt(req.params.id);
    
    // Validate the ID
    if (isNaN(resourceId)) {
        return res.status(400).send('Invalid resource ID.');
    }
  
    try {

        const resource = await resources.getResourceById(resourceId);
        
        if (resource) {
            // Assuming you have access to a userId here, otherwise you'll need to modify this
            const userId = req.user?.id || null; // Adjust based on how you're handling authentication
            
            // Call enrichResources with the resource wrapped in an array
            const enrichedResources = await resources.enrichResources([resource], userId);
            
            // Since enrichResources returns an array, and we know it only contains our single resource, extract it
            const enrichedResource = enrichedResources[0];
            
     
            res.json(enrichedResource);
        } else {
            res.status(404).send('Resource not found.');
        }
    } catch (err) {
        console.error("Error fetching or enriching resource:", err);
        res.status(500).send('An error occurred while fetching or enriching the resource.');
    }
});



router.post('/update-resource', async (req, res) => {
      const userCookie = req.signedCookies.user;
     const { resource_id,
            category_id,
            title,
            description,
            post_type,
            typeName,
            metaInfo,
            classNames,
            status = 'draft', // Default to 'draft' if not provided
            isPrivate = 0,
            editor_used// Default to '0' (public) if not provided
        } = req.body;


        


        getUserId(userCookie, async (err, loggedInUserId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Optional: Check if the logged-in user has the right to perform this action
        // Implementation depends on your application's authorization logic

                const update = {category_id, title, description, post_type, status, isPrivate, editor_used, created_by: loggedInUserId}
            
        try {
           

    // Validate the request body
    if (!resource_id ) {
        return res.status(400).send('Invalid request data.');
    }

    try {
        // Remove existing resource meta rows for the given resource_id
        await resources.updateResource(resource_id, update)

        if (metaInfo){
         await resources.removeResourceMetaByResourceId(resource_id)

        
        await resources.insertResourceMetaRows(resource_id, metaInfo)
    }

        //impotant for generating resource images
         //resources.screenshots.generateAndInsertScreenshots(resource_id)
            const currentDateTime = new Date().toISOString();
           (resource_id, currentDateTime)
        res.json({ success: true, message: 'Resource meta updated successfully.'});
    } catch (error) {
        console.error("Error updating resource meta:", error);
        res.status(500).send('An error occurred while updating the resource meta.');
    }

            } catch (err) {
            console.error("Error inserting resource permission:", err);
            res.status(500).send('An error occurred while inserting the resource permission.');
        }
    });
});


router.get('/copy-resource', async (req, res) => {
    const { resourceId, newTitle } = req.query;
    const userCookie = req.signedCookies.user;

    getUserId(userCookie, async (err, loggedInUserId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }
             const resource = await resources.getResourceById(resourceId);
        // Optional: Check if the logged-in user has the right to perform this action
        // Implementation depends on your application's authorization logic
        const resourceMeta = await resources.getResourceMetaByResourceId(resourceId);
        


        try {
           
             const resourceId = await insertNewResource(
                resource.category_id,
                loggedInUserId,
                newTitle || resource.title+"copy",
                resource.description,
                resource.post_type,
                "unsure",
                resourceMeta,
                "", //classNames
                'draft', //status   
                1,
                resource.editor_used
            );

            //impotant for generating resource images
             //resources.screenshots.generateAndInsertScreenshots(resourceId)
                        const currentDateTime = new Date().toISOString();
            resources.setLastUpdated(resourceId, currentDateTime)
            res.json({ success: true, resourceId });


       
        } catch (err) {
            console.error("Error copying resource:", err);
            res.status(500).send('An error occurred while copying the resource.');
        }
    });
});





router.delete('/delete-comment', checkCookie, async (req, res) => {
    const userCookie = req.signedCookies.user;
    const { commentID, userID } = req.body;

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Check if the logged-in user has the right to perform this action
        const isAdmin = await user.isAdmin(userId);

        try {
            if (isAdmin || userId === userID){
                const success = await resources.conditionalDeleteComment(commentID);
            if (success) {
                res.json({ success: true, message: 'Resource permission removed successfully.' });
            } else {
                res.status(404).send('Permission not found.');
            }
        }
        } catch (err) {
            console.error("Error removing resource permission:", err);
            res.status(500).send('An error occurred while removing the resource permission.');
        }
    });
});






module.exports = router;
