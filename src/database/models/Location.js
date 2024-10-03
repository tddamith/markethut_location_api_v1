const mongoose = require("mongoose");
const LocationSchema = new mongoose.Schema({
  
  storeId:{type: String,required: true},
  
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
