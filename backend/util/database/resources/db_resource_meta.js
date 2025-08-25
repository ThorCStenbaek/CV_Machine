const { db } = require('./../database_core');
const { defaultCallback } = require('../../callbacks/default_callback');

/*
CreateResourceMetaTable
ID, 
resource_id, 
order int, 
instruction, 

OR

CreateResourceMetaTable
ID int, 
resource_id int, 
order int, 
html_element string, 
number_of_children int, 
specific_style (string or byte),
classes (string or byte), 

MakeReource -> 
get all resource_id,
order by order_int,


Resource Structure:

Container(IntNumberOfChildren, [Style], [classes])


*/ 
//Creating resource meta Table. 
const createResourceMetaTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS resource_meta (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            resource_id INTEGER REFERENCES resource(id),
            fileID INTEGER REFERENCES files(ID),  
            ordering INTEGER NOT NULL,
            html_element TEXT NOT NULL,
            number_of_children INTEGER DEFAULT 0,
            specific_style TEXT,
            content_type TEXT,
            content_data TEXT,
            instruction TEXT,
            depth INTEGER NOT NULL,
            rules TEXT
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Meta table created.');
            resolve();
        });
    });
}






// Create the resource_classes_names table
const createResourceClassesNamesTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS resource_classes_names (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Classes Names table created.');
            resolve();
        });
    });
}

// Create the resource_classes table
const createResourceClassesTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS resource_classes (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            resource_id INTEGER REFERENCES resource(id),
            class_id INTEGER REFERENCES resource_classes_names(id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Classes table created.');
            resolve();
        });
    });
}






const getResourceMetaByResourceId = (resourceId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT rm.*, rcn.name AS class_name, f.Type, f.filetype, f.isOriginal, f.path, f.filename, f.isPrivate
            FROM resource_meta rm
            LEFT JOIN resource_classes rc ON rm.resource_id = rc.resource_id
            LEFT JOIN resource_classes_names rcn ON rc.class_id = rcn.id
            LEFT JOIN files f ON rm.fileID = f.ID
            WHERE rm.resource_id = ?
            ORDER BY rm.ordering ASC`;

        db.all(sql, [resourceId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            
            // JSONify content_data and rules for each meta
            const processedRows = rows.map(row => {
                try {
                    if (row.content_data && typeof row.content_data === 'string') {
                        row.content_data = JSON.parse(row.content_data);
                    }
                    if (row.rules && typeof row.rules === 'string') {
                        row.rules = JSON.parse(row.rules);
                    }
                } catch (e) {
                    console.error('Error parsing JSON for resource meta:', e);
                }
                return row;
            });
            
            resolve(processedRows);
        });
    });
}





const insertNewResource = async (category_id, created_by, title, description, post_type, typeName, metaInfo, classNames, status="draft", isPrivate, editor_used=3) => {
    try {
        // Insert into resource table
        let result = await new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO resource (
                    category_id, 
                    created_by, 
                    title, 
                    description, 
                    post_type, 
                    status,        
                    isPrivate,
                    editor_used      
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?,?)  
            `;
            db.run(sql,
                [category_id, created_by, title, description, post_type, status, isPrivate, editor_used], // New variables added here
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);  // return the ID of the newly inserted resource
                });
        });


        const resourceId = result;

        // Insert into resource_type_name table

        // Insert or get type ID from resource_type_name table
        /* Redundant and not needed.
        let typeId = await new Promise((resolve, reject) => {
            db.run(`INSERT OR IGNORE INTO resource_type_name (name) VALUES (?)`, [typeName], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        // If the type name didn't exist and wasn't inserted, fetch its ID
        if (!typeId) {
            typeId = await new Promise((resolve, reject) => {
                db.get(`SELECT id FROM resource_type_name WHERE name = ?`, [typeName], (err, row) => {
                    if (err) reject(err);
                    else resolve(row.id);
                });
            });
        }
            */
        // Insert into resource_type table
        /*
        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO resource_type (post_type, type_id) VALUES (?, ?)`, [post_type, typeId], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
        */
        // Insert into resource_meta table
       let order = 0; // Assuming you have initialized the order variable somewhere above
        for (let meta of metaInfo) {
            order++;
            console.log(meta);
            await new Promise((resolve, reject) => {
                db.run(`INSERT INTO resource_meta (resource_id, fileID, ordering, html_element, number_of_children, specific_style, content_type, content_data, instruction,depth, rules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
                    [resourceId, meta.fileID, order, meta.html_element, meta.number_of_children, meta.specific_style, meta.content_type, JSON.stringify(meta.content_data), meta.instruction || null, meta.depth, JSON.stringify(meta.rules)], function(err) {
                        if (err) reject(err);
                        else resolve();
                    });
            });
        }


        // Insert class names and relations
        for (let className of classNames) {
            // Insert into resource_classes_names and get the class id
            let classId = await new Promise((resolve, reject) => {
                db.run(`INSERT OR IGNORE INTO resource_classes_names (name) VALUES (?)`, [className], function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });

            // Insert into resource_classes
            await new Promise((resolve, reject) => {
                db.run(`INSERT INTO resource_classes (resource_id, class_id) VALUES (?, ?)`,
                    [resourceId, classId], function(err) {
                        if (err) reject(err);
                        else resolve();
                    });
            });
        }

        console.log('Resource and associated data inserted successfully.');
        return resourceId;

    } catch (error) {
        console.error('Error inserting resource:', error);
        throw error;
    }
}

//insertNewResource(1, 1, 'Resource Title', 'Description', 1, 'TypeName', metaInfoArray, classNamesArray, 'Some instruction');

const removeResourceMetaByResourceId = (resourceId) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM resource_meta WHERE resource_id = ?`;
        db.run(sql, [resourceId], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(`Removed resource_meta entries for resource_id ${resourceId}`);
            resolve(this.changes); // Resolves with the number of rows deleted
        });
    });
};



const insertResourceMetaRows = (resourceId, metaRows) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO resource_meta (resource_id, fileID, ordering, html_element, number_of_children, specific_style, content_type, content_data, instruction,depth, rules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

        let order = 0;
        const insertPromises = metaRows.map(row =>
            new Promise((resolve, reject) => {
                // Convert content_data and rules to string if they are objects
                const contentData = typeof row.content_data === 'object' ? JSON.stringify(row.content_data) : row.content_data;
                const rules = typeof row.rules === 'object' ? JSON.stringify(row.rules) : row.rules;
                
                db.run(sql, [resourceId, row.fileID, order++, row.html_element, row.number_of_children, row.specific_style, row.content_type, contentData, row.instruction, row.depth, rules], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID); // Resolves with the last inserted row ID
                });
            })
        );

        Promise.all(insertPromises)
            .then(results => {
                console.log(`Inserted ${results.length} resource_meta entries for resource_id ${resourceId}`);
                resolve(results); // Resolves with an array of the last inserted row IDs for each insert operation
            })
            .catch(reject);
    });
};




module.exports = {
createResourceMetaTable,
createResourceClassesNamesTable,
createResourceClassesTable,
insertNewResource,
getResourceMetaByResourceId,
    removeResourceMetaByResourceId,
    insertResourceMetaRows




}