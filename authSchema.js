const mongoose = require("mongoose");
const authSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
});

const Auth = new mongoose.model("Auth", authSchema);
module.exports = Auth;
