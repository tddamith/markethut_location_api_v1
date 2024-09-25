const LocationAuth = require("./middlewares/auth");
const { default: mongoose } = require("mongoose");
const LocationsService = require("../services/locations-service");
const now = new Date();

module.exports = (app) => {
  const locationService = new LocationsService();

  //==================== Create new location ====================
  app.post("/create/new/location", async (req, res, next) => {
    console.log("API==>", "/create/new/location");

    try {
      const {
        locations = [],
        userName,
        password,
        logoUrl,
        isEmailVerification,
        isAccountVerification,
      } = req.body;

      // Prepare the data to be saved
      const locationData = {
        locations,
        userName,
        password, // Ensure to hash the password in the service
        logoUrl: logoUrl || null,
        isEmailVerification: isEmailVerification || false,
        isAccountVerification: isAccountVerification || false,
        createdAt: now.toISOString(),
        status: "new",
      };

      // Call the service to create the new location
      const data = await locationService.createNewLocation(locationData);

      // Return success response
      return res.status(201).json({ message: "Location created successfully", data });
    } catch (err) {
      console.error("Error creating location:", err.message || err);
      next(err); // Pass error to next middleware
    }
  });

  //==================== Get location data by ID ====================
  app.get("/get/location/by/:locationId", async (req, res, next) => {
    console.log("API==>", "/get/location/by/:locationId");

    try {
      const { locationId } = req.params;

      // Call the service to get location by ID
      const locationData = await locationService.getLocationById(locationId);

      if (!locationData) {
        return res.status(404).json({ message: "Location not found" });
      }

      // Return the location data
      return res.json({
        status: true,
        message: "Location retrieved successfully",
        data: locationData,
      });
    } catch (err) {
      console.error("Error fetching location", err);
      next(err); // Pass error to middleware
    }
  });

  //==================== Update location data ====================
  app.put("/update/location/:locationId", async (req, res, next) => {
    console.log("API==>", "/update/location/:locationId");

    try {
      const { locationId } = req.params;
      const updateData = req.body; // Get update data from request body

      // Call the service to update location by ID
      const updatedLocation = await locationService.updateLocationById(locationId, updateData);

      // Return success response
      return res.json({
        status: true,
        message: "Location updated successfully",
        data: updatedLocation,
      });
    } catch (err) {
      console.error("Error updating location", err);
      next(err); // Pass error to middleware
    }
  });
};
