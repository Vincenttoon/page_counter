const mongoose = require("mongoose");
const { Schema } = mongoose;

const dateFormat = require("../utils/dateFormat");

const savedBooksSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bookInfo: {
    type: Schema.Types.ObjectId,
    ref: "BookInfo",
  },
  savedAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const SavedBooks = mongoose.model("SavedBooks", savedBooksSchema)

module.exports = SavedBooks;
