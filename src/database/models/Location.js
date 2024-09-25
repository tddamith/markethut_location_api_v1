const mongoose = require("mongoose");
const LocationSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  logoUrl: { type: String, default: null },
  isEmailVerification: { type: Boolean, default: false },
  isAccountVerification: { type: Boolean, default: false },
  locations: [{
    locationId: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    locationName: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "active" }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("location", LocationSchema);
