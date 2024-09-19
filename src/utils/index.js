const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const {
  JWT_SECRET,
  OTP_EXPIRATION_TIME,
  TOKEN_EXPIRATION_TIME,
} = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  console.log("password====>", enteredPassword, savedPassword, salt);
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  return await jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
};

module.exports.GenerateResetPasswordSignature = async (payload) => {
  return await jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });
};

module.exports.GenerateOTPSignature = async (payload) => {
  return await jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

module.exports.ValidateSignature = async (req, res) => {
  console.log("ValidateSignature:::");
  const signature = req.get("Authorization");
  if (signature) {

    try {
      const payload = await jwt.verify(
          signature.replace("Bearer ", ""),
          JWT_SECRET
      );
      console.log("signature==>", payload);
      req.user = payload && payload;
      return true;
    } catch (e) {
      console.log("invalid token..");
      return false;
    }
  }
  return false;
};

module.exports.ValidateOTPSignature = async (req) => {
  console.log("ValidateOTPSignature:::");
  const token = req.body && req.body.token;
  console.log('access_token', token);

  if (token) {
    console.log("token==>", token);
    const payload = await jwt.verify(token, JWT_SECRET);
    req.user = payload && payload;
    return true;
  }
  return false;
};

module.exports.ValidateEmailSignature = async (req, token) => {
  console.log("ValidateEmailSignature:::");
  if (token) {
    const payload = await jwt.verify(token, JWT_SECRET);
    req.user = payload && payload;
    return true;
  }
  return false;
};

module.exports.FormateData = (data) => {
  if (data) {
    return {data};
  } else {
    throw new Error("Data Not found!");
  }
};

module.exports.SessionValidate = async ({token}) => {
  console.log("SessionValidate:::", token);
  if (token) {
    try {
      const payload = await jwt.verify(
          token,
          JWT_SECRET
      );
      return true;
    } catch (e) {
      console.log("invalid token..");
      return false;
    }
  }
  return false;
};
