const mongoose = require("mongoose");
const { Schema } = mongoose;

const savedBooksSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bookInfo: {
    type: Schema.Types.ObjectId,
    ref: "BookInfo",
  },
});

const SavedBooks = mongoose.model("SavedBooks", savedBooksSchema);

module.exports = SavedBooks;
