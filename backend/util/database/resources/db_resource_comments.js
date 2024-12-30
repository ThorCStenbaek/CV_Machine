const { db } = require('./../database_core');
const { defaultCallback } = require('../../callbacks/default_callback');

const createResourceCommentsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS resource_comments (
            id INTEGER PRIMARY KEY,
            created_by INTEGER REFERENCES users(id),
            resource_id INTEGER REFERENCES resource(id),
            reply_to INTEGER REFERENCES resource_comments(id) NULL,
            comment_text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Comments table created with created_at column.');
            resolve();
        });
    });
}


const insertComment = (userId, resourceId, commentText, replyTo = null) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO resource_comments (created_by, resource_id, reply_to, comment_text) 
            VALUES (?, ?, ?, ?)
        `;

        db.run(sql, [userId, resourceId, replyTo, commentText], function(err) {
            if (err) {
                reject(err);
                return;
            }
            // Return the ID of the newly inserted comment
            resolve(this.lastID);
        });
    });
};

const countCommentsForResource = (resourceId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT COUNT(*) as commentCount 
            FROM resource_comments 
            WHERE resource_id = ?
        `;

        db.get(sql, [resourceId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.commentCount);
        });
    });
};


const getCommentsForResource = (resourceId) => {
    return new Promise((resolve, reject) => {
        // Modified SQL query to join resource_comments with users, user_colors, user_roles, and user_role_names tables
        const sql = `
            SELECT rc.id, rc.created_by, rc.resource_id, rc.reply_to, rc.comment_text, rc.created_at,
                   u.username, u.firstname, u.lastname, u.email, uc.color,
                   urn.ID as roleID, urn.Name as roleName
            FROM resource_comments rc
            LEFT JOIN users u ON rc.created_by = u.id
            LEFT JOIN user_colors uc ON rc.created_by = uc.userID
            LEFT JOIN user_roles ur ON u.id = ur.User_ID
            LEFT JOIN user_role_names urn ON ur.user_role_names_ID = urn.ID
            WHERE rc.resource_id = ?
            ORDER BY rc.id ASC
        `;

        db.all(sql, [resourceId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            // Convert the flat list of comments into a tree structure
            const buildTree = (parentId) => {
                const children = rows.filter(row => row.reply_to === parentId);
                children.forEach(child => {
                    child.reply_of_children = buildTree(child.id);
                });
                return children;
            };

            // Start building the tree from the root comments (those without a reply_to value)
            const tree = buildTree(null);

            resolve(tree);
        });
    });
};





const deleteComment = (commentId) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM resource_comments WHERE id = ?`;
        
        db.run(sql, [commentId], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes > 0);
        });
    });
};

const conditionalDeleteComment = (commentId) => {
    return new Promise((resolve, reject) => {
        // Check if the comment has any replies
        const checkRepliesSql = `SELECT COUNT(*) as replyCount FROM resource_comments WHERE reply_to = ?`;
        
        db.get(checkRepliesSql, [commentId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row.replyCount > 0) {
                // If there are replies, update the comment text to "deleted"
                const updateSql = `UPDATE resource_comments SET comment_text = 'deleted' WHERE id = ?`;
                
                db.run(updateSql, [commentId], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(true);
                });
            } else {
                // If there are no replies, delete the comment
                deleteComment(commentId).then(resolve).catch(reject);
            }
        });
    });
};





module.exports = {
    createResourceCommentsTable,
    insertComment,
    countCommentsForResource,
    getCommentsForResource,
    deleteComment,
conditionalDeleteComment


}