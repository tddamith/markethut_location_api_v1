const mongoose = require("mongoose"); // Ensure mongoose is imported
const { APIError, STATUS_CODES } = require("../../utils/app-errors");
const { LocationModel } = require("../models");

class LocationRepository {
  // ############ Create new location ############
  async createNewLocation({
    locations,
    userName,
    password,
    logoUrl,
    isEmailVerification = false,
    isAccountVerification = false,
  }) {
    try {
      // Validate locations
      if (!Array.isArray(locations) || locations.length === 0) {
        throw new APIError(
          "Invalid locations data. Locations should be a non-empty array.",
          STATUS_CODES.BAD_REQUEST,
          "API Error"
        );
      }

      // Prepare location entries
      const locationEntries = locations.map((loc) => {
        if (!loc.locationName || !loc.address) {
          throw new APIError(
            "Location name and address are required fields.",
            STATUS_CODES.BAD_REQUEST,
            "API Error"
          );
        }

        return {
          locationId: loc.locationId || new mongoose.Types.ObjectId(), // Generate a new ObjectId if not provided
          locationName: loc.locationName, // Required field
          address: loc.address, // Required field
          status: loc.status || "active", // Default to 'active' if status not provided
        };
      });

      // Create a new location entry
      const location = new LocationModel({
        locations: locationEntries,
        userName,
        password, // Password will be hashed automatically by the schema pre-save hook
        logoUrl: logoUrl || null, // Default to null if logoUrl is not provided
        isEmailVerification,
        isAccountVerification,
      });

      // Save and return the created location
      const savedLocation = await location.save();
      return savedLocation;
    } catch (err) {
      console.error("Error creating location:", err.message || err);

      // Handle specific mongoose validation errors
      if (err instanceof mongoose.Error.ValidationError) {
        throw new APIError(
          "Validation Error",
          STATUS_CODES.BAD_REQUEST,
          err.message
        );
      } else if (err.code === 11000) {
        // Handle MongoDB duplicate key error
        throw new APIError(
          "Duplicate Entry",
          STATUS_CODES.CONFLICT,
          "Location with similar details already exists"
        );
      } else {
        throw new APIError(
          "Unable to create location",
          STATUS_CODES.INTERNAL_ERROR,
          "API Error"
        );
      }
    }
  }

  // ############ Get location by ID ############
  async getLocationById(locationId) {
    try {
      // Validate the ObjectId format
      if (!mongoose.Types.ObjectId.isValid(locationId)) {
        throw new APIError(
          "Invalid location ID format.",
          STATUS_CODES.BAD_REQUEST,
          "API Error"
        );
      }

      // Find the location by ID
      const location = await LocationModel.findById(locationId);

      if (!location) {
        throw new APIError(
          "Location not found.",
          STATUS_CODES.NOT_FOUND,
          "API Error"
        );
      }

      return location;
    } catch (err) {
      console.error("Error retrieving location:", err.message || err);

      // Handle invalid ObjectId format error
      if (err instanceof mongoose.Error.CastError) {
        throw new APIError(
          "Invalid location ID format.",
          STATUS_CODES.BAD_REQUEST,
          "API Error"
        );
      }

      throw new APIError(
        "Unable to retrieve location",
        STATUS_CODES.INTERNAL_ERROR,
        "API Error"
      );
    }
  }

  // ############ Update location by ID ############
  async updateLocationById(locationId, updateData) {
    try {
      // Validate the ObjectId format
      if (!mongoose.Types.ObjectId.isValid(locationId)) {
        throw new APIError(
          "Invalid location ID format.",
          STATUS_CODES.BAD_REQUEST,
          "API Error"
        );
      }

      // Update the location by ID
      const updatedLocation = await LocationModel.findByIdAndUpdate(
        locationId,
        updateData,
        { new: true, runValidators: true } // Return the updated document and validate the update
      );

      if (!updatedLocation) {
        throw new APIError(
          "Location not found or update failed.",
          STATUS_CODES.NOT_FOUND,
          "API Error"
        );
      }

      return updatedLocation;
    } catch (err) {
      console.error("Error updating location:", err.message || err);

      // Handle invalid ObjectId format error
      if (err instanceof mongoose.Error.CastError) {
        throw new APIError(
          "Invalid location ID format.",
          STATUS_CODES.BAD_REQUEST,
          "API Error"
        );
      }

      throw new APIError(
        "Unable to update location",
        STATUS_CODES.INTERNAL_ERROR,
        "API Error"
      );
    }
  }
}

module.exports = LocationRepository;
