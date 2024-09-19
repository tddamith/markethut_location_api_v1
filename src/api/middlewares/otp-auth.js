const {ValidateOTPSignature} = require("../../utils");

module.exports = async (req, res, next) => {
  const isAuthorized = await ValidateOTPSignature(req);
  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({message: "INVALID OTP Authorized"});
};