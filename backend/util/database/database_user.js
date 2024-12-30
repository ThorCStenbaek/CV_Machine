const bcrypt = require('bcrypt');
const { db } = require('./database_core');
const { defaultCallback } = require('../callbacks/default_callback');

// Create a new database file or connect to an existing one

/* USER USER USER USER USER USER USER */

/*TABLES TABLES TABLES */
const createUserTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY, 
            username TEXT NOT NULL UNIQUE, 
            email TEXT UNIQUE, 
            firstname TEXT, 
            lastname TEXT, 
            hashedPassword TEXT NOT NULL
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Table created.');
            resolve();
        });
    });
}

const createUserRoleNamesTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS user_role_names (
            ID INTEGER PRIMARY KEY, 
            Name TEXT NOT NULL UNIQUE
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('user_role_names Table created.');
            resolve();
        });
    });
}

const createUserRolesTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS user_roles (
            User_ID INTEGER UNIQUE REFERENCES users(id), 
            user_role_names_ID INTEGER REFERENCES user_role_names(ID),
            PRIMARY KEY (User_ID)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('user_roles Table created.');
            resolve();
        });
    });
}



const createUserColorTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS user_colors (
            userID INTEGER, 
            color TEXT NOT NULL,
            PRIMARY KEY (userID),
            FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('User Colors Table created.');
            resolve();
        });
    });
}

const getUserRole = (userID) => {
    return new Promise((resolve, reject) => {
        // SQL query to join user_roles and user_role_names tables
        const sql = `
            SELECT user_role_names.ID, user_role_names.Name 
            FROM user_roles
            INNER JOIN user_role_names ON user_roles.user_role_names_ID = user_role_names.ID
            WHERE user_roles.User_ID = ?
        `;

        db.get(sql, [userID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                // Resolve with both the role ID and the role name
                resolve({
                    roleID: row.ID,
                    roleName: row.Name
                });
            } else {
                resolve(null); // No role found for the user
            }
        });
    });
}




const insertUserColor = (userID, color) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO user_colors (userID, color) VALUES (?, ?)`;
        db.run(query, [userID, color], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(`A color record has been inserted with rowid ${this.lastID}`);
            resolve(this.lastID);
        });
    });
};




const getUserColor = (userID) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT color FROM user_colors WHERE userID = ?`;
        db.get(query, [userID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                resolve(row.color);
            } else {
                resolve(null); // or resolve a default color if preferred
            }
        });
    });
};



const deleteUserColorByUserID = (userID) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM user_colors WHERE userID = ?`;
        db.run(query, [userID], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(`User color record deleted for userID ${userID}`);
            resolve();
        });
    });
};

const updateUserColor = (userID, newColor) => {
    return deleteUserColorByUserID(userID)
        .then(() => insertUserColor(userID, newColor))
        .then(lastID => {
            console.log(`Updated color for userID ${userID}, new rowid is ${lastID}`);
            return lastID;
        })
        .catch(err => {
            console.error("Error updating user color: ", err);
            throw err; // Rethrow or handle error as needed
        });
};




const getAllRoleNames = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT Name FROM user_role_names`, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const roleNames = rows.map(row => row.Name);
            resolve(roleNames);
        });
    });
};


/*TABLES TABLES TABLES */


const insertUser = (username, email, firstname, lastname, password, userRolesName, callback=defaultCallback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return callback(err);
    }

    // Insert the user into the users table
    db.run(`INSERT INTO users (username, email, firstname, lastname, hashedPassword) VALUES (?, ?, ?, ?, ?)`, 
    [username, email, firstname, lastname, hashedPassword], function(err) {
      if (err) {
        return callback(err);
      }

      const userId = this.lastID; // Store the user's ID

      /*INSERTING A COLOR FOR USER */
        const getRandomColor = () => {
          const maxComponentValue = 0xDF; // Limit to 223 in decimal to avoid near-white colors
          const getRandomComponent = () => Math.floor(Math.random() * maxComponentValue).toString(16).padStart(2, '0');

          const red = getRandomComponent();
          const green = getRandomComponent();
          const blue = getRandomComponent();

          return `#${red}${green}${blue}`;
        };


      insertUserColor(userId, getRandomColor());

      /*INSERTING A COLOR FOR USER */
      
      // Fetch the role ID based on the provided userRolesName
      db.get(`SELECT ID FROM user_role_names WHERE Name = ?`, [userRolesName], (err, role) => {
        if (err) {
          return callback(err);
        }

        if (!role) {
          // No role found with the provided name
          return callback(new Error('Role not found.'));
        }

        // Insert into the user_roles table
        db.run(`INSERT INTO user_roles (User_ID, user_role_names_ID) VALUES (?, ?)`, 
        [userId, role.ID], function(err) {
          if (err) {
            return callback(err);
          }

          console.log(`User added with ID: ${userId} and Role ID: ${role.ID}`);
          callback(null, userId);
        });
      });
    });
  });
}



const loginUser = (identifier, password, callback=defaultCallback) => {
  // Retrieve the user with the given email or username
    console.log("Trying to log in user")
  db.get(`SELECT * FROM users WHERE email = ? OR username = ?`, [identifier, identifier], (err, user) => {
      if (err) {
        console.error('Database error:', err.message);
      return callback(err);
    }
    // If no user is found with the given email or username
      if (!user) {
        console.log('No user found with provided identifier:', identifier);
      return callback(null, false);
    }
    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.hashedPassword, (err, result) => {
      if (err) {
        return callback(err);
      }
      // If the comparison is successful, result will be true
      if (result) {
        return callback(null, user); // Return the user object if login is successful
      } else {
        return callback(null, false); // Return false if password is incorrect
      }
    });
  });
}


const getUserId = (identifier, callback = defaultCallback) => {
  console.log("calling getUSER")
    db.get(`SELECT id FROM users WHERE email = ? OR username = ?`, [identifier, identifier], (err, row) => {
        if (err) {
            return callback(err);
        }
        if (!row) {
            return callback(null, null); // No user found with the given identifier
        }
        callback(null, row.id); // Return the user's ID
    });
};


/* USER USER USER USER USER USER USER */


/* USER_ROLE_NAMES  USER_ROLE_NAMES  USER_ROLE_NAMES  USER_ROLE_NAMES  USER_ROLE_NAMES */
const insertUserRoleName = (name, callback=defaultCallback) => {
  db.run(`INSERT INTO user_role_names (Name) VALUES (?)`, [name], function(err) {
    if (err) {
      return callback(err);
    }
    console.log(`Role added with ID: ${this.lastID}`);
    callback(null, this.lastID);
  });
}


const deleteUserRoleName = (idOrName, callback=defaultCallback) => {
  // Check if input is a number (ID) or string (name)
  const isID = typeof idOrName === 'number';
  const query = isID ? `DELETE FROM user_role_names WHERE ID = ?` : `DELETE FROM user_role_names WHERE Name = ?`;

  db.run(query, [idOrName], function(err) {
    if (err) {
      return callback(err);
    }
    console.log(`Deleted ${this.changes} row(s) from user_role_names`);
    callback(null, this.changes);
  });
}


const updateUserRoleName = (id, newName, callback=defaultCallback) => {
  db.run(`UPDATE user_role_names SET Name = ? WHERE ID = ?`, [newName, id], function(err) {
    if (err) {
      return callback(err);
    }
    console.log(`Updated ${this.changes} row(s) in user_role_names`);
    callback(null, this.changes);
  });
}

const getUserFullName = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT firstname, lastname FROM users WHERE id = ?`;

        db.get(sql, [userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                resolve({ firstname: row.firstname, lastname: row.lastname });
            } else {
                resolve(null); // or reject('User not found');
            }
        });
    });
}

const getUserDetails = async (userId) => {
    return new Promise(async (resolve, reject) => {
        // Updated SQL query to also select username and email
        const sql = `SELECT username, email, firstname, lastname FROM users WHERE id = ?`;

        db.get(sql, [userId], async (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row) {
                try {
                    // Await the result of getUserColor
                    const color = await getUserColor(userId);
                    const role = await getUserRole(userId)
                    resolve({
                        username: row.username,
                        email: row.email,
                        firstname: row.firstname,
                        lastname: row.lastname,
                      color: color,
                      role: role // Add color to the resolved object
                    });
                } catch (colorError) {
                    reject(colorError);
                }
            } else {
                resolve(null); // or reject('User not found');
            }
        });
    });
}






/* USER_ROLE_NAMES  USER_ROLE_NAMES  USER_ROLE_NAMES  USER_ROLE_NAMES  USER_ROLE_NAMES */





/**USER INFO AND GROUPS */

const getUserDetailsGroupsAndRoles = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                u.id AS user_id, u.username, u.email, u.firstname, u.lastname,
                g.id AS group_id, g.name AS group_name,
                urn.ID AS role_id, urn.Name AS role_name
            FROM users u
            LEFT JOIN user_groups ug ON u.id = ug.user_id
            LEFT JOIN groups g ON ug.group_id = g.id
            LEFT JOIN user_roles ur ON u.id = ur.User_ID
            LEFT JOIN user_role_names urn ON ur.user_role_names_ID = urn.ID
            WHERE u.id = ?;
        `;

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows && rows.length > 0) {
                const userDetails = {
                    userId: rows[0].user_id,
                    username: rows[0].username,
                    email: rows[0].email,
                    firstname: rows[0].firstname,
                    lastname: rows[0].lastname,
                    userGroups: [],
                    userRole: {
                        roleId: rows[0].role_id,
                        roleName: rows[0].role_name
                    }
                };
                rows.forEach(row => {
                    if(row.group_id) {
                        userDetails.userGroups.push({
                            groupId: row.group_id,
                            groupName: row.group_name
                        });
                    }
                });
                resolve(userDetails);
            } else {
                resolve(null); // or reject('User not found');
            }
        });
    });
};


const getAllUsersDetailsGroupsAndRoles = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                u.id AS user_id, u.username, u.email, u.firstname, u.lastname,
                g.id AS group_id, g.name AS group_name,
                urn.ID AS role_id, urn.Name AS role_name
            FROM users u
            LEFT JOIN user_groups ug ON u.id = ug.user_id
            LEFT JOIN groups g ON ug.group_id = g.id
            LEFT JOIN user_roles ur ON u.id = ur.User_ID
            LEFT JOIN user_role_names urn ON ur.user_role_names_ID = urn.ID;
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const usersMap = new Map();
            rows.forEach(row => {
                if (!usersMap.has(row.user_id)) {
                    usersMap.set(row.user_id, {
                        userId: row.user_id,
                        username: row.username,
                        email: row.email,
                        firstname: row.firstname,
                        lastname: row.lastname,
                        userGroups: [],
                        userRole: {
                            roleId: row.role_id,
                            roleName: row.role_name
                        }
                    });
                }
                
                if (row.group_id) {
                    usersMap.get(row.user_id).userGroups.push({
                        groupId: row.group_id,
                        groupName: row.group_name
                    });
                }
            });

            // Convert map values to an array
            const allUsersDetails = Array.from(usersMap.values());
            resolve(allUsersDetails);
        });
    });
};


/**
 * Checks if the given user ID corresponds to an admin user.
 * @param {number} userId - The ID of the user to check.
 * @returns {Promise<boolean>} A promise that resolves with true if the user is an admin.
 */
const IsUserIdAdmin = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT ur.User_ID
            FROM user_roles ur
            JOIN user_role_names urn ON ur.user_role_names_ID = urn.ID
            WHERE ur.User_ID = ? AND urn.Name = 'ADMIN'
        `;

        db.get(query, [userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(!!row); // Convert the row to a boolean indicating whether the user is an admin.
        });
    });
};



/**
 * Retrieves all users based on their association with a specified role name.
 * @param {string} roleName - The name of the role to filter users by.
 * @param {boolean} exclude - If true, retrieves users without the specified role; if false, retrieves users with the role.
 * @returns {Promise<Array>} A promise that resolves with an array of users.
 */
const getUsersByRoleName = (roleName, exclude) => {
    return new Promise((resolve, reject) => {
        // Correctly handle the exclusion case
        let query = exclude ? `
            SELECT * FROM users 
            WHERE id NOT IN (
                SELECT u.id FROM users u
                JOIN user_roles ur ON u.id = ur.User_ID
                JOIN user_role_names urn ON ur.user_role_names_ID = urn.ID
                WHERE urn.Name = ?
            )
        ` : `
            SELECT u.* FROM users u
            JOIN user_roles ur ON u.id = ur.User_ID
            JOIN user_role_names urn ON ur.user_role_names_ID = urn.ID
            WHERE urn.Name = ?
        `;

        db.all(query, [roleName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};





module.exports = {
  createUserTable,
  insertUser,
    loginUser,
    getUserId,
    createUserRolesTable,
    createUserRoleNamesTable,
    insertUserRoleName,
    deleteUserRoleName,
  updateUserRoleName,
    getUserFullName,
    getUserDetailsGroupsAndRoles,
  getAllUsersDetailsGroupsAndRoles,
  getAllRoleNames,
  getUserDetails,
  createUserColorTable,
  insertUserColor,
    getUserColor,
    updateUserColor,
    IsUserIdAdmin,
    getUsersByRoleName
  
};