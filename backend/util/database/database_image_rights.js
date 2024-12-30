const { db } = require('./database_core');


const createRightsIdTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS rights_id (
            ID INTEGER PRIMARY KEY, 
            String TEXT NOT NULL
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Rights ID table created.');
            resolve();
        });
    });
};


const createImageToRightsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS image_to_rights (
            ID INTEGER PRIMARY KEY, 
            file_id INTEGER NOT NULL REFERENCES files(ID), 
            rights_id INTEGER NOT NULL REFERENCES rights_id(ID)
        )`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Image to Rights table created.');
            resolve();
        });
    });
};



const insertIntoRightsId = (string) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO rights_id (String) VALUES (?)`, [string], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log('New rights ID inserted with ID:', this.lastID);
            resolve(this.lastID);
        });
    });
};


const insertIntoImageToRights = (fileId, rightsId) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO image_to_rights (file_id, rights_id) VALUES (?, ?)`, [fileId, rightsId], function(err) {
            if (err) {
                reject(err);
                return;
            }
            console.log('New image to rights link inserted with ID:', this.lastID);
            resolve(this.lastID);
        });
    });
};


const getAllFromRightsId = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM rights_id`, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const getRightsByFileId = (fileId) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT r.ID, r.String 
                FROM image_to_rights itr 
                JOIN rights_id r ON itr.rights_id = r.ID 
                WHERE itr.file_id = ?`, [fileId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row) {
                resolve(null); // No rights found for this file_id
            } else {
                resolve(row);
            }
        });
    });
};






module.exports = {
    createRightsIdTable,
    createImageToRightsTable,
    insertIntoRightsId,
    insertIntoImageToRights,
    getAllFromRightsId,
    getRightsByFileId 


};
