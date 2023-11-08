const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const dateFormat = require("../utils/dateFormat");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  stashedBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Books",
    },
  ],
  worms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Worms",
    },
  ],
  dates: {
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
  },
});

// set up pre-save middleware to create password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  // Update the updatedAt field when saving
  this.dates.updatedAt = new Date();

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Calculate total pages read
// userSchema.methods.calculateTotalPagesRead = async function () {
//   const booksRead = await BooksRead.find({ user: this._id });
//   const totalPagesRead = booksRead.reduce(
//     (total, bookRead) => total + bookRead.pagesRead,
//     0
//   );
//   return totalPagesRead;
// };

// userSchema.virtual("booksReadCount").get(function () {
//   return this.booksRead.length;
// });

userSchema.virtual("stashedBooksCount").get(function () {
  return this.stashedBooks.length;
});

// friends list length
userSchema.virtual("wormCount").get(function () {
  return this.worms.length;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
