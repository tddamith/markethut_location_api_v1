const LocationRepository = require("../database/repository/location-repository.js");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");
const LocationModel = require('../database/models/Location.js'); 

class LocationsService {
  constructor() {
    this.repository = new LocationRepository();
  }

  // Create a new location
  async createNewLocation(locationData) {
    console.log("Creating new location ===>", { locationData });
   
    try {
        // Save location to DB via the repository
        const result = await this.repository.createNewLocation(locationData);
  
        // Format the response
        return FormateData({
            message: "Location created successfully.",
            status: true,
            data: {
                storeId: result.storeId,
                locations: result.locations.map(loc => ({
                    locationId: loc.locationId.toString(),
                    locationName: loc.locationName,
                    address: loc.address,
                    status: loc.status,
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

  // Deactivate a location
  async deactivateLocation(locationId) {
    console.log("Deactivate Location ===>", { locationId });

    try {
      const deactivatedLocation = await this.repository.deactivateLocation(locationId);

      return {
        message: "Location deactivated successfully.",
        status: true,
        data: deactivatedLocation,
      };
    } catch (err) {
      console.error("Error deactivating location:", err);
      throw new APIError("Failed to deactivate location", err.statusCode || 500);
    }
  }

  // Reactivate a location
  async reactivateLocation(locationId) {
    console.log("Reactivate Location ===>", { locationId });

    try {
      const updatedLocation = await this.repository.reactivateLocation(locationId);

      return {
        message: "Location reactivated successfully.",
        status: true,
        data: updatedLocation,
      };
    } catch (err) {
      console.error("Error reactivating location:", err);
      throw new APIError("Failed to reactivate location", err.statusCode || 500);
    }
  }

  // Get location by locationId and storeId
  async getLocation(locationId, storeId) {
    console.log("Get Location by ID ===>", { locationId, storeId });

    try {
        const locationData = await this.repository.getLocation(locationId, storeId);
        if (locationData) {
            const location = locationData.locations[0];
            return {
                message: "Location retrieved successfully.",
                status: true,
                data: {
                    storeId: locationData.storeId,
                    locations: [{
                        locationId: location.locationId,
                        locationName: location.locationName,
                        address: location.address,
                        status: location.status,
                    }],
                    createdAt: location.createdAt,
                    updatedAt: location.updatedAt,
                    __v: locationData.__v,  
                },
            };
        } else {
            return FormateData({ message: "Location not found.", status: false, data: null });
        }
    } catch (err) {
        console.error("Error retrieving location:", err);
        throw new APIError("Failed to retrieve location", err.statusCode || 500);
    }
  }

  // Update or add a new location
  async updateOrAddLocation(locationId, storeId, updateData) {
    console.log("Update or Add Location ===>", { locationId, storeId, updateData });

    try {
        const result = await this.repository.updateLocationById(locationId, storeId, updateData);
        return {
            message: result.message,
            status: result.status,
            data: result.data,
        };
    } catch (err) {
        console.error("Error updating location:", err);
        throw new APIError("Failed to update or add location", err.statusCode || 500);
    }
  }
}

module.exports = LocationsService;
