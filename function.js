const Auth = require("./authSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  //Getting user details
  const { email, fullName, password, phoneNumber } = req.body;
  //Checking if user input email when registering
  if (!email) {
    return res.status(200).json({ message: "Please add an email" });
  }

  const alreadyExistingUser = await Auth.findOne({ email });
  //to check if user already exist
  if (alreadyExistingUser) {
    return res.status(200).json({ message: "This user account already exist" });
  }
  //create new user password and hash with bcrypt
  const hashPassword = await bcrypt.hash(password, 12);
  //create a new user using model
  const newUser = new Auth({
    email,
    fullName,
    password: hashPassword,
    phoneNumber,
  });
  await newUser.save();

  return res.status(200).json({
    message: "Successful",
    newUser,
  });
};

const checkRegister = async (req, res) => {
  const allRegister = await Auth.find();
  return res.status(200).json({
    message: "Successful",
    allRegister,
  });
};

const handleGetOneUser = async (req, res) => {
  const { id } = req.params;
  const user = await Auth.findById(id);

  if (!user) {
    return res.status(404).json({ message: "item not found" });
  }

  res.status(200).json({
    message: "Successful",
    user,
  });
};

const handleUpdateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const updatedUser = await Auth.findByIdAndUpdate(id, {
    password,
    new: true, //this update new password
  });
  res.status(200).json({
    message: "Successful",
    updatedUser,
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userDelete = await Auth.findByIdAndDelete(id);
  res.status(200).json({
    message: "Successfully deleted",
  });
};

//Types of token
//1. Active token - This is used for email verification.
//2. Access token - This is what the frontend see and give access to the websited.
//3. Refresh token - This happen when user had not used website for a long time and logs them out.
const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
    const isMatched = bcrypt.compare(password, user?.password);
    if (!isMatched) {
      return res.status(200).json({ message: "incorrect email or password" });
    }

    //Generate token
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "User successfully login",
      accessToken,
      user: {
        email: user.email,
        fullname: user.fullName,
        phoneNumber: user.phoneNumber,
      },
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  handleRegister,
  checkRegister,
  handleGetOneUser,
  handleUpdateUserPassword,
  deleteUser,
  login,
};
