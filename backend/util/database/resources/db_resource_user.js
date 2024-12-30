const { db } = require('./../database_core');
const { defaultCallback } = require('../../callbacks/default_callback');
const { countCommentsForResource } = require('./../resources/db_resource_comments')

const {hasUserSavedResource } = require('./../resources/db_resource_saved')
const {getUserFullName } = require('./../database_user')
const {getRatingsForResource} =require('./../resources/db_resource_ratings')
const {enrichResources} =require('./db_resource_enrichment')
const {getUserDetails} =require('./../database_user')
const {getResourceTypeById} =require('./db_resource_enrichment')


const getUserSavedResources = async (userId, start = 0, numberOfSaved = 10) => {
    return new Promise(async (resolve, reject) => {
        // Determine the limit clause depending on the numberOfSaved parameter
        const limitClause = numberOfSaved === -1 ? "" : `LIMIT ? OFFSET ?`;

        // This query fetches all or specific number of saved resources for a specific user
        const query = `
            SELECT sr.*, res.* 
            FROM saved_resources sr
            JOIN resource res ON sr.resource_id = res.id
            WHERE sr.created_by = ? AND res.status ='published'
            ${limitClause};
        `;

        // Prepare the parameters for the query
        const queryParams = numberOfSaved === -1 ? [userId] : [userId, numberOfSaved, start];

        db.all(query, queryParams, async (err, savedResources) => {
            if (err) {
                reject(err);
                return;
            }

            // Use the enrichResources function to fetch additional details for the resources
            try {
                const enrichedSavedResources = await enrichResources(savedResources, userId);
                resolve(enrichedSavedResources);
            } catch (error) {
                console.error('Error fetching and enriching saved resources:', error);
                reject(error);
            }
        });
    });
};




const getUserRatings = (userId, start = 0, numberOfRatings = 10) => {
    return new Promise((resolve, reject) => {
        console.log("Retrieving resources based on user ratings...");

        // Helper function to fetch resources for a user rating and enrich them with additional details
        const fetchAndEnrichResourcesForUser = async (userId) => {
            try {
                // This query fetches 'numberOfRatings' ratings made by the user, starting from the (start + 1)th rating
                const query = `
                    SELECT r.*, res.* 
                    FROM rating r
                    JOIN resource res ON r.resource_id = res.id
                    WHERE r.created_by = ? AND res.status='published'
                    ORDER BY r.id 
                    LIMIT ? OFFSET ?;
                `;

                const userRatings = await new Promise((res, rej) => {
                    db.all(query, [userId, numberOfRatings, start], (err, rows) => {
                        if (err) {
                            rej(err);
                        } else {
                            res(rows);
                        }
                    });
                });

                // Use the enrichResources function to fetch additional details for the ratings
                const enrichedRatings = await enrichResources(userRatings, userId);
                return enrichedRatings;
                
            } catch (err) {
                throw err;
            }
        };

        // Fetch and enrich resources, then resolve the promise
        fetchAndEnrichResourcesForUser(userId)
            .then(enrichedRatings => {
                resolve(enrichedRatings);
            })
            .catch(err => {
                console.error('Error fetching and enriching resources:', err);
                reject(err);
            });
    });
};



const getPostTypeById = (id) => {
  return new Promise((resolve, reject) => {
    // Prepare the SQL query to select the post_type of a resource by its id
    const sql = 'SELECT post_type FROM resource WHERE id = ?';

    // Execute the query
    db.get(sql, [id], (err, row) => {
      if (err) {
        // If there's an error executing the query, reject the promise
        reject(err);
        return;
      }
      if (row) {
        // If a row is found, resolve the promise with the post_type
        resolve(row.post_type);
      } else {
        // If no row is found (invalid id), you could resolve with null or reject
        resolve(null); // or reject(new Error('Resource not found'));
      }
    });
  });
};




const getUserComments = (userId, start = 0, numberOfComments = 10) => {
    return new Promise((resolve, reject) => {
        // Determine the limit clause based on numberOfComments
        let limitClause = numberOfComments === -1 ? "" : `LIMIT ? OFFSET ?`;

        // This query fetches 'numberOfComments' comments made by the user, starting from the (start + 1)th comment
        // If numberOfComments is -1, it fetches all comments
        const query = `
            SELECT c.id, c.created_by, c.comment_text, c.reply_to, c.resource_id, c.created_at, r.title, r.description, r.created_by AS authorID
            FROM resource_comments c
            JOIN resource r ON c.resource_id = r.id
            WHERE c.created_by = ? 
            ORDER BY c.created_at DESC
            ${limitClause};
        `;

        // If numberOfComments is -1, we fetch all comments, else we fetch 'numberOfComments' comments starting from 'start'
        const queryParams = numberOfComments === -1 ? [userId] : [userId, numberOfComments, start];

        db.all(query, queryParams, async (err, comments) => {
            if (err) {
                reject(err);
                return;
            }

            // Function to get user details
            

            // Now, for each comment, we want to fetch the parent comment, up to 3 replies, and user details if they exist
              let detailedComments = await Promise.all(comments.map(async comment => {
                  let userDetails = await getUserDetails(comment.created_by);
                  let authorDetails = await getUserDetails(comment.authorID);
                  let postID= await getPostTypeById(comment.resource_id)
                  let postType = await  getResourceTypeById(postID);
                  authorDetails.id = comment.authorID;
                return {
                    ...comment,
                    ...userDetails,
                    authorDetails: authorDetails,
                    postTypeInformation: postType,// Spread user details into the comment object
                    // other user-related fields like email, color, roleID, roleName should also be added here
                }; }));

            // Resolve the promise with our array of detailed comments
           const buildCommentsTree = (comments) => {
                const commentsById = {};
                const rootComments = [];

                // Map all comments by their ID for easy lookup and add user details to each comment
                comments.forEach(comment => {
                    commentsById[comment.id] = {...comment, reply_of_children: []};
                });

                // Construct the tree by assigning children to their parents
                comments.forEach(comment => {
                    if (comment.reply_to && commentsById[comment.reply_to]) {
                        commentsById[comment.reply_to].reply_of_children.push(commentsById[comment.id]);
                    } else {
                        // It's a root comment since it doesn't have a reply_to or the reply_to is not in the list
                        rootComments.push(commentsById[comment.id]);
                    }
                });

                // Sort the replies (if needed)
                Object.values(commentsById).forEach(comment => {
                    comment.reply_of_children.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                });

                return rootComments;
            };

            // Construct the tree structure from the detailed comments list
            const commentsTree = buildCommentsTree(detailedComments);

            // Resolve the promise with our tree of comments
            resolve(commentsTree);
        });
    });
};


const getUserResources = async (userId, status = "published", start = 0, numberOfResources = 10) => {
    return new Promise(async (resolve, reject) => {
        console.log("Retrieving resources based on user's creation...");

        // Helper function to fetch resources created by a user and enrich them with additional details
        const fetchAndEnrichResourcesForUser = async (userId) => {
            try {
                // Determine the limit clause based on numberOfResources
                let limitClause = numberOfResources === -1 ? "" : `LIMIT ? OFFSET ?`;

                // This query fetches 'numberOfResources' resources created by the user, starting from the (start + 1)th resource
                const query = `
                    SELECT r.*, u.username, u.firstname, u.lastname
                    FROM resource r
                    JOIN users u ON r.created_by = u.id
                    WHERE r.created_by = ? AND r.status = ?
                    ORDER BY r.created_at DESC
                    ${limitClause};
                `;

                // Adjust queryParams to include the status
                const queryParams = numberOfResources === -1 ? [userId, status] : [userId, status, numberOfResources, start];

                const userResources = await new Promise((res, rej) => {
                    db.all(query, queryParams, (err, rows) => {
                        if (err) {
                            rej(err);
                        } else {
                            res(rows);
                        }
                    });
                });

                // Use the enrichResources function to fetch additional details for the user's resources
                const enrichedUserResources = await enrichResources(userResources, userId);
                return enrichedUserResources;
                
            } catch (err) {
                throw err;
            }
        };

        // Fetch and enrich resources, then resolve the promise
        fetchAndEnrichResourcesForUser(userId)
            .then(enrichedResources => {
                resolve(enrichedResources);
            })
            .catch(err => {
                console.error('Error fetching and enriching resources:', err);
                reject(err);
            });
    });
};









module.exports = {
    getUserSavedResources,
    getUserRatings,
    getUserComments,
    getUserResources
}