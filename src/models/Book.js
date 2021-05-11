/* eslint-disable no-shadow */
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const p = path.join(path.dirname(require.main.filename), 'data', 'books.json');

module.exports = class Book {
  constructor(data) {
    this.title = data.title;
    this.author = data.author;
    this.year = Number(data.year);
    this.tags = data.tags;
    this.guid = uuid.v4();
  }

  static getAll(cb) {
    fs.readFile(p, (err, data) =>{
      let allBooks = [];
      if(!err){
        allBooks = JSON.parse(data);
      }
      cb(allBooks);
    });
  }

  save() {
    fs.readFile(p, (err, data) => {
      let books = [];
      if(!err){
        books = JSON.parse(data);
        books.push(this);
        fs.writeFile(p, JSON.stringify(books), (err) => {
          console.log(err)
        });
      }
    });
  }

  getGuid() {
    return this.guid;
  }

  static update(books) {
    fs.writeFile(p, JSON.stringify(books), (err) => {
      console.log(err)
    });
  }
};
