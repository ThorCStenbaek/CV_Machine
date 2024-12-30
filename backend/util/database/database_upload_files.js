
const { db } = require('./database_core');
const { defaultCallback } = require('../callbacks/default_callback');

const {getUserGroups} = require('./database_user_groups')
//ID, Type (image, pdf), filetype(png, pdf, webp, jpeg), isOriginal (true,false), path, filename


const createFilesTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS files (
            ID INTEGER PRIMARY KEY, 
            Type TEXT CHECK(Type IN ('image', 'pdf')), 
            filetype TEXT CHECK(filetype IN ('png', 'pdf', 'webp', 'jpeg')), 
            isOriginal BOOLEAN NOT NULL, 
            path TEXT NOT NULL,
            filename TEXT NOT NULL,
            isPrivate BOOLEAN NOT NULL,
                       created_by INTEGER REFERENCES users(id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Files table created.');
            resolve();
        });
    });
};





const getFilesByUserID = async (userID) => {
    try {
        const filesSql = `SELECT * FROM files WHERE created_by = ?`;
        const files = await dbAllAsync(filesSql, [userID]);

        for (let file of files) {
            const categoriesSql = `
                SELECT *
                FROM fileCategoryAssociations fca
                JOIN fileCategories fc ON fca.fileCategoryID = fc.ID
                WHERE fca.fileID = ?`;
            const categories = await dbAllAsync(categoriesSql, [file.ID]);
            file.categories = categories;
        }

        return files;
    } catch (error) {
        console.error("Error fetching files by userID:", error);
        throw error;
    }
};









const insertIntoFiles = (Type, filetype, isOriginal, path, filename, isPrivate, userID) => { // added new parameter
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO files (Type, filetype, isOriginal, path, filename, isPrivate, created_by)  -- added new field
            VALUES (?, ?, ?, ?, ?, ?, ?)  -- added placeholder for new value
        `;

        // include new parameter in the SQL query
        db.run(sql, [Type, filetype, isOriginal, path, filename, isPrivate, userID], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ id: this.lastID, path: path });    // Return the ID of the inserted record
        });
    });
};



const getFileByID = (ID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM files WHERE ID = ?`;

        db.get(sql, [ID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);  // Return the fetched record
        });
    });
};


/*Might need to move the functions from this point on into something else */

const createFilePermissionsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS file_permissions (
            id INTEGER PRIMARY KEY,
            file_id INTEGER REFERENCES files(ID),
            user_id INTEGER REFERENCES users(id),
            group_id INTEGER REFERENCES groups(id),
            access_level TEXT,
            granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            CHECK ((user_id IS NOT NULL) OR (group_id IS NOT NULL))
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('File Permissions table created.');
            resolve();
        });
    });
};

const dbAllAsync = (sql, params) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});



// Assuming db.all has been promisified or use a utility function to do so
const getFilesForUser = async (userId, fileId = -1) => {
    try {
        let filesSql, filesParams;

        if (fileId === -1) {
            filesSql = `SELECT * FROM files WHERE isOriginal=0`;
            filesParams = [];
        } else {
            filesSql = `SELECT * FROM files WHERE ID = ?`;
            filesParams = [fileId];
        }

        const files = await dbAllAsync(filesSql, filesParams);

        const userGroups = await getUserGroups(userId);
        const groupIds = userGroups.map(group => group.id);

        const fileAccessPromises = files.map(async file => {
            if (!file.isPrivate) {
                return true; // File is not private, include it
            }
            // Check file access with parameterized queries
            return await checkFileAccess(file.ID, userId, groupIds);
        });

        const fileAccessResults = await Promise.all(fileAccessPromises);

        // Filter accessible files
        const accessibleFiles = files.filter((_, index) => fileAccessResults[index]);

        // Fetch categories for each accessible file
        for (let file of accessibleFiles) {
    const categoriesAndRightsSql = `
        SELECT fc.*, ri.String AS rightsString
        FROM fileCategoryAssociations fca
        JOIN fileCategories fc ON fca.fileCategoryID = fc.ID
        LEFT JOIN image_to_rights itr ON fca.fileID = itr.file_id
        LEFT JOIN rights_id ri ON itr.rights_id = ri.ID
        WHERE fca.fileID = ?`;

    const categoriesAndRights = await dbAllAsync(categoriesAndRightsSql, [file.ID]);

    // Group categories and rightsString
    const categories = categoriesAndRights.map(row => ({
        ID: row.ID,
        Name: row.Name,
        // Add other fileCategory fields if needed
    }));
    const rightsString = categoriesAndRights.length > 0 ? categoriesAndRights[0].rightsString : null;

    file.categories = categories; // Attach categories to each file
    file.rightsString = rightsString; // Attach rightsString to each file
}


        return accessibleFiles;
    } catch (error) {
        console.error("Failed to get files for user:", error);
        throw error; // Or handle it more gracefully
    }
};



const checkFileAccess = (fileId, userId, groupIds) => {
    return new Promise((resolve, reject) => {
        // Assuming there's a creator_id column in the files table.
        // This query checks if the user is the creator of the file or has explicit permissions.
        const sql = `
            SELECT f.ID
            FROM files f
            LEFT JOIN file_permissions fp ON f.ID = fp.file_id
            WHERE f.ID = ?
            AND (f.created_by = ? OR fp.user_id = ? OR fp.group_id IN (${groupIds.join(',')}))
        `;

        // Note that fileId and userId are used twice: once for checking the creator, and once for permissions
        db.all(sql, [fileId, userId, userId], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results.length > 0);
        });
    });
};




const getFileIdByPath = (path) => {
    return new Promise((resolve, reject) => {
        // Assuming `db` is your database connection object
        db.get(`SELECT ID FROM files WHERE path = ?`, [path], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                resolve(row.ID);
            } else {
                resolve(null); // or reject(new Error('File not found'));
            }
        });
    });
};



const findFileResourcesAndUsers = () => {
    return new Promise((resolve, reject) => {
        // Define the SQL query with JOIN operations
        const sql = `
            SELECT
                rm.fileID,
                rm.resource_id AS resourceID,
                r.title AS resourceTitle,
                u.username,
                u.firstname,
                u.lastname,
                u.ID AS userID
            FROM
                resource_meta rm
                INNER JOIN resource r ON rm.resource_id = r.id
                INNER JOIN users u ON r.created_by = u.id
            WHERE rm.fileID IS NOT NULL
        `;

        // Execute the query
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};







module.exports = {
  createFilesTable,
    insertIntoFiles,
    getFileByID,
    createFilePermissionsTable,
    getFilesForUser,
    getFileIdByPath,

    findFileResourcesAndUsers,
  getFilesByUserID
};
