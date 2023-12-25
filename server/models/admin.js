require("dotenv").config();
const mongoose = require("mongoose");
const password = process.env.DBPASS;
const saltRounds = 10;

mongoose.connect(
  `mongodb+srv://sammedcjain:${password}@cluster0.gldyajt.mongodb.net/adminDB`,
  { useNewUrlParser: true }
);

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
