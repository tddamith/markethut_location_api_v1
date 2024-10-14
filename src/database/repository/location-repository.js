const mongoose = require("mongoose");
const LocationModel = require("../models/Location.js");
const { APIError, STATUS_CODES } = require("../../utils/app-errors");

class LocationRepository {
  async createNewLocation(locationData) {
    const newLocation = new LocationModel(locationData);
    return await newLocation.save();
  }

  async deactivateLocation(locationId) {
    console.log("Deactivating Location ===>", { locationId });

    const location = await LocationModel.findOneAndUpdate(
      { "locations.locationId": locationId },
      { $set: { "locations.$.status": "inactive" } },
      { new: true, runValidators: true }
    );

    if (!location) {
      throw new APIError(`Location not found for ID: ${locationId}`, STATUS_CODES.NOT_FOUND);
    }

    return location;
  }

  async reactivateLocation(locationId) {
    console.log("Reactivating Location ===>", { locationId });

    const location = await LocationModel.findOneAndUpdate(
      { "locations.locationId": locationId },
      { $set: { "locations.$.status": "active" } },
      { new: true, runValidators: true }
    );

    if (!location) {
      throw new APIError(`Location not found for ID: ${locationId}`, STATUS_CODES.NOT_FOUND);
    }

    return location;
  }

  async getLocation(locationId, storeId) {
    return await LocationModel.findOne({ "locations.locationId": locationId, storeId });
  }

  async updateLocationById(locationId, storeId, updateData) {
    const location = await LocationModel.findOneAndUpdate(
      { "locations.locationId": locationId, storeId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!location) {
      throw new APIError(`Location not found for ID: ${locationId}`, STATUS_CODES.NOT_FOUND);
    }

    return {
      message: "Location updated successfully.",
      status: true,
      data: location,
    };
  }
}

module.exports = LocationRepository;
