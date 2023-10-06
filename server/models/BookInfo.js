const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookInfoSchema = new Schema({
  authors: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
  bookId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0, // Default to 0 if there are no reviews yet
  },
});

const BookInfo = mongoose.model("BookInfo", bookInfoSchema);

module.exports = BookInfo;
