const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const { resources, parent } = require('./../../util/database/database');

const { generateScreenshots } = require('./../../util/screenshots/resourceShots')

const { authenticateToken } = require('./../../util/jwt/jwtUtils')


const {getUserId} = require('../../util/database/database_user'); 

router.post('/app-resource-old', authenticateToken, async (req, res) => {
    console.log("APP RESOURCE")
    const identifier = req.user.identifier;  // This assumes 'identifier' is the user ID stored in JWT

    if (! identifier) {
        return res.status(400).send('Both sosuUserId and parentsID are required.');
    }

    try {
        
        getUserId(identifier, async (err, APIUserId) => {
            console.log("APIUSER", APIUserId)
            const resourceIDs = await parent.getResourcesForUser(APIUserId)
            console.log("resourceIDS", resourceIDs)
            let ress = []

            for (let i = 0; i < resourceIDs.length; i++) {
                let newResource = await resources.getResourceById(resourceIDs[i]);
                newResource.ID = resourceIDs[i];

                 const screenshotPaths = await resources.screenshots.getImagePathsByResourceId(resourceIDs[i]);
                const screenshots = await Promise.all(screenshotPaths.map(async (fileName) => {
                const imagePath = path.join(__dirname, '..', '..', 'util', 'screenshots', 'resource_images', fileName);
                const imageBuffer = await fs.readFile(imagePath);
                    return imageBuffer.toString('base64');
                }));

                 newResource.screenshots = screenshots.map(ss => `data:image/png;base64,${ss}`);
                ress.push(newResource);
            }

        
            res.json(ress);
        });
    } catch (err) {
        console.error("Error updating parent users:", err);
        res.status(500).send('An error occurred while updating parent users.');
    }
});



router.post('/app-resource', authenticateToken, async (req, res) => {
    
    const identifier = req.user.identifier;  // This assumes 'identifier' is the user ID stored in JWT
          console.log("hello")
    if (! identifier) {
        return res.status(400).send('Both sosuUserId and parentsID are required.');
    }

    try {
        
        getUserId(identifier, async (err, APIUserId) => {
            console.log("APIUSER", APIUserId)
            const resourceIDs = await parent.getResourcesForUser(APIUserId)
            console.log("resourceIDS", resourceIDs)
            let ress = []

            for (let i = 0; i < resourceIDs.length; i++) {
                let newResource = await resources.getResourceById(resourceIDs[i]);
                newResource.ID = resourceIDs[i];


                newResource.meta= await resources.getResourceMetaByResourceId(resourceIDs[i]);
               
                for (let j = 0; j < newResource.meta.length; j++) {

                    if (newResource.meta[j].Type == "image") {
                            let privatePublic='public'
                        if (newResource.meta[j].isPrivate) 
                            privatePublic= 'private'
                                
                            
                            const imagePath = path.join(__dirname, '..', '..', 'uploads', privatePublic, 'images', 'webp', newResource.meta[j].filename);
                        const imageBuffer = await fs.readFile(imagePath);
                        const base64 = imageBuffer.toString('base64');
                            const myPath= `data:image/png;base64,${base64}`
                        newResource.meta[j].path = myPath
                      
                    }
                    

                              const screenshotPaths = await resources.screenshots.getImagePathsByResourceId(resourceIDs[i]);
                        if (screenshotPaths.length > 0) {
                            const imagePath = path.join(__dirname, '..', '..', 'util', 'screenshots', 'resource_images', screenshotPaths[0]);
                            const imageBuffer = await fs.readFile(imagePath);
                            newResource.screenshot = `data:image/png;base64,${imageBuffer.toString('base64')}`;
                        }


                 }

                ress.push(newResource);
            }


           


  
        
            res.json(ress);
        });
    } catch (err) {
        console.error("Error updating parent users:", err);
        res.status(500).send('An error occurred while updating parent users.');
    }
});








module.exports = router;
