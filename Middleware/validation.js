const emailValidation = function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatingLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const error = [];
  const valid = emailValidation(String(email).toLowerCase());
  if (!email) {
    error.push("Please add your mail");
  } else if (!valid) {
    error.push("Email does not meet up requirement");
  }
  if (!password) {
    error.push("Please add your password");
  }

  if (error.length > 0) {
    return res.status(400).json({ message: error });
  }
  next();
};

module.exports = { validatingLogin };
