const { db } = require('./../database_core');
const {getUserFullName} = require('./../database_user');
const {getUserDetails} = require('./../database_user');

const createResourcePermissionsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS resource_permissions (
            id INTEGER PRIMARY KEY,
            resource_id INTEGER REFERENCES resource(id),
            user_id INTEGER REFERENCES users(id),
            group_id INTEGER REFERENCES groups(id),
            access_level TEXT,
            granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            CHECK ((user_id IS NOT NULL) OR (group_id IS NOT NULL))
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Resource Permissions table created.');
            resolve();
        });
    });
};

const insertResourcePermission = (resourceId, userId, groupId, accessLevel) => {
    console.log('Inserting resource permission:', resourceId, userId, groupId, accessLevel);
    return new Promise((resolve, reject) => {
        if (!userId && !groupId) {
            reject(new Error("Either userId or groupId must be provided."));
            return;
        }

        const sql = `
            INSERT INTO resource_permissions (resource_id, user_id, group_id, access_level)
            VALUES (?, ?, ?, ?);
        `;

        db.run(sql, [resourceId, userId, groupId, accessLevel], function(err) {
            if (err) {
                console.error('Error inserting resource permission:', err);
                reject(err);
            } else {
                console.log('Resource permission inserted with ID:', this.lastID);
                resolve(this.lastID);
            }
        });
    });
};

const getResourcePermissions = (resourceId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT user_id, group_id
            FROM resource_permissions
            WHERE resource_id = ?
        `;

        db.all(sql, [resourceId], (err, rows) => {
            if (err) {
                console.error('Error fetching permissions for resource:', err);
                reject(err);
                return;
            }

            // Split the rows into two arrays: user IDs and group IDs
            const userIds = rows.filter(row => row.user_id !== null).map(row => row.user_id);
            const groupIds = rows.filter(row => row.group_id !== null).map(row => row.group_id);

            resolve({
                userIds: userIds,
                groupIds: groupIds
            });
        });
    });
};


const getResourceAssociations = async (resourceId) => {
    try {
        // 1. Get permissions for the resource
        const permissions = await getResourcePermissions(resourceId);

        // 2. Prepare the users' data
        const permissionUsers = [];
        for (let userId of permissions.userIds) {
            const userDetails = await getUserDetails(userId);
            if (userDetails) {
                permissionUsers.push({
                    id: userId,
                    firstName: userDetails.firstname,
                    lastName: userDetails.lastname,
                    username: userDetails.username,
                    email: userDetails.email
                });
            }
        }

        // 3. Prepare the groups' data
        const permissionGroups = [];
        for (let groupId of permissions.groupIds) {
            // Get the group name
            const groupName = await new Promise((resolve, reject) => {
                const sql = `SELECT name FROM groups WHERE id = ?`;
                db.get(sql, [groupId], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row ? row.name : null);
                });
            });

            // Get users associated with this group
            const groupUsers = await new Promise((resolve, reject) => {
                const sql = `
                    SELECT u.id, u.username, u.email, u.firstname, u.lastname
                    FROM users u
                    JOIN user_groups ug ON u.id = ug.user_id
                    WHERE ug.group_id = ?
                `;
                db.all(sql, [groupId], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows.map(row => ({
                        id: row.id,
                        username: row.username,      // Include the username
                        email: row.email,            // Include the email
                        firstName: row.firstname,
                        lastName: row.lastname
                    })));
                });
            });


            permissionGroups.push({
                groupId: groupId,
                groupName: groupName,
                users: groupUsers
            });
        }

        return {
            permissionUsers: permissionUsers,
            permissionGroups: permissionGroups
        };

    } catch (err) {
        console.error('Error fetching resource associations:', err);
        throw err;
    }
};


const removeUserResourcePermission = (userId, resourceId) => {

     console.log('REMOVING resource permission:', resourceId, userId);
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM resource_permissions WHERE user_id = ? AND resource_id = ?`;

        db.run(sql, [userId, resourceId], function(err) {
            if (err) {
                reject(err);
                return;
            }
            if (this.changes > 0) {
                console.log(`Permission for user_id ${userId} and resource_id ${resourceId} removed.`);
                resolve(true);
            } else {
                console.log(`No permission found for user_id ${userId} and resource_id ${resourceId}.`);
                resolve(false);
            }
        });
    });
}




module.exports = {
    createResourcePermissionsTable,
    insertResourcePermission,
    getResourcePermissions,
    getResourceAssociations,
    removeUserResourcePermission
}