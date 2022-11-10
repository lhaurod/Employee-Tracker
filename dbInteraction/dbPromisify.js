const mysql = require(`mysql2`);

class dbPromisify {
  constructor( config ) {
    this.connection = mysql.createConnection( config );
  }

  query( sql, args ) {
    return new Promise( (resolve, reject) => {
      this.connection.query( sql, args, (error, rows) => {
        if (error) {
          return reject(error);
        }
        resolve(rows);
      })
    })
  }

  close() {
    return new Promise( (resolve, reject) => {
      this.connection.end( error => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }
};

module.exports = dbPromisify;