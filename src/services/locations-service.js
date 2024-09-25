const { default: mongoose } = require("mongoose");
const { LocationRepository } = require("../database");
const { 
  FormateData, 
  GeneratePassword,
  GenerateSalt,
  GenerateOTPSignature,
} = require("../utils");
const { APIError } = require("../utils/app-errors");
const { OtPGenerate } = require("../utils/verification-code-handler");

class LocationsService {
  constructor() {
    this.repository = new LocationRepository();
  }

  // ############ Create new Location ############
  async createNewLocation(locationInputs) {
    console.log("create new Location ===>", { locationInputs });

    const {
      locations = [], // Expecting locations to be an array of objects
      userName,
      password,
      logoUrl,
      isEmailVerification = false,
      isAccountVerification = false,
    } = locationInputs;

    try {
      // Input validation
      if (!Array.isArray(locations) || locations.length === 0) {
        throw new APIError("Locations must be provided as a non-empty array", 400);
      }
      if (!userName || !password) {
        throw new APIError("User name and password are required", 400);
      }

      // Password hashing
      let salt = await GenerateSalt();
      let hashedPassword = await GeneratePassword(password, salt);

      // Prepare new location object
      const newLocation = {
        locations, // Save the locations array
        userName,
        password: hashedPassword,
        logoUrl: logoUrl || "",
        isEmailVerification,
        isAccountVerification,
        status: "active", // Default status
      };

      // Call repository to create new location
      const result = await this.repository.createNewLocation(newLocation);

      // If the location creation fails
      if (!result) {
        throw new APIError("Location creation failed", 500);
      }

      // Send OTP logic (optional)
      let token = await GenerateOTPSignature({
        locationId: result._id, // Assuming result returns the created location with an _id
        locationName: locations[0].locationName, // Adjust this as per your structure
        address: locations[0].address, // Assuming the first location has an address
      });
      const otpCode = await OtPGenerate();

      // Implement OTP sending logic here (via email, SMS, etc.)

      return FormateData({
        status: true,
        message: "Location created successfully.",
        data: {
          location: result,
          token, // You may return the OTP code if needed
        },
      });

    } catch (err) {
      console.error("Error in Location service:", err);
      throw new APIError("Error in creating new location", err.statusCode || 500);
    }
  }

  // ############ Get Location by ID ############
  async getLocationById(locationId) {
    console.log("Get Location by ID ===>", { locationId });

    try {
      // Validate locationId
      if (!locationId) {
        throw new APIError("Location ID must be provided", 400);
      }

      // Call repository to retrieve location
      const location = await this.repository.getLocationById(locationId);

      // If the location is not found
      if (!location) {
        throw new APIError("Location not found", 404);
      }

      return FormateData({
        status: true,
        message: "Location retrieved successfully.",
        data: location,
      });

    } catch (err) {
      console.error("Error in getting location:", err);
      throw new APIError("Failed to retrieve location", err.statusCode || 500);
    }
  }

  // ############ Update Location by ID ############
  async updateLocationById(locationId, updateData) {
    console.log("Update Location by ID ===>", { locationId, updateData });

    try {
      // Validate locationId
      if (!locationId) {
        throw new APIError("Location ID must be provided", 400);
      }

      // Validate updateData
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new APIError("Update data must be provided", 400);
      }

      // Call repository to update location by ID
      const updatedLocation = await this.repository.updateLocationById(locationId, updateData);

      // If the location update fails
      if (!updatedLocation) {
        throw new APIError("Location update failed", 500);
      }

      return FormateData({
        status: true,
        message: "Location updated successfully.",
        data: updatedLocation,
      });

    } catch (err) {
      console.error("Error in updating location:", err);
      throw new APIError("Failed to update location", err.statusCode || 500);
    }
  }
}

module.exports = LocationsService;
