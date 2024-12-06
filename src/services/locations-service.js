const { default: mongoose } = require("mongoose");
const LocationRepository  = require("../database/repository/location-repository.js");
const { FormateData, GenerateOTPSignature } = require("../utils");
const { APIError } = require("../utils/app-errors");
const { OtPGenerate } = require("../utils/verification-code-handler");
const LocationModel = require('../database/models/Location.js');


class LocationsService {
  constructor() {
    this.repository = new LocationRepository();
  }

  // ############ Create New Location ############
async createNewLocation(locationData) {
  console.log("Creating new location ===>", { locationData });

  try {
      const location = new LocationModel(locationData); // Create a new Location document
      const result = await location.save(); // Save to the database

      // Format the response according to the specified structure
      return FormateData({
          message: "Location created successfully.",
          status: true,
          data: {
              storeId: result.storeId, // Return the storeId
              locations: result.locations.map(loc => ({
                  locationId: loc.locationId.toString(), // Ensure it’s a string
                  locationName: loc.locationName,
                  address: loc.address,
                  status: loc.status, // Include the status if needed
              })),
              createdAt: result.createdAt,
              updatedAt: result.updatedAt,
              __v: result.__v,
          },
      });
  } catch (err) {
      console.error("Error creating location:", err);
      throw new APIError("Failed to create location", err.statusCode || 500);
  }
}

// ############ Get Location by ID ############
async getLocationById(locationId, storeId) {
  console.log("Get Location by ID ===>", { locationId, storeId });

  try {
      // Call the repository method to retrieve location by locationId and storeId
      const locationData = await this.repository.getLocationById(locationId, storeId);

      if (!locationData) {
          throw new APIError("Location not found", 404);
      }

      // Return the formatted location data
      return {
          message: "Location retrieved successfully.",
          status: true,
          data: locationData
      };
  } catch (err) {
      console.error("Error in getting location:", err);
      throw new APIError("Failed to retrieve location", err.statusCode || 500);
  }
}

 // ############ Update Location by ID and StoreID ############
 async updateLocationById(locationId, storeId, updateData) {
  console.log("Update Location by ID and StoreID ===>", { locationId, storeId, updateData });

  try {
    // Validate locationId
    if (!mongoose.Types.ObjectId.isValid(locationId)) {
      throw new APIError("Invalid location ID format", 400);
    }

    // Validate storeId
    if (!storeId) {
      throw new APIError("Store ID must be provided", 400);
    }

      // Validate updateData
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new APIError("Update data must be provided", 400);
      }

    // Call repository to update location by both locationId and storeId
    const updatedLocation = await this.repository.updateLocationByIdAndStoreId(locationId, storeId, updateData);

    return  {
      message: "Location updated successfully.",
      status: true,
      data: updateData
  } // Return the formatted response
  } catch (err) {
    console.error("Error in updating location:", err);
    throw new APIError("Failed to update location", err.statusCode || 500);
  }
}

}

module.exports = LocationsService;
