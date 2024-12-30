const sqlite3 = require('sqlite3').verbose();

// Create a new database file or connect to an existing one
let db = new sqlite3.Database('./mydb.sqlite3', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

const closeConnection = () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the SQLite database connection.');
  });
};

module.exports = {
  db,
  closeConnection
};
