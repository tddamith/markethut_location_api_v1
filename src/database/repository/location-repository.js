const mongoose = require("mongoose");
const { LocationModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-errors");

class LocationRepository {
 // ############ Create new location ############
async createNewLocation({ storeId, locations }) {
  try {
      const locationEntries = locations.map((loc) => {
          if (!loc.locationName || !loc.address) {
              throw new APIError("Location name and address are required", STATUS_CODES.BAD_REQUEST);
          }
          return {
              locationId: loc.locationId || new mongoose.Types.ObjectId(),
              locationName: loc.locationName,
              address: loc.address,
              status: loc.status || "active", // Default to "active" if not provided
          };
      });

      const location = new LocationModel({ storeId, locations: locationEntries });
      const savedLocation = await location.save();
      return savedLocation; // Return the saved location
  } catch (err) {
      console.error("Error creating location in repository:", err);
      if (err instanceof mongoose.Error.ValidationError) {
          throw new APIError("Validation Error", STATUS_CODES.BAD_REQUEST, err.message);
      }
      if (err.code === 11000) {
          throw new APIError("Duplicate Entry", STATUS_CODES.CONFLICT, "Duplicate location");
      }
      throw new APIError("Unable to create location", STATUS_CODES.INTERNAL_ERROR, "API Error");
  }
}

  
// ############ Get Location by ID and StoreID ############
async getLocationById(locationId, storeId) {
  try {
      // Find the document that matches both storeId and the locationId within the locations array
      const locationRecord = await LocationModel.findOne({
          storeId: storeId,
          "locations.locationId": locationId,
      }, {
          "storeId": 1, // Include storeId in the projection
          "locations.$": 1, // Project only the matching location within the locations array
      });

      if (!locationRecord || !locationRecord.locations.length) {
          return null; // Return null if no location is found
      }

      // Extract the matching location object
      const location = locationRecord.locations[0];

      // Return the formatted location data
      return {
          storeId: locationRecord.storeId,
          locations: [{
              locationId: location.locationId,
              locationName: location.locationName,
              address: location.address,
              status: location.status,
          }],
          createdAt: location.createdAt,
          updatedAt: location.updatedAt,
          __v: locationRecord.__v,
      };
  } catch (err) {
      console.error("Error retrieving location:", err);
      throw new APIError("Unable to retrieve location", STATUS_CODES.INTERNAL_ERROR, "API Error");
  }
}


// ############ Update Location by ID and StoreID ############
async updateLocationByIdAndStoreId(locationId, storeId, updateData) {
  try {
    console.log("Updating location:", { locationId, storeId, updateData });

    // Make sure the locationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(locationId)) {
      throw new APIError("Invalid location ID format", STATUS_CODES.BAD_REQUEST);
    }

    // Find the document and update
    const updatedLocationRecord = await LocationModel.findOneAndUpdate(
      { storeId: storeId, "locations.locationId": locationId }, // Query to find matching document
      {
        $set: {
          "locations.$[elem].locationName": updateData.locationName,
          "locations.$[elem].address": updateData.address,
          "locations.$[elem].status": updateData.status || "active"
        }
      },
      {
        arrayFilters: [{ "elem.locationId": locationId }], // Array filter for the matching location
        new: true, // Return the updated document
        runValidators: true // Ensure Mongoose validators are applied
      }
    );

    // If no document is found or updated
    if (!updatedLocationRecord) {
      throw new APIError("Location not found or update failed", STATUS_CODES.NOT_FOUND);
    }

    // Find the updated location within the locations array
    const updatedLocation = updatedLocationRecord.locations.find(loc => loc.locationId == locationId);

    if (!updatedLocation) {
      throw new APIError("Location not found after update", STATUS_CODES.NOT_FOUND);
    }

    console.log("Updated location successfully:", updatedLocation);

    // Return the updated data in the desired structure
    return {
      storeId: updatedLocationRecord.storeId,
      locations: [ // Adjusted to return an array of locations
        {
          locationId: updatedLocation.locationId,
          locationName: updatedLocation.locationName,
          address: updatedLocation.address,
          status: updatedLocation.status
        }
      ]
    };
  } catch (err) {
    console.error("Error updating location:", err);
    throw new APIError("Unable to update location", STATUS_CODES.INTERNAL_ERROR, "API Error");
  }
}


}

module.exports = LocationRepository;
