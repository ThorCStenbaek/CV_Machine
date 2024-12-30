const { db } = require('./database_core');
const { defaultCallback } = require('../callbacks/default_callback');


const createGroupsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS groups (
            id INTEGER PRIMARY KEY, 
            name TEXT NOT NULL UNIQUE
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Groups table created.');
            resolve();
        });
    });
};

const createUserGroupsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS user_groups (
            user_id INTEGER REFERENCES users(id),
            group_id INTEGER REFERENCES groups(id),
            PRIMARY KEY (user_id, group_id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('User Groups table created.');
            resolve();
        });
    });
};


const createParentGroupsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS parent_groups (
            user_id INTEGER REFERENCES users(id),
            group_id INTEGER REFERENCES groups(id),
            PRIMARY KEY (user_id, group_id)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('User Groups table created.');
            resolve();
        });
    });
};




const insertGroup = (groupName) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO groups (name) VALUES (?)`;

        db.run(sql, [groupName], function(err) {
            if (err) {
                console.error('Error inserting group:', err);
                reject(err);
            } else {
                console.log('Group inserted with ID:', this.lastID);
                resolve(this.lastID);
            }
        });
    });
};


const insertUserToGroup = (userId, groupId) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)`;

        db.run(sql, [userId, groupId], function(err) {
            if (err) {
                console.error('Error inserting user to group:', err);
                reject(err);
            } else {
                console.log(`User with ID ${userId} added to group with ID ${groupId}.`);
                resolve(`User ${userId} added to group ${groupId}`);
            }
        });
    });
};

const addUserToGroupByName = (userId, groupName) => {
    return new Promise((resolve, reject) => {
        // First, fetch the group ID based on the groupName
        const sql = `SELECT id FROM groups WHERE name = ?`;

        db.get(sql, [groupName], (err, row) => {
            if (err) {
                console.error('Error fetching group ID:', err);
                reject(err);
                return;
            }

            if (!row) {
                reject(new Error(`Group with name ${groupName} not found`));
                return;
            }

            const groupId = row.id;

            // Now, call the insertUserToGroup function with userId and groupId
            insertUserToGroup(userId, groupId)
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    });
};



const getAllGroupsAndUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                g.id AS group_id, g.name AS group_name,
                u.id AS user_id, u.username, u.firstname, u.lastname
            FROM groups g
            LEFT JOIN user_groups ug ON g.id = ug.group_id
            LEFT JOIN users u ON ug.user_id = u.id;
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const groupsMap = new Map();
            rows.forEach(row => {
                if (!groupsMap.has(row.group_id)) {
                    groupsMap.set(row.group_id, {
                        groupId: row.group_id,
                        groupName: row.group_name,
                        users: []
                    });
                }
                
                if (row.user_id) {
                    groupsMap.get(row.group_id).users.push({
                        userId: row.user_id,
                        username: row.username,
                        firstname: row.firstname,
                        lastname: row.lastname
                    });
                }
            });

            // Convert map values to an array
            const allGroupsDetails = Array.from(groupsMap.values());
            resolve(allGroupsDetails);
        });
    });
};



const removeUserFromGroup = (userId, groupId) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM user_groups WHERE user_id = ? AND group_id = ?`;

        db.run(sql, [userId, groupId], function(err) {
            if (err) {
                console.error('Error removing user from group:', err);
                reject(err);
            } else {
                console.log(`User with ID ${userId} removed from group with ID ${groupId}.`);
                resolve(`User ${userId} removed from group ${groupId}`);
            }
        });
    });
};

const removeMultipleUsersFromGroups = (userIds, groupIds) => {
    return new Promise((resolve, reject) => {
        // Check if the provided arguments are arrays and are not empty
        if (!Array.isArray(userIds) || !userIds.length || !Array.isArray(groupIds) || !groupIds.length) {
            reject(new Error('Both userIds and groupIds should be non-empty arrays.'));
            return;
        }

        const placeholdersUsers = userIds.map(() => '?').join(',');
        const placeholdersGroups = groupIds.map(() => '?').join(',');

        const sql = `DELETE FROM user_groups WHERE user_id IN (${placeholdersUsers}) AND group_id IN (${placeholdersGroups})`;

        db.run(sql, [...userIds, ...groupIds], function(err) {
            if (err) {
                console.error('Error removing users from groups:', err);
                reject(err);
            } else {
                console.log(`${this.changes} entries removed.`);
                resolve(`${this.changes} entries removed.`);
            }
        });
    });
};


const getUserGroups = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT g.id, g.name 
            FROM groups g
            INNER JOIN user_groups ug ON g.id = ug.group_id
            WHERE ug.user_id = ?
        `;

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};


module.exports = {
    createGroupsTable,
    createUserGroupsTable,
    createParentGroupsTable,
    insertGroup,
    insertUserToGroup,
    addUserToGroupByName,
    getAllGroupsAndUsers,
    removeUserFromGroup,
    removeMultipleUsersFromGroups,
    getUserGroups,
    
}