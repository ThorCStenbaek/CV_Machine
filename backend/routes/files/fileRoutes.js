const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker'); 
const {getUserId} = require('../../util/database/database_user'); 
const {  createFilesTable,
    insertIntoFiles,
  getFileByID, getFilesForUser,getFileIdByPath, getFilesByUserID} = require('../../util/database/database_upload_files')

const { files } = require('../../util/database/database')

router.get('/files', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    const fileId = parseInt(req.query.fileId) || -1; // default to -1 if not provided

    console.log("API request for user files. File ID:", fileId);

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            const userFiles = await getFilesForUser(userId, fileId);
       
            res.json(userFiles);
        } catch (err) {
            console.error("Error fetching user files:", err);
            res.status(500).send('An error occurred while fetching the user files.');
        }
    });
});




router.get('/my_files', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;
    const fileId = parseInt(req.query.fileId) || -1; // default to -1 if not provided

    console.log("API request for user files. File ID:", fileId);

    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            const userFiles = await getFilesByUserID(userId);
            console.log("User files fetched:", userFiles);
            res.json(userFiles);
        } catch (err) {
            console.error("Error fetching user files:", err);
            res.status(500).send('An error occurred while fetching the user files.');
        }
    });
});




router.get('/file-id', checkCookie, (req, res) => {
    const filePath = req.query.filePath;
console.log("file path: ", filePath)
    if (!filePath) {
        return res.status(400).send('File path parameter is required.');
    }

    getFileIdByPath(filePath)
        .then(fileId => {
            if (fileId !== null) {
                res.json({ fileId });
            } else {
                res.status(404).send('File not found.');
            }
        })
        .catch(err => {
            console.error('Error fetching file ID:', err);
            res.status(500).send('An error occurred while fetching the file ID.');
        });
});





router.get('/files_used', checkCookie, (req, res) => {
    const userCookie = req.signedCookies.user;

const aggregateData = (data) => {
    const usersMap = new Map();

    data.forEach((item) => {
        const { fileID, resourceID, resourceTitle, userID, firstname, lastname, username, ...fileDetails } = item;

        // Use user details as the key
        const userKey = `${firstname} ${lastname} (${username})`;

        // If the user does not exist in the map, add them
        if (!usersMap.has(userKey)) {
            usersMap.set(userKey, {
                Username: username,
                UserID: userID,
                Firstname: firstname,
                Lastname: lastname,
                Resources: []
            });
        }

        // Get the user object from the map
        const user = usersMap.get(userKey);

        // Check if the resource already exists for the user
        let resource = user.Resources.find((r) => r.ResourceID === resourceID);
        if (!resource) {
            // If the resource does not exist, add it
            resource = {
                ResourceID: resourceID,
                ResourceTitle: resourceTitle,
                Files: []
            };
            user.Resources.push(resource);
        }

        // Add the file details directly to the resource's Files array
        resource.Files.push({

            ...fileDetails.file
        });
    });

    // Convert the map to an array of user objects
    return Array.from(usersMap, ([key, value]) => value);
};








    getUserId(userCookie, async (err, userId) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the user ID.');
        }

        // Validate the required parameters
        if (!userId) {
            return res.status(400).send('Required parameters are missing.');
        }

        try {
            let filesUsed = await files.findFileResourcesAndUsers();



            for (let i = 0; i < filesUsed.length; i++) {
                const file = await files.getFilesForUser(userId, filesUsed[i].fileID)
                filesUsed[i].file = file[0];
            }

            
            const aggregatedData = aggregateData(filesUsed );
       
            res.json(aggregatedData);
        } catch (err) {
            console.error("Error fetching user files:", err);
            res.status(500).send('An error occurred while fetching the user files.');
        }
    });
});




module.exports = router;
