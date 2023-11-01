// Import all your model files
const User = require("./User");
const BooksLogged = require("./BooksLogged");
const BookInfo = require("./BookInfo");
const Comment = require("./Comment");
const Worms = require("./Worms");
const SavedBooks = require("./StashedBooks");

// Export all your models
module.exports = {
  User,
  BooksLogged,
  BookInfo,
  Comment,
  Worms,
  SavedBooks,
};