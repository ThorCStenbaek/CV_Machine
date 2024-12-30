
const { db } = require('./database_core');
const { defaultCallback } = require('../callbacks/default_callback');

const {getUserGroups} = require('./database_user_groups')




const createFileCategoriesTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS fileCategories (
            ID INTEGER PRIMARY KEY AUTOINCREMENT, 
            Name TEXT NOT NULL, 
            Type TEXT CHECK(Type IN ('image', 'pdf'))
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('FileCategories table created.');
            resolve();
        });
    });
};









const createFileCategoryAssociationsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS fileCategoryAssociations (
            fileID INTEGER, 
            fileCategoryID INTEGER,
            FOREIGN KEY (fileID) REFERENCES files(ID) ON DELETE CASCADE,
            FOREIGN KEY (fileCategoryID) REFERENCES fileCategories(ID) ON DELETE CASCADE,
            PRIMARY KEY (fileID, fileCategoryID)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('FileCategoryAssociations table created.');
            resolve();
        });
    });
};

/**
 * 
 * FILE CATEGORY
 */

const insertFileCategory = (name, type) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO fileCategories (Name, Type) VALUES (?, ?)`;
        db.run(sql, [name, type], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(`A new FILE category has been inserted with ID ${this.lastID} and name ${name}`);
            // Return both the ID of the inserted record and the name
            resolve({ id: this.lastID, name: name });
        });
    });
};



const getAllFileCategories = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM fileCategories`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows); // Returns an array of all file categories
        });
    });
};


const deleteFileCategory = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM fileCategories WHERE ID = ?`;
        db.run(sql, [id], function(err) {
            if (err) {
                reject(err);
                return;
            }
            if (this.changes > 0) {
                console.log(`Category with ID ${id} has been deleted`);
                resolve(true); // Successfully deleted
            } else {
                console.log(`No category found with ID ${id}`);
                resolve(false); // No record found to delete
            }
        });
    });
};


/**
 * file association
 */

const insertFileCategoryAssociation = (fileID, fileCategoryID) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO fileCategoryAssociations (fileID, fileCategoryID) VALUES (?, ?)`;
        db.run(sql, [fileID, fileCategoryID], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(`Association created between file ID ${fileID} and category ID ${fileCategoryID}`);
            resolve(); // No specific value returned upon success
        });
    });
};

const getFileCategoryAssociations = (fileID) => {
    return new Promise((resolve, reject) => {
        // Updated SQL query to perform a JOIN with the fileCategories table
        // to fetch the Name and Type along with the fileCategoryID.
        const sql = `
            SELECT fca.fileID, fca.fileCategoryID, fc.Name, fc.Type 
            FROM fileCategoryAssociations fca
            JOIN fileCategories fc ON fca.fileCategoryID = fc.ID
            WHERE fca.fileID = ?
        `;
        db.all(sql, [fileID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            // Returns an enhanced array of associations for the specified file,
            // including the Name and Type of each category.
            resolve(rows);
        });
    });
};



const deleteFileCategoryAssociation = (fileID, fileCategoryID) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM fileCategoryAssociations WHERE fileID = ? AND fileCategoryID = ?`;
        db.run(sql, [fileID, fileCategoryID], function(err) {
            if (err) {
                reject(err);
                return;
            }
            if (this.changes > 0) {
                console.log(`Association between file ID ${fileID} and category ID ${fileCategoryID} has been deleted`);
                resolve(true); // Successfully deleted
            } else {
                console.log(`No association found between file ID ${fileID} and category ID ${fileCategoryID}`);
                resolve(false); // No record found to delete
            }
        });
    });
};



const getFileIDsByCategory = (categoryID) => {
    return new Promise((resolve, reject) => {
        // SQL query to select fileID from fileCategoryAssociations 
        // where the fileCategoryID matches the specified categoryID
        const sql = `
            SELECT fileID 
            FROM fileCategoryAssociations
            WHERE fileCategoryID = ?
        `;

        db.all(sql, [categoryID], (err, rows) => {
            if (err) {
                reject(err); // Handle errors
                return;
            }
            // Extract fileID from each row and resolve the promise with the list of fileIDs
            const fileIDs = rows.map(row => row.fileID);
            resolve(fileIDs);
        });
    });
};


const updateFileCategoryAssociations = (fileID, categoryIDs) => {
    return new Promise(async (resolve, reject) => {
        // Begin a transaction to ensure atomicity
        db.run('BEGIN TRANSACTION;', async (err) => {
            if (err) return reject(err);

            try {
                // Delete existing associations for the file
                const deleteSql = `DELETE FROM fileCategoryAssociations WHERE fileID = ?`;
                await new Promise((deleteResolve, deleteReject) => {
                    db.run(deleteSql, [fileID], function(deleteErr) {
                        if (deleteErr) deleteReject(deleteErr);
                        else deleteResolve();
                    });
                });

                // Insert new associations for each categoryID
                const insertSql = `INSERT INTO fileCategoryAssociations (fileID, fileCategoryID) VALUES (?, ?)`;
                for (const categoryID of categoryIDs) {
                    await new Promise((insertResolve, insertReject) => {
                        db.run(insertSql, [fileID, categoryID], function(insertErr) {
                            if (insertErr) insertReject(insertErr);
                            else insertResolve();
                        });
                    });
                }

                // Commit the transaction
                db.run('COMMIT;', (commitErr) => {
                    if (commitErr) reject(commitErr);
                    else resolve();
                });
            } catch (transactionErr) {
                // Rollback the transaction in case of an error
                db.run('ROLLBACK;', (rollbackErr) => {
                    if (rollbackErr) reject(rollbackErr);
                    else reject(transactionErr);
                });
            }
        });
    });
};






module.exports = {

    createFileCategoriesTable,
    createFileCategoryAssociationsTable,
    insertFileCategory,
    getAllFileCategories,
    deleteFileCategory,
    insertFileCategoryAssociation,
    getFileCategoryAssociations,
    deleteFileCategoryAssociation,
    getFileIDsByCategory,
     updateFileCategoryAssociations


};
