const { db } = require('../database_core');
const { defaultCallback } = require('../../callbacks/default_callback');


const createEditorsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS Editors (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            adminDescription TEXT
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Editors table created.');
            resolve();
        });
    });
};


const createAllowedEditorsPostTypeTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS AllowedEditorsPostType (
            editorID INTEGER REFERENCES Editors(id),
            postTypeID INTEGER,  -- References either resource_type_name(id) or resource(post_type), as per your requirement
            PRIMARY KEY (editorID, postTypeID)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('AllowedEditorsPostType table created.');
            resolve();
        });
    });
};



const createResourceToEditorTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS ResourceToEditor (
            resourceID INTEGER PRIMARY KEY REFERENCES resource(id),
            editorID INTEGER REFERENCES Editors(id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('ResourceToEditor table created.');
            resolve();
        });
    });
};

/*INSERTIONS*/

const insertEditor = (name, description, adminDescription) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO Editors (name, description, adminDescription) VALUES (?, ?, ?)`, 
        [name, description, adminDescription], 
        (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Editor inserted successfully.');
            resolve();
        });
    });
};



const insertAllowedEditorsPostType = (editorIDs, postTypeIDs) => {
    console.log("editors: ",editorIDs, postTypeIDs)
    return new Promise(async (resolve, reject) => {
        try {
            await deletePostTypes(postTypeIDs); // A separate function to handle deletion

            for (const editorID of editorIDs) {
                for (const postTypeID of postTypeIDs) {
                    await insertEditorPostTypePair(editorID, postTypeID);
                }
            }

            console.log('AllowedEditorsPostType updated successfully.');
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

    const deletePostTypes = (postTypeIDs) => {
        return new Promise((resolve, reject) => {
            const placeholders = postTypeIDs.map(() => '?').join(',');
            db.run(`DELETE FROM AllowedEditorsPostType WHERE postTypeID IN (${placeholders})`, postTypeIDs, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    };

    const insertEditorPostTypePair = (editorID, postTypeID) => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO AllowedEditorsPostType (editorID, postTypeID) VALUES (?, ?)`, [editorID, postTypeID], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
};


const insertResourceToEditor = (resourceID, editorID) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if the resourceID already exists in the table
            const exists = await checkResourceExists(resourceID);
            if (exists) {
                // If it exists, delete the existing record
                await deleteResource(resourceID);
            }

            // Insert the new record
            db.run(`INSERT INTO ResourceToEditor (resourceID, editorID) VALUES (?, ?)`, [resourceID, editorID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('ResourceToEditor updated successfully.');
                resolve();
            });
        } catch (err) {
            reject(err);
        }
    });
};

    const checkResourceExists = (resourceID) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as count FROM ResourceToEditor WHERE resourceID = ?`, [resourceID], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row.count > 0);
            });
        });
    };

    const deleteResource = (resourceID) => {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ResourceToEditor WHERE resourceID = ?`, [resourceID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
};


/*Queries */

const getAllEditors = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Editors`, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};


const getPostTypesByEditorID = (editorID) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT postTypeID FROM AllowedEditorsPostType WHERE editorID = ?`, [editorID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map(row => row.postTypeID));
        });
    });
};


const getEditorsByPostTypeIDOpague = (postTypeID) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT editorID FROM AllowedEditorsPostType WHERE postTypeID = ?`, [postTypeID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map(row => row.editorID));
        });
    });
};


const getEditorByResourceIDOpague = (resourceID) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT editorID FROM ResourceToEditor WHERE resourceID = ?`, [resourceID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row ? row.editorID : null);
        });
    });
};


const getEditorsByPostTypeID = (postTypeID) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT e.id, e.name, e.description, e.adminDescription 
                FROM AllowedEditorsPostType a 
                JOIN Editors e ON a.editorID = e.id 
                WHERE a.postTypeID = ?`, [postTypeID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getEditorByResourceID= (resourceID) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT e.id, e.name, e.description, e.adminDescription 
                FROM ResourceToEditor r 
                JOIN Editors e ON r.editorID = e.id 
                WHERE r.resourceID = ?`, [resourceID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};





module.exports = {
    createEditorsTable,
    createAllowedEditorsPostTypeTable,
    createResourceToEditorTable,
    insertEditor,
    insertAllowedEditorsPostType,
    insertResourceToEditor,
    getAllEditors,
    getPostTypesByEditorID,
    getEditorsByPostTypeID,
    getEditorByResourceID
}

