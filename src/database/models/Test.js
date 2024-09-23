/*const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userId: {
      type: Schema.Types.String,
      required: [true, "userId is required "],
    },
    firstName: { type: Schema.Types.String },
    businessName: { type: Schema.Types.String },
    BRno: { type: Schema.Types.String },
    mobileNo: {
      type: Schema.Types.String,
      required: [true, "mobileNo is required "],
    },
    userType: { type: Schema.Types.String },
    favoriteArea: { type: Schema.Types.Mixed },
    password: { type: Schema.Types.String },
    salt: { type: Schema.Types.String },
    profileAvatar: { type: Schema.Types.String },
    termsAndCondition: { type: Schema.Types.Boolean },
    accountVerificationCode: { type: Schema.Types.String },
    isEmailVerification: { type: Schema.Types.Boolean, default: false },
    isMobileVerification: { type: Schema.Types.Boolean, default: false },
    isBRVerification: { type: Schema.Types.Boolean, default: false },
    isBusinessVerification: { type: Schema.Types.Boolean, default: false },
    isAdminVerification: { type: Schema.Types.Boolean, default: false },
    isAccountVerification: { type: Schema.Types.Boolean, default: false },
    isAccountBlock: { type: Schema.Types.Boolean, default: false },
    documentURL: { type: Schema.Types.String },
    favorites: { type: Schema.Types.Mixed, default: [] },
    status: { type: Schema.Types.String },
    createdBy: { type: Schema.Types.String },
    updatedBy: { type: Schema.Types.String },
    createdAt: { type: Schema.Types.Date, default: Date.now },
    lastUpdateAt: { type: Schema.Types.Date, default: Date.now },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("user", UserSchema);*/
