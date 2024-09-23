const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");
const { LocationModel } = require("../models");

class LocationRepository {
  //############ Create new location ############
  async createNewLocation({
    storeId,
    locationId,
    locationName,
    address,
    status,
    userName,
    password,
    logoUrl,
    isEmailVerification,
    isAccountVerification,
  }) {
    try {
      const location = new LocationModel({
        storeId,
        Location: [
          {
            locationId,
            locationName,
            address,
            status,
          },
        ],
        userName,
        password,
        logoUrl,
        isEmailVerification,
        isAccountVerification,
      });
      return await location.save();
    } catch (err) {
      console.log("Error", err);
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create location"
      );
    }
  }

  //############ Update location status ############
  async updateLocationStatus({ locationId, status }) {
    try {
      let filterQuery = { "Location.locationId": locationId };
      let updateQuery = { "Location.$.status": status };
      return await LocationModel.findOneAndUpdate(filterQuery, updateQuery, {
        rawResult: true,
        new: true, // to return updated document
        upsert: false, // avoid creating if not found
      });
    } catch (err) {
      console.log("Error", err);
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to update location status"
      );
    }
  }

  //############ Block a location ############
  async blockLocation({ locationId }) {
    try {
      let filterQuery = { "Location.locationId": locationId };
      let updateQuery = { "Location.$.status": "Blocked" };
      return await LocationModel.findOneAndUpdate(filterQuery, updateQuery, {
        rawResult: true,
        new: true, // to return updated document
        upsert: false,
      });
    } catch (err) {
      console.log("Error", err);
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to block location"
      );
    }
  }

  //############ Find location by storeId ############
  async findLocationByStoreId({ storeId }) {
    try {
      return await LocationModel.findOne({ storeId }).select({
        "Location.locationId": 1,
        "Location.locationName": 1,
        "Location.address": 1,
        "Location.status": 1,
      });
    } catch (err) {
      console.log("Error", err);
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find location by storeId"
      );
    }
  }

  //############ Find location by locationId ############
  async findLocationById({ locationId }) {
    try {
      return await LocationModel.findOne({
        "Location.locationId": locationId,
      }).select({
        "Location.$": 1, // Selects the matching element in the array
      });
    } catch (err) {
      console.log("Error", err);
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find location by locationId"
      );
    }
  }

  //############ Update location address ############
  async updateLocationAddress({ locationId, address }) {
    try {
      let filterQuery = { "Location.locationId": locationId };
      let updateQuery = { "Location.$.address": address };
      return await LocationModel.findOneAndUpdate(filterQuery, updateQuery, {
        rawResult: true,
        new: true,
        upsert: false,
      });
    } catch (err) {
      console.log("Error", err);
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to update location address"
      );
    }
  }

  //############ Get all locations for a user ############
  async getLocationsByUser({ userName }) {
    try {
      return await LocationModel.find({ userName }).select({
        storeId: 1,
        Location: 1,
        userName: 1,
      });
    } catch (err) {
      console.log("Error", err);
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find locations for user"
      );
    }
  }
}

module.exports = LocationRepository;
