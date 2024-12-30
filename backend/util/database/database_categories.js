
const { db } = require('./database_core');
const { defaultCallback } = require('../callbacks/default_callback');
const {getResourcesByCategory, getResourcesByCategoryWithPermissions,insertResourceTypeName} =require('./resources/db_resources')
const {countCommentsForResource} =require('./resources/db_resource_comments')
const { getRatingsForResource } = require('./resources/db_resource_ratings')
const {hasUserSavedResource } = require('./resources/db_resource_saved')
const {getUserFullName } = require('./database_user')
const {getFileCategoryAssociations} = require('./database_file_categories')
const {enrichResources} =require('./resources/db_resource_enrichment')

const createCategoryTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS category (
            ID INTEGER PRIMARY KEY, 
            Name TEXT NOT NULL, 
            description TEXT, 
            created_by INTEGER REFERENCES users(id), 
            created_at_date DATE NOT NULL DEFAULT CURRENT_DATE, 
            created_at_time TIME NOT NULL DEFAULT CURRENT_TIME,
            sub_category_of INTEGER REFERENCES category(ID)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Category table created.');
            resolve();
        });
    });
}

const createAllowedCategoriesTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS AllowedCategories (
            categoryID INTEGER REFERENCES category(ID),
            post_type INTEGER REFERENCES resource(post_type),
            UNIQUE(categoryID, post_type)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('AllowedCategories table created.');
            resolve();
        });
    });
}


const getPostTypesByCategory = (categoryID) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT post_type FROM AllowedCategories WHERE categoryID = ?`;

        db.all(sql, [categoryID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const postTypes = rows.map(row => row.post_type);
            resolve(postTypes);
        });
    });
}



const createFileCategoryTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS file_category (
            file_id INTEGER REFERENCES files(ID),
            category_id INTEGER REFERENCES category(ID),
            PRIMARY KEY (file_id, category_id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('File-Category table created.');
            resolve();
        });
    });
};


const insertOrUpdateFileCategory = (fileId, categoryId) => {
    return new Promise((resolve, reject) => {
        console.log("inserting or updating file category", fileId, categoryId)
        // Check if the specific fileId and categoryId pair exists
        const checkSql = `SELECT * FROM file_category WHERE file_id = ? AND category_id = ?`;
        db.get(checkSql, [fileId, categoryId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row) {
                // The pair already exists, do nothing
                resolve(`File ID ${fileId} is already linked to Category ID ${categoryId}`);
            } else {
                // The pair does not exist, insert or update
                const deleteSql = `DELETE FROM file_category WHERE file_id  = ? AND category_id = ?`;
                db.run(deleteSql, [fileId, categoryId], (deleteErr) => {
                    if (deleteErr) {
                        reject(deleteErr);
                        return;
                    }

                    const insertSql = `INSERT INTO file_category (file_id, category_id) VALUES (?, ?)`;
                    db.run(insertSql, [fileId, categoryId], (insertErr) => {
                        if (insertErr) {
                            reject(insertErr);
                            return;
                        }
                        resolve(`File ID ${fileId} linked to Category ID ${categoryId}`);
                    });
                });
            }
        });
    });
};

const getFilesByCategoryId = (categoryId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT f.* 
            FROM files f
            INNER JOIN file_category fc ON f.ID = fc.file_id
            WHERE fc.category_id = ?
        `;

        db.all(sql, [categoryId], (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    });
};





const deleteCategoryFromAllowedCategories = (categoryId, callback) => {
    db.run(`DELETE FROM AllowedCategories WHERE categoryID = ?`, [categoryId], function(err) {
        if (err) {
            return callback(err);
        }
        console.log(`Deleted category with ID: ${categoryId} from AllowedCategories`);
        callback(null, this.changes);
    });
};



const insertAllowedCategories = (postTypes, categoryIDs) => {
    return new Promise((resolve, reject) => {
        // Begin a transaction
        console.log("tesss", postTypes, categoryIDs)
        db.run("BEGIN TRANSACTION", (err) => {
            if (err) {
                reject(err);
                return;
            }

            // Delete existing entries for the specified postTypes
            const placeholders = postTypes.map(() => '?').join(',');
            db.run(`DELETE FROM AllowedCategories WHERE post_type IN (${placeholders})`, postTypes, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Prepare the SQL statement for insertion
                const stmt = db.prepare("INSERT OR IGNORE INTO AllowedCategories (categoryID, post_type) VALUES (?, ?)");

                for (const postType of postTypes) {
                    for (const categoryID of categoryIDs) {
                        stmt.run([categoryID, postType], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                        });
                    }
                }

                // Finalize the statement and commit the transaction
                stmt.finalize((err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    db.run("COMMIT", (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        console.log('Data inserted into AllowedCategories table.');
                        resolve();
                    });
                });
            });
        });
    });
}



const insertResourceTypeAndAllowedCategories = (typeName,description, postName, postNamePlural ,categoryIDs) => {
    return new Promise(async (resolve, reject) => {
        if (!categoryIDs || categoryIDs.length === 0) {
            reject(new Error("No categoryIDs provided."));
            return;
        }
        try {
            // Insert the resource type name and get the inserted ID
            const postTypeID = await insertResourceTypeName(typeName,description, postName, postNamePlural);

            // Insert into AllowedCategories using the postTypeID and categoryIDs
            await insertAllowedCategories([postTypeID], categoryIDs);

            console.log('Resource type name and allowed categories inserted successfully.');
            resolve(postTypeID);
        } catch (err) {
            console.error("Error:", err);
            reject(err);
        }
    });
}


const fetchAllCategoriesWithSubCategories = (postType = -1) => {
    return new Promise((resolve, reject) => {
        let sql = `
            WITH RECURSIVE CategoryTree AS (
                SELECT c.ID, c.Name, c.description, c.sub_category_of
                FROM category c
        `;

        // Modify SQL query based on postType
        if (postType !== -1) {
            sql += `
                JOIN AllowedCategories ac ON c.ID = ac.categoryID
                WHERE c.sub_category_of IS NULL AND ac.post_type = ?
            `;
        } else {
            sql += `WHERE c.sub_category_of IS NULL`;
        }

        sql += `
                UNION ALL

                SELECT c.ID, c.Name, c.description, c.sub_category_of
                FROM category c
                JOIN CategoryTree ct ON c.sub_category_of = ct.ID
            )
            SELECT * FROM CategoryTree;
        `;

        const params = postType !== -1 ? [postType] : [];

        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};



const getNestedCategories = async (postType = -1) => {
    try {
        const categories = await fetchAllCategoriesWithSubCategories(postType);
        const idToCategoryMap = {};

        // Create a list of promises for getting post types of each category
                let categoryPromises = categories.map(async category => {
            const postTypes = await getPostTypesByCategory(category.ID);
                    let file = await getFilesByCategoryId(category.ID); // Fetch file paths for the category
                    if (file.length > 0) {
                        const fileCategories = await getFileCategoryAssociations(file[0].ID); // Fetch category associations for the files
                        file[0].categories = fileCategories;
                    }
            idToCategoryMap[category.ID] = { 
                ...category, 
                sub_category_of: category.sub_category_of, 
                allowed_post_types: postTypes,
                file: file // Add file paths to the map
            };
        });
        //You got to here, make sure that the filePath also gets here.

        // Wait for all promises to resolve
        await Promise.all(categoryPromises);

        // Build the nested category structure
        categories.forEach(category => {
            if (category.sub_category_of) {
                if (!idToCategoryMap[category.sub_category_of].sub_categories) {
                    idToCategoryMap[category.sub_category_of].sub_categories = [];
                }
                idToCategoryMap[category.sub_category_of].sub_categories.push(idToCategoryMap[category.ID]);
            }
        });

        const nestedCategories = categories.filter(category => !category.sub_category_of).map(category => idToCategoryMap[category.ID]);

        console.log('Categories fetched and nested successfully.');
        return nestedCategories;
    } catch (err) {
        console.error("Error fetching and nesting categories:", err);
        throw err;
    }
};


const getCategoryIDByName = (name, callback=defaultCallback) => {
    db.get(`SELECT ID FROM category WHERE Name = ?`, [name], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row ? row.ID : null);
    });
}


const insertCategory = (name, description, createdBy, subCategoryOfNameOrId, allowPostTypes = [-1], callback=defaultCallback) => {
    // If subCategoryOf is a string, fetch the corresponding ID
    if (typeof subCategoryOfNameOrId === 'string') {
        console.log(name, description, createdBy, subCategoryOfNameOrId, allowPostTypes)
        getCategoryIDByName(subCategoryOfNameOrId, (err, id) => {
            if (err) {
                callback(err);
                return;
            }
            // Call the insert function with the fetched ID
            doInsert(name, description, createdBy, id, allowPostTypes, callback);
        });
    } else {

        
        // If subCategoryOf is already an ID, directly call the insert function
        doInsert(name, description, createdBy, subCategoryOfNameOrId, allowPostTypes, callback);
    }
}

const doInsert = (name, description, createdBy, subCategoryId, allowPostTypes, callback=defaultCallback) => {
    db.run(`INSERT INTO category (Name, description, created_by, sub_category_of) VALUES (?, ?, ?, ?)`, 
    [name, description, createdBy, subCategoryId], function(err) {
        if (err) {
            return callback(err);
        }
        console.log(`Category added with ID: ${this.lastID}`);
        
        if (allowPostTypes[0] === -1) {
            // Fetch all post types
            db.all("SELECT id FROM resource_type_name", [], (err, rows) => {
                if (err) {
                    return callback(err);
                }
                const postTypes = rows.map(row => row.id);
                insertAllowedCategories(postTypes, [this.lastID]).then(() => {
                    callback(null, this.lastID);
                }).catch(callback);
            });
        } else {
            insertAllowedCategories(allowPostTypes, [this.lastID]).then(() => {
                callback(null, this.lastID);
            }).catch(callback);
        }
    });
}



const updateCategory = (id, newName, newDescription, newSubCategoryOfNameOrId,postTypes, callback=defaultCallback) => {
    // If newSubCategoryOf is a string, fetch the corresponding ID

        // If newSubCategoryOf is already an ID, directly call the update function
        doUpdate(id, newName, newDescription, newSubCategoryOfNameOrId, callback = defaultCallback);
        updateAllowedCategories(id, postTypes)
    
}

const doUpdate = (id, newName, newDescription, newSubCategoryId, callback=defaultCallback) => {
    db.run(`UPDATE category SET Name = ?, description = ?, sub_category_of = ? WHERE ID = ?`, 
    [newName, newDescription, newSubCategoryId, id], function(err) {
        if (err) {
            return callback(err);
        }
        console.log(`Updated ${this.changes} row(s) in category`);
        callback(null, this.changes);
    });
}


const deleteCategory = (toBeDeleted, newParent, callback = defaultCallback) => {
    let toBeDeletedId;

    determineId(toBeDeleted, (err, id) => {
        if (err) {
            return callback(err);
        }

        toBeDeletedId = id;

        const handleDeletion = () => {
            deleteCategoryFromAllowedCategories(toBeDeletedId, (err) => {
                if (err) {
                    return callback(err);
                }
                proceedWithDeletion();
            });
        };

        if (newParent) {
            determineId(newParent, (err, newParentId) => {
                if (err) {
                    return callback(err);
                }
                // Reassign sub_category_of
                reassignSubCategories(toBeDeletedId, newParentId, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    handleDeletion();
                });
            });
        } else {
            // If newParent is empty, set sub_category_of to NULL
            reassignSubCategories(toBeDeletedId, null, (err) => {
                if (err) {
                    return callback(err);
                }
                handleDeletion();
            });
        }
    });

    function proceedWithDeletion() {
        // Delete the category
        db.run(`DELETE FROM category WHERE ID = ?`, [toBeDeletedId], function(err) {
            if (err) {
                return callback(err);
            }
            console.log(`Deleted category with ID: ${toBeDeletedId}`);
            callback(null, this.changes);
        });
    }
};



const determineId = (input, callback=defaultCallback) => {
    // If input is a string, fetch the corresponding ID
    if (typeof input === 'string') {
        getCategoryIDByName(input, callback);
    } else {
        callback(null, input);
    }
};

const reassignSubCategories = (toBeDeletedId, newParentId, callback=defaultCallback) => {
    db.run(`UPDATE category SET sub_category_of = ? WHERE sub_category_of = ?`, 
    [newParentId, toBeDeletedId], function(err) {
        if (err) {
            return callback(err);
        }
        console.log(`Reassigned ${this.changes} sub-categories`);
        callback(null, this.changes);
    });
};


const unfoldCategories = (categoryIdentifier, userId,  postType = -1, callback = defaultCallback) => {
    console.log("finding..." + categoryIdentifier);

    // Helper function to fetch resources for a category and enrich them with additional details
    const fetchAndEnrichResourcesForCategory = async (categoryId) => {
    try {
        const resources = await getResourcesByCategoryWithPermissions(categoryId, userId, postType);
        
        // Use the enrichResources function to fetch additional details for the resources in the category
        const enrichedCategoryResources = await enrichResources(resources, userId);
        return enrichedCategoryResources;
    } catch (err) {
        throw err;
    }
};


    // Helper function to fetch categories based on parent ID
    const fetchCategories = async (parentId, postType) => {
    const values = [];
    let query = `SELECT * FROM category `;
    if (postType !== -1) {
        query += `JOIN AllowedCategories ac ON category.ID = ac.categoryID WHERE ac.post_type = ? `;
        if (parentId) query += `AND sub_category_of = ?`;
        else {
            query += `AND sub_category_of IS NULL`;
        }
        values.unshift(postType);
    } else if (parentId) {
        query += `WHERE sub_category_of = ?`;
    } else {
        query += `WHERE sub_category_of IS NULL`;
    }
    if (parentId) values.push(parentId);

    try {
        const categories = await new Promise((resolve, reject) => {
            db.all(query, values, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        // Enrich each category with its subcategories and resources
        const enrichedCategories = await Promise.all(categories.map(async category => {
            const subcategories = await fetchCategories(category.ID, postType);
            const resources = await fetchAndEnrichResourcesForCategory(category.ID);
            const file = await getFilesByCategoryId(category.ID); // Fetch file paths for the category
            return {
                ...category,
                subcategories: subcategories,
                resources: resources,
                file: file
            };
        }));
        return enrichedCategories;
    } catch (err) {
        throw err;
    }
};

    // Main logic
     (async () => {
        try {
            if (categoryIdentifier) {
                const categoryId = await determineId(categoryIdentifier);
                const mainCategory = await new Promise((resolve, reject) => {
                    db.get(`SELECT * FROM category WHERE ID = ?`, [categoryId], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });
                if (!mainCategory) throw new Error('Category not found.');

                const subcategories = await fetchCategories(mainCategory.ID, postType);
                mainCategory.subcategories = subcategories;
                callback(null, mainCategory);
            } else {
                const topCategories = await fetchCategories(null, postType);
                callback(null, topCategories);
            }
        } catch (err) {
            callback(err);
        }
    })();
};




const getCategoryByName = (categoryName, callback=defaultCallback) => {
    const query = `
        SELECT 
            c1.ID,
            c1.Name,
            c1.description,
            c1.created_by,
            c1.created_at_date,
            c1.created_at_time,
            c2.Name as sub_category_name
        FROM category c1
        LEFT JOIN category c2 ON c1.sub_category_of = c2.ID
        WHERE c1.Name = ?
    `;

    db.get(query, [categoryName], (err, row) => {
        if (err) {
            return callback(err);
        }

        if (row) {
            if (!row.sub_category_name) {
                delete row.sub_category_name; // If there's no parent category, remove the property
            }
            callback(null, row);
        } else {
            callback(new Error(`Category with name ${categoryName} not found.`));
        }
    });
};

const asyncInsertCategory = (name, description, createdBy, subCategoryOfNameOrId) => {
    return new Promise((resolve, reject) => {
        console.log("iNSERTING..  "+ name)
        insertCategory(name, description, createdBy, subCategoryOfNameOrId, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};


const getCategoryIdsForPostType = (postType) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT categoryID 
            FROM AllowedCategories 
            WHERE post_type = ?
        `;

        db.all(query, [postType], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            
            // Extract category IDs from rows
            const categoryIds = rows.map(row => row.categoryID);
            resolve(categoryIds);
        });
    });
}


const updateAllowedCategories = (categoryID, post_types) => {
  return new Promise(async (resolve, reject) => {
    // Start a database transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION;', (err) => {
        if (err) reject(err);
      });

      // Delete existing rows with the given categoryID
      db.run(`DELETE FROM AllowedCategories WHERE categoryID = ?`, [categoryID], (err) => {
        if (err) {
          db.run('ROLLBACK;', (rollbackErr) => {
            if (rollbackErr) reject(rollbackErr);
          });
          reject(err);
          return;
        }

        // Prepare an SQL statement for inserting new rows
        const insertStmt = db.prepare(`INSERT INTO AllowedCategories (categoryID, post_type) VALUES (?, ?)`);

        // Insert new rows for each post_type
        post_types.forEach((post_type, index, array) => {
          insertStmt.run([categoryID, post_type], (err) => {
            if (err) {
              insertStmt.finalize(); // Finalize the statement on error
              db.run('ROLLBACK;', (rollbackErr) => {
                if (rollbackErr) reject(rollbackErr);
              });
              reject(err);
              return;
            }

            // If it's the last post_type, finalize the statement and commit the transaction
            if (index === array.length - 1) {
              insertStmt.finalize();
              db.run('COMMIT;', (commitErr) => {
                if (commitErr) {
                  reject(commitErr);
                  return;
                }
                resolve();
              });
            }
          });
        });
      });
    });
  });
};

module.exports = {
    createCategoryTable,
    insertCategory,
    updateCategory,
    deleteCategory,
    unfoldCategories,
    getCategoryByName,
    asyncInsertCategory,
    createAllowedCategoriesTable,
    insertResourceTypeAndAllowedCategories,
    getNestedCategories,
    getCategoryIdsForPostType,
    insertAllowedCategories,
    doInsert,
    getPostTypesByCategory,
    createFileCategoryTable,
    insertOrUpdateFileCategory,
    getFilesByCategoryId,
    updateAllowedCategories

}