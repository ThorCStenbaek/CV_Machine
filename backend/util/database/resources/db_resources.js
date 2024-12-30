const { db } = require('./../database_core');
const { defaultCallback } = require('../../callbacks/default_callback');
const {createRatingTable} = require('./db_resource_ratings');
const {createSavedResourcesTable} = require('./db_resource_saved');
const {createResourceCommentsTable , insertComment, countCommentsForResource, getCommentsForResource, conditionalDeleteComment } = require('./db_resource_comments');



    const createResourceTable = () => {
        return new Promise((resolve, reject) => {
            db.run(`CREATE TABLE IF NOT EXISTS resource (
                id INTEGER PRIMARY KEY,
                category_id INTEGER REFERENCES category(ID),
                created_by INTEGER REFERENCES users(id),
                title TEXT NOT NULL,
                description TEXT,
                post_type INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT NOT NULL DEFAULT 'draft',  -- No CHECK constraint, handled in application logic
                isPrivate BOOLEAN NOT NULL DEFAULT 0,  -- Assuming '0' for public, '1' for private
                editor_used INTEGER NULL
            )`, (err) => {
                if (err) {
                    reject(err);
                    return; // Corrected here: Removed the period and added a semicolon
                }
                console.log('Resource table created.');
                resolve();
            });
        });
    };



const createResourceTypeNameTable = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS resource_type_name (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,  
                post_name TEXT NOT NULL,
                post_name_plural TEXT NOT NULL
            )
        `;
        db.run(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Type Name table created or modified.');
            resolve();
        });
    });
}

    
    
    
//Table is redundant. Delete later. 
const createResourceTypeTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS resource_type (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            post_type INTEGER REFERENCES resource(post_type),
            type_id INTEGER REFERENCES resource_type_name(id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Type table created.');
            resolve();
        });
    });
}
//Table is redundant. Delete later. ^^^^


const insertResourceTypeName = (typeName, description = null, postName, postNamePlural) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO resource_type_name (name, description, post_name, post_name_plural) VALUES (?, ?, ?, ?)`;
        db.run(sql, [typeName, description, postName, postNamePlural], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(`Data inserted into Resource Type Name table with ID: ${this.lastID}`);
            resolve(this.lastID);
        });
    });
}



const updateResourceTypeName = (id, newName, newDescription, newPostName, newPostNamePlural) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE resource_type_name SET name = ?, description = ?, post_name = ?, post_name_plural = ? WHERE id = ?`;
        db.run(sql, [newName, newDescription, newPostName, newPostNamePlural, id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Type Name updated.');
            resolve();
        });
    });
}


const getResourcesByCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM resource WHERE category_id = ?`;

        db.all(sql, [categoryId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);

        });
    });
}


const getResourcesByCategoryWithPermissions = (categoryId, userId, postType = -1, excludeDeleted = true) => {
    return new Promise((resolve, reject) => {
        // Construct the additional WHERE clause to exclude deleted resources if necessary
        const excludeDeletedClause = excludeDeleted ? "AND r.status != 'deleted'" : "";

        // Corrected condition to filter by postType
        const postTypeClause = postType !== -1 ? "AND r.post_type = ?" : "";

        const sql = `
            SELECT DISTINCT r.*
            FROM resource r
            LEFT JOIN resource_permissions rp ON r.id = rp.resource_id
            LEFT JOIN user_groups ug ON rp.group_id = ug.group_id
            WHERE r.category_id = ?
            AND (
                r.created_by = ? -- Grant permission if the user is the creator
                OR (
                    r.isPrivate = 0 AND r.status = 'published' -- Public and published
                )
                OR (
                    r.isPrivate = 1 AND (rp.user_id = ? OR ug.user_id = ?) -- Private but user has permission
                )
            )
            ${excludeDeletedClause}
            ${postTypeClause}
            ORDER BY r.created_at DESC;
        `;

        // Add postType to the parameters only if it's not -1
        const params = [categoryId, userId, userId, userId];
        if (postType !== -1) {
            params.push(postType);
        }

        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};





const getAllResourceTypeNames = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM resource_type_name`, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};



const getResourceById = (id) => {
  return new Promise((resolve, reject) => {
    // Assuming 'db' is your database connection object
    const query = `SELECT * FROM resource WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row) {
        console.log('Resource found:', row);
        resolve(row);
      } else {
        console.log('Resource not found');
        resolve(null); // Resolve with null if no resource is found
      }
    });
  });
};

const updateResource = (id, updates) => {
    return new Promise((resolve, reject) => {
        // Constructing SQL query dynamically based on provided updates
        const setParts = [];
        const params = [];
        for (const [key, value] of Object.entries(updates)) {
            setParts.push(`${key} = ?`);
            params.push(value);
        }
        const sql = `UPDATE resource SET ${setParts.join(', ')} WHERE id = ?`;
        params.push(id); // Adding the ID to the parameters array for the WHERE clause

        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(`Resource with ID ${id} updated.`);
            resolve(this.changes); // Resolve with the number of changed rows
        });
    });
};

/** RESOURCE LAST UPDATED */


const createResourceLastUpdatedTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS resource_last_updated (
            resource_id INTEGER UNIQUE,
            last_updated DATETIME
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Last Updated table created.');
            resolve();
        });
    });
};

// Method to insert or update a resource's last updated time
const setLastUpdated = (resourceId, dateTime) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO resource_last_updated (resource_id, last_updated) VALUES (?, ?)
                ON CONFLICT(resource_id) DO UPDATE SET last_updated = ?`,
               [resourceId, dateTime, dateTime], (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Inserted/Updated last updated time for resource ID:', resourceId);
            resolve();
        });
    });
};

// Method to get the last updated time for a resource
const getLastUpdated = (resourceId) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT last_updated FROM resource_last_updated WHERE resource_id = ?`, [resourceId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                console.log('Last Updated:', row.last_updated);
                resolve(row.last_updated);
            } else {
                console.log('No record found for this resource ID.');
                resolve(null);
            }
        });
    });
};

const checkIfDateTimeMatches = (resourceId, dateTime) => {
    return new Promise((resolve, reject) => {
        getLastUpdated(resourceId).then(lastUpdated => {
            if (lastUpdated === dateTime) {
                console.log('DateTime matches the last updated record.');
                resolve(true);
            } else {
                console.log('DateTime does not match the last updated record.');
                resolve(false);
            }
        }).catch(err => {
            reject(err);
        });
    });
};




module.exports = {
    createResourceTable,
    createResourceTypeNameTable,
    createResourceTypeTable,
    createResourceLastUpdatedTable,
    insertResourceTypeName,
    updateResourceTypeName,
    createRatingTable,
    createResourceCommentsTable,
    createSavedResourcesTable,
    getResourcesByCategory,
    insertComment, countCommentsForResource, getCommentsForResource,
    getResourcesByCategoryWithPermissions,
    getAllResourceTypeNames, getResourceById, updateResource,

    setLastUpdated,
    getLastUpdated,
    checkIfDateTimeMatches,
    conditionalDeleteComment
    


}