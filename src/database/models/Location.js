const mongoose = require("mongoose");
const LocationSchema = new mongoose.Schema({
  
  storeId: { type: String, required: true },
  Location: [{
    locationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    locationName: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "active" } // default to active if not provided
  }],
  userName: { type: String, required: true },
  password: { type: String, required: true }, // Ensure this is hashed before saving
  logoUrl: { type: String, default: null }, // default to null if not provided
  isEmailVerification: { type: Boolean, default: false },
  isAccountVerification: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("location", LocationSchema);
