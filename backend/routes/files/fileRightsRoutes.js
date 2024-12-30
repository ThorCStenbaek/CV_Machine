const express = require('express');
const router = express.Router();
const checkCookie = require('../cookie/cookieChecker'); 
const { getUserId } = require('../../util/database/database_user'); 
const { files } = require('../../util/database/database');


router.get('/image-rights', checkCookie, (req, res) => {

    console.log("accessing image")
    files.rights.getAllFromRightsId()
        .then(rights => {
           
            res.json(rights);
        })
        .catch(err => {
            console.error("Error fetching resource image rights data:", err);
            res.status(500).send('An error occurred while fetching image rights.');
        });
});






module.exports = router;
