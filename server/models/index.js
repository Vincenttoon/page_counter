// Import all your model files
const User = require("./User");
const BooksRead = require("./BooksRead");
const BookInfo = require("./BookInfo");
const Comment = require("./Comment");
const Worms = require("./Worms");
const SavedBooks = require("./SavedBooks");

// Export all your models
module.exports = {
  User,
  BooksRead,
  BookInfo,
  Comment,
  Worms,
  SavedBooks,
};