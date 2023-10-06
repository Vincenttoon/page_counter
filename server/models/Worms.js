const mongoose = require("mongoose");
const { Schema } = mongoose;

const wormsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Worms = mongoose.model("Worms", wormsSchema);

module.exports = Worms;
