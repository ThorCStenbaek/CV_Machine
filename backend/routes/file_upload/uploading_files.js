const express = require('express');
const multer = require('multer');
const checkCookie = require('../cookie/cookieChecker'); 
const router = express.Router();
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const {getUserId} = require('../../util/database/database_user'); 


const {  createFilesTable,
    insertIntoFiles,
  getFileByID} = require('../../util/database/database_upload_files')

const {files} = require('../../util/database/database');
// Set up storage engine with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // By the time multer calls this function, it will have processed the 'private' field
    const privacyFolder = req.body.private === 'true' ? 'private' : 'public';
    let dest = `./uploads/${privacyFolder}/`; // Use the privacy setting to determine the subdirectory

    if (file.mimetype.startsWith("image/")) {
      dest += 'images/';
    } else if (file.mimetype === "application/pdf") {
      dest += 'pdfs/';
    }

    // Create the directory if it doesn't exist
    fs.mkdirSync(dest, { recursive: true });
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const userProvidedName = req.body.filename; // This would need to be sent before the file as well
    const finalName = userProvidedName ? `${userProvidedName}-${file.originalname}` : `${Date.now()}-${file.originalname}`;
    cb(null, finalName);
  }
});

const upload = multer({ storage: storage });

// File upload route


// ...

// File upload route
router.post('/upload', checkCookie, upload.single('file'), async (req, res) => {
  const userCookie = req.signedCookies.user;

   getUserId(userCookie, async (err, userId) => {
    try {
        let insertedId;

        if (req.file) {
            const isPrivate = req.body.private === 'true';
          const privacyFolder = isPrivate ? 'private' : 'public';
          console.log("What do I get here?", req.body)

            // Retrieve the custom filename or fall back to the original filename
            const customFilename = req.body.filename || req.file.originalname;

            // Construct the paths using the custom filename
            const originalPath = path.join('uploads', privacyFolder, req.file.mimetype.startsWith("image/") ? "images/" : "", 'original/', customFilename);
            const webpPath = req.file.mimetype.startsWith("image/") ? path.join('uploads', privacyFolder, "images/", "webp", `${path.basename(customFilename, path.extname(customFilename))}.webp`) : null;

            // Ensure directories exist
            if (!fs.existsSync(path.dirname(originalPath))) {
                fs.mkdirSync(path.dirname(originalPath), { recursive: true });
            }
            if (webpPath && !fs.existsSync(path.dirname(webpPath))) {
                fs.mkdirSync(path.dirname(webpPath), { recursive: true });
            }

            // File handling
            if (req.file.mimetype.startsWith("image/")) {
                fs.renameSync(req.file.path, originalPath);
                await sharp(originalPath).webp({ quality: 90 }).toFile(webpPath);

                await insertIntoFiles('image', req.file.mimetype.split('/')[1], true, originalPath, customFilename, isPrivate,userId);
                insertedId = await insertIntoFiles('image', 'webp', false, webpPath, `${path.basename(customFilename, path.extname(customFilename))}.webp`, isPrivate, userId);
              
              //insert the rights into the database...
              //the 0 is a case where we don't need to save it. 
              if (req.body.rights && req.body.rights != 0) {
                files.rights.insertIntoImageToRights(insertedId.id, req.body.rights);
               ;
              }
              let categories = req.body.categories;
                categories=categories.split(",")  
              if (categories) {
                console.log("Categories", categories, "id:", insertedId);
                  categories.forEach(async (category) => {
                    await files.insertFileCategoryAssociation(insertedId.id, category);
                  });
                }
              
              
            } else if (req.file.mimetype === "application/pdf") {
                fs.renameSync(req.file.path, originalPath);
                insertedId = await insertIntoFiles('pdf', 'pdf', true, originalPath, customFilename, isPrivate, userId);
            }
        }
        
        res.json({ success: true, fileId: insertedId });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).send('Error processing file.');
     }
       });
});








module.exports = router;
