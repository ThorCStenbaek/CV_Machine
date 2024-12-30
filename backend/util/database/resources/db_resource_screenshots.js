const { db } = require('./../database_core');
const {generateScreenshots} = require('./../../screenshots/resourceShots');


const createResourceImagePathTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS resource_image_path (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resource_id INTEGER REFERENCES resource(id),
                image_path TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(resource_id, image_path)
            )
        `;
        db.run(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Image Path table created with created_at column.');
            resolve();
        });
    });
}


const getImagePathsByResourceId = (resourceId) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT image_path FROM resource_image_path WHERE resource_id = ?`, [resourceId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const paths = rows.map(row => row.image_path);
            console.log('Fetched image paths successfully.');
            resolve(paths);
        });
    });
}



const insertImagePaths = (resourceId, imagePaths) => {
    return new Promise(async (resolve, reject) => {
        // First, delete any existing entries for this resource_id
        db.run(`DELETE FROM resource_image_path WHERE resource_id = ?`, [resourceId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Existing entries deleted.');

            // Now, insert the new image paths
            const placeholders = imagePaths.map(() => '(?, ?)').join(', ');
            const values = [];
            imagePaths.forEach(path => {
                values.push(resourceId, path);
            });

            db.run(`INSERT INTO resource_image_path (resource_id, image_path) VALUES ${placeholders}`, values, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('New image paths inserted.');
                resolve();
            });
        });
    });
}


const generateAndInsertScreenshots = async (resourceId) => {
    try {
        let screenshots = await generateScreenshots(resourceId);
        console.log("Screenshots generated:", screenshots);
        await insertImagePaths(resourceId, screenshots);
        return screenshots;  // Optionally return screenshots or a success message
    } catch (error) {
        console.error("Error in generateAndInsertScreenshots:", error);
        throw error;  // Rethrow the error to handle it further up the call stack
    }
}



module.exports = {
    createResourceImagePathTable,
    getImagePathsByResourceId,
    insertImagePaths,
    generateAndInsertScreenshots
};
