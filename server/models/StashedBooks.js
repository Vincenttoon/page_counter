const mongoose = require("mongoose");
const { Schema } = mongoose;

const dateFormat = require("../utils/dateFormat");

const stashedBooksSchema = new Schema({
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

const StashedBooks = mongoose.model("StashedBooks", stashedBooksSchema);

module.exports = StashedBooks;
