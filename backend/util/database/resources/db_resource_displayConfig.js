const { db } = require('./../database_core');
const { defaultCallback } = require('../../callbacks/default_callback');

const createPostTypeDisplayConfigTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS post_type_display_config (
            ID INTEGER PRIMARY KEY,
            post_type_id INTEGER NOT NULL,
            key TEXT NOT NULL,
            value BOOLEAN NOT NULL,
            FOREIGN KEY (post_type_id) REFERENCES post_type(id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Post Type Display Config table created.');
            resolve();
        });
    });
};


const updatePostTypeDisplayConfig = (postTypeId, configKeyValuePairs) => {
    return new Promise(async (resolve, reject) => {
        console.log("Display: ", postTypeId, configKeyValuePairs)
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // Delete existing configurations for the post type
            db.run(`DELETE FROM post_type_display_config WHERE post_type_id = ?`, [postTypeId], (err) => {
                if (err) {
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                }
                console.log("configKeyValuePairs", Object.keys(configKeyValuePairs))
                // Insert new configurations
                const insertSQL = `INSERT INTO post_type_display_config (post_type_id, key, value) VALUES (?, ?, ?)`;
                try {
                    Object.keys(configKeyValuePairs).forEach(key=> {
                        db.run(insertSQL, [postTypeId, key, configKeyValuePairs[key]]);
                    });

                    db.run('COMMIT');
                    resolve('Post type display configuration updated successfully.');
                } catch (error) {
                    db.run('ROLLBACK');
                    reject(error);
                }
            });
        });
    });
};




const getDisplayConfigByPostId = (postId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT pdc.key, pdc.value 
            FROM post_type_display_config pdc
            JOIN resource_type_name p ON pdc.post_type_id = p.id 
            WHERE p.id = ?
        `;

        db.all(query, [postId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const displayConfig = rows.reduce((config, row) => {
                // Convert the integer value to boolean
                config[row.key] = row.value === 1;
                return config;
            }, {});

            resolve(displayConfig);
        });
    });
};



module.exports = {
    createPostTypeDisplayConfigTable,
    updatePostTypeDisplayConfig,
    getDisplayConfigByPostId


}