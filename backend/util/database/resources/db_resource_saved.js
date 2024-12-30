const { db } = require('./../database_core');
const { defaultCallback } = require('../../callbacks/default_callback');



const createSavedResourcesTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS saved_resources (
            id INTEGER PRIMARY KEY,
            created_by INTEGER REFERENCES users(id),
            resource_id INTEGER REFERENCES resource(id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Saved Resources table created.');
            resolve();
        });
    });
}
//SOMETHING IS DEFINITELY WRONG HERE.....?????
const saveResourceForUser = (userId, resourceId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO saved_resources (created_by, resource_id) 
            VALUES (?, ?)
        `;

        db.run(sql, [userId, resourceId], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(`Resource ${resourceId} saved successfully.`);
            resolve(this.lastID);  // return the ID of the newly saved resource record
        });
    });
};

const hasUserSavedResource = (userId, resourceId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT COUNT(*) as count 
            FROM saved_resources 
            WHERE created_by = ? AND resource_id = ?
        `;

        db.get(sql, [userId, resourceId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            // If the count is greater than 0, it means the user has saved the resource.
            resolve(row.count > 0);
        });
    });
};








module.exports = {
    createSavedResourcesTable,
    saveResourceForUser,
    hasUserSavedResource,
  


}