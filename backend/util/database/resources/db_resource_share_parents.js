const { db } = require('./../database_core');


const createResourceToParentTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS resource_parent (
            resource_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (resource_id) REFERENCES resource(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            PRIMARY KEY (resource_id, user_id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
};


const getUsersForResource = (resourceId) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT user_id FROM resource_parent WHERE resource_id = ?`, [resourceId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map(row => row.user_id));
        });
    });
};

const getResourcesForUser = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT resource_id FROM resource_parent WHERE user_id = ?`;  // Assuming the table is named resource_user
        db.all(query, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const resourceIds = rows.map(row => row.resource_id);  // Extract resource_id from each row
            resolve(resourceIds);
        });
    });
};




const removeUserFromResource = (resourceId, userId) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM resource_parent WHERE resource_id = ? AND user_id = ?`, [resourceId, userId], function(err) {
            if (err) {
                reject(err);
                return;
            }
            if (this.changes > 0) {
                resolve(true); // True if a row was deleted
            } else {
                resolve(false); // False if no row was deleted (i.e., the combination was not found)
            }
        });
    });
};



const addResourceToUser = (resourceId, userId) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO resource_parent (resource_id, user_id) VALUES (?, ?)`, [resourceId, userId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true); // Successfully inserted
        });
    });
};


/**
 * Updates the user associations for a resource by deleting specified user IDs and adding new ones.
 * @param {number} resourceId - The ID of the resource.
 * @param {number[]} deleteUserIDs - An array of user IDs to be disassociated from the resource.
 * @param {number[]} addUserIDs - An array of user IDs to be associated with the resource.
 * @returns {Promise<void>} A promise that resolves when the operations are complete.
 */
const updateResourceUsers = (resourceId, deleteUserIDs, addUserIDs) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION;');

            // Deleting specified user IDs
            const deleteUserPromises = deleteUserIDs.map(userId => 
                new Promise((resolve, reject) => {
                    db.run(`DELETE FROM resource_parent WHERE resource_id = ? AND user_id = ?`, [resourceId, userId], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                })
            );

            // Adding new user IDs
            const addUserPromises = addUserIDs.map(userId => 
                new Promise((resolve, reject) => {
                    db.run(`INSERT INTO resource_parent (resource_id, user_id) VALUES (?, ?)`, [resourceId, userId], (err) => {
                        if (err) {
                            // If the error is due to a UNIQUE constraint (attempting to add a duplicate),
                            // resolve anyway, since the end goal of having the userId associated is achieved.
                            if (err.code === 'SQLITE_CONSTRAINT') {
                                resolve();
                                return;
                            }
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                })
            );

            Promise.all([...deleteUserPromises, ...addUserPromises])
                .then(() => {
                    db.run('COMMIT;', (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                })
                .catch((err) => {
                    db.run('ROLLBACK;', () => {
                        reject(err);
                    });
                });
        });
    });
};



/**
 * 
 * 
 * 
 */


const createUserToUserLinkTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS user_user_links (
            sosuUserId INTEGER NOT NULL,
            parentUserId INTEGER NOT NULL,
            FOREIGN KEY (sosuUserId) REFERENCES users(id),
            FOREIGN KEY (parentUserId) REFERENCES users(id),
            PRIMARY KEY (sosuUserId, parentUserId),
            CHECK (sosuUserId != parentUserId)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('User to User Link table created.');
            resolve();
        });
    });
};


/**
 * Retrieves all parentUserIds associated with a given sosuUserId.
 * @param {number} sosuUserId - The ID of the sosu user.
 * @returns {Promise<number[]>} A promise that resolves with an array of parentUserIds.
 */
const getParentUserIdsForSosuUser = (sosuUserId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT parentUserId FROM user_user_links WHERE sosuUserId = ?`;

        db.all(query, [sosuUserId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            // Extract parentUserId from each row and resolve the promise with the array
            const parentUserIds = rows.map(row => row.parentUserId);
            resolve(parentUserIds);
        });
    });
};


/**
 * Updates parentUserIds associated with a given sosuUserId.
 * @param {number} sosuUserId - The ID of the sosu user.
 * @param {number[]} newParentUserIds - An array of new parentUserIds to associate with the sosuUserId.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const updateParentUserIdsForSosuUser = (sosuUserId, newParentUserIds) => {
    return new Promise(async (resolve, reject) => {
        // Begin transaction
        db.run('BEGIN TRANSACTION;', async (err) => {
            if (err) {
                reject(err);
                return;
            }

            try {
                // Delete existing parentUserIds associated with sosuUserId
                await new Promise((resolve, reject) => {
                    db.run(`DELETE FROM user_user_links WHERE sosuUserId = ?`, [sosuUserId], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });

                // Insert new parentUserIds
                for (const parentUserId of newParentUserIds) {
                    await new Promise((resolve, reject) => {
                        db.run(`INSERT INTO user_user_links (sosuUserId, parentUserId) VALUES (?, ?)`, [sosuUserId, parentUserId], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve();
                        });
                    });
                }

                // Commit transaction
                db.run('COMMIT;', (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            } catch (error) {
                // Rollback transaction in case of error
                db.run('ROLLBACK;', (rollbackErr) => {
                    if (rollbackErr) {
                        reject(rollbackErr);
                        return;
                    }
                    reject(error);
                });
            }
        });
    });
};


const addLinkBetweenUsers = (sosuUserId, parentUserId) => {
    return new Promise((resolve, reject) => {
        if (sosuUserId === parentUserId) {
            reject(new Error("sosuUserId cannot be the same as parentUserId"));
            return;
        }
        const sql = `INSERT INTO user_user_links (sosuUserId, parentUserId) VALUES (?, ?)`;
        db.run(sql, [sosuUserId, parentUserId], (err) => {
            if (err) {
                reject(err);
            } else {
                console.log(`Link added between user ${sosuUserId} and user ${parentUserId}.`);
                resolve();
            }
        });
    });
};





module.exports = {
    createResourceToParentTable,
    getUsersForResource,
    removeUserFromResource,
    addResourceToUser,
    updateResourceUsers,
    //user user links // sosu to parent
    createUserToUserLinkTable,
    getParentUserIdsForSosuUser,
    updateParentUserIdsForSosuUser,
    getResourcesForUser,
    addLinkBetweenUsers

}