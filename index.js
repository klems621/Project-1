const express = require("express");
const mongoose = require("mongoose");
const {
  handleRegister,
  checkRegister,
  handleGetOneUser,
  handleUpdateUserPassword,
  deleteUser,
  login,
} = require("./function");
const { validatingLogin } = require("./Middleware/validation");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb is connected");
    app.listen(PORT, () => {
      console.log(`Server started running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/", checkRegister);
app.get("/one-user/:id", handleGetOneUser);
app.post("/register", handleRegister);
app.post("/login", validatingLogin, login);
app.patch("/update-password/:id", handleUpdateUserPassword);
app.delete("/delete-user/:id", deleteUser);
