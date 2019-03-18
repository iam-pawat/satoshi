const sqlite3 = require('sqlite3').verbose();

const connect = dbfile =>
  new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbfile, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });

const close = db =>
  new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const all = (db, sql, params) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
const get = (db, sql, params) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

const run = (db, sql, params) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      const self = this;
      if (err) {
        reject(err);
      } else {
        resolve({ changes: self.changes, lastID: self.lastID });
      }
    });
  });

const each = (db, sql, params) =>
  new Promise((resolve, reject) => {
    db.each(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

module.exports = {
  connect,
  close,
  all,
  get,
  each,
  run,
};
