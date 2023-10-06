const mongoose = require("mongoose");
const { Schema } = mongoose;

const booksReadSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bookInfo: {
    type: Schema.Types.ObjectId,
    ref: "BookInfo",
  },
  review: String,
  rating: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation function for rating
        return value >= 0 && value <= 5 && /^\d(\.\d{1,2})?$/.test(value.toFixed(2));
      },
      message: "Rating must be a number between 0 and 5 with up to two decimal places (e.g., 3.25).",
    },
  },
  pagesRead: Number,
});

const BooksRead = mongoose.model("BooksRead", booksReadSchema);

module.exports = BooksRead;
