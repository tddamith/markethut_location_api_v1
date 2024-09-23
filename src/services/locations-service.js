const { default: mongoose } = require("mongoose");
const { LocationRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-errors");

class LocationsService {
  constructor() {
    this.repository = new LocationRepository();
  }

  // ############ Get Location by locationId ############
  async GetLocationById(locationInputs) {
    console.log("find Location ===>", { locationInputs });
    const { locationId } = locationInputs;
    try {
      const result = await this.repository.FindExistingByLocationId({ locationId });
      console.log("get location ==> :", result);
      return FormateData({
        status: !!result,
        message: result ? "found location data." : "location not found",
        data: result,
      });
    } catch (err) {
      console.error("Error-location-service", err);
      throw new APIError("Data Not found location-service", err);
    }
  }

  // ############ Create new location ############
  async createNewLocation(locationInputs) {
    console.log("create new Location ===>", { locationInputs });
    const {
      locationId,
      name,
      address,
      coordinates,
      city,
      country,
      createdAt,
      status,
    } = locationInputs;

    try {
      const isExisting = await this.repository.FindExistingLocation({ name, address });
      console.log("existing location ===>", { isExisting });

      if (!isExisting) {
        const result = await this.repository.createNewLocation({
          locationId,
          name,
          address,
          coordinates,
          city,
          country,
          status,
          createdAt,
          updatedAt: createdAt,
        });

        return FormateData({
          status: !!result,
          message: result ? "Location created successfully." : "Location creation failed.",
          data: result,
        });
      }
      return FormateData({
        status: false,
        message: "Location already exists.",
        data: isExisting,
      });
    } catch (err) {
      console.error("Error Location service", err);
      throw new APIError("Data Not found Location service", err);
    }
  }

  // ############ Update Location ############
  async UpdateLocation(locationInputs) {
    console.log("update Location ===>", { locationInputs });
    const { locationId, name, address, coordinates, city, country } = locationInputs;

    try {
      const existingLocation = await this.repository.FindExistingByLocationId({ locationId });
      console.log("existing Location ===>", { existingLocation });

      if (existingLocation) {
        const locationResult = await this.repository.UpdateLocation({
          locationId,
          name,
          address,
          coordinates,
          city,
          country,
        });

        const updatedLocation = await this.repository.FindExistingByLocationId({ locationId });

        return FormateData({
          status: !!locationResult,
          message: locationResult ? "Location updated successfully." : "Location update failed.",
          data: updatedLocation,
        });
      }
      return FormateData({
        status: false,
        message: "Location not found.",
        data: existingLocation,
      });
    } catch (err) {
      console.error("Error Location service", err);
      throw new APIError("Data Not found Location service", err);
    }
  }

  // ############ Delete Location ############
  async DeleteLocation(locationInputs) {
    console.log("delete Location ===>", { locationInputs });
    const { locationId } = locationInputs;

    try {
      const existingLocation = await this.repository.FindExistingByLocationId({ locationId });
      console.log("existing Location ===>", { existingLocation });

      if (existingLocation) {
        const result = await this.repository.DeleteLocation({ locationId });

        return FormateData({
          status: !!result,
          message: result ? "Location deleted successfully." : "Location deletion failed.",
          data: result,
        });
      }
      return FormateData({
        status: false,
        message: "Location not found.",
        data: existingLocation,
      });
    } catch (err) {
      console.error("Error Location service", err);
      throw new APIError("Data Not found Location service", err);
    }
  }

  // ############ Get All Locations ############
  async GetAllLocations() {
    try {
      const result = await this.repository.GetAllLocations();
      console.log("get all locations ==> :", result);

      return FormateData({
        status: !!result,
        message: result ? "Locations found." : "No locations found.",
        data: result,
      });
    } catch (err) {
      console.error("Error-location-service", err);
      throw new APIError("Data Not found location-service", err);
    }
  }
}

module.exports = LocationsService;
