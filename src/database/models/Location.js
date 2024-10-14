const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  storeId: { type: String, required: [true, "storeId is required"] },
  locations: [{
    locationId: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    locationName: { type: String, required: [true, "locationName is required"] },
    address: { type: String, required: [true, "address is required"] },
    status: { type: String, default: "active" }
  }]
}, { timestamps: true });  // Enable automatic createdAt and updatedAt fields

module.exports = mongoose.model("location", LocationSchema);
