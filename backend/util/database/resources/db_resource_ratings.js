const { db } = require('./../database_core');
const { defaultCallback } = require('./../../callbacks/default_callback');

const {countCommentsForResource} =require('./../resources/db_resource_comments')

const {hasUserSavedResource } = require('./../resources/db_resource_saved')
const {getUserFullName } = require('./../database_user')


const createRatingTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS rating (
            id INTEGER PRIMARY KEY,
            created_by INTEGER REFERENCES users(id),
            resource_id INTEGER REFERENCES resource(id),
            rating INTEGER CHECK(rating >= 1 AND rating <= 5),
            UNIQUE(created_by, resource_id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Rating table created.');
            resolve();
        });
    });
}


const insertRating = (createdBy, resourceId, ratingValue) => {
    return new Promise((resolve, reject) => {
        // Check if the rating value is valid
        if (ratingValue < 1 || ratingValue > 5) {
            reject(new Error('Invalid rating value. Rating should be between 1 and 5.'));
            return;
        }

        // First, query to check if there is already a rating
        const checkSql = `
            SELECT id FROM rating WHERE created_by = ? AND resource_id = ?
        `;

        db.get(checkSql, [createdBy, resourceId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            // If no rating exists, insert
            if (!row) {
                const insertSql = `
                    INSERT INTO rating (created_by, resource_id, rating) 
                    VALUES (?, ?, ?)
                `;

                db.run(insertSql, [createdBy, resourceId, ratingValue], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);  // Return the ID of the newly inserted rating
                });
            } 
            // If a rating already exists, update it
            else {
                const updateSql = `
                    UPDATE rating SET rating = ? WHERE created_by = ? AND resource_id = ?
                `;

                db.run(updateSql, [ratingValue, createdBy, resourceId], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row.id);  // Return the ID of the updated rating
                });
            }
        });
    });
};


const getRatingsForResource = (resourceId, userId) => {
    return new Promise((resolve, reject) => {
        // 1. Fetch all ratings for the resource
        console.log(resourceId)
        const allRatingsSql = `
            SELECT rating 
            FROM rating 
            WHERE resource_id = ?
        `;
        
        db.all(allRatingsSql, [resourceId], (err, allRatings) => {
            if (err) {
                reject(err);
                return;
            }
            //console.log("rates: ",allRatings)
            // Calculate the mean of all ratings
            const totalRatings = allRatings.reduce((acc, current) => acc + current.rating, 0);
            const meanRating = allRatings.length ? totalRatings / allRatings.length : 0;

            // 2. Fetch the specific rating given by the user
            const userRatingSql = `
                SELECT rating 
                FROM rating 
                WHERE resource_id = ? AND created_by = ?
            `;

            db.get(userRatingSql, [resourceId, userId], (err, userRatingRow) => {
                if (err) {
                    reject(err);
                    return;
                }

                const userRating = userRatingRow ? userRatingRow.rating : null;

                // Return the mean rating, the user's rating, and the total number of users who rated
                resolve({
                    meanRating: meanRating,
                    userRating: userRating,
                    totalUsersRated: allRatings.length
                });
            });
        });
    });
};


const getAllRatings = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM rating`;
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
    createRatingTable,
    insertRating, 
    getRatingsForResource, 
    getAllRatings
   


}