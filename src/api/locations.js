const LocationAuth = require("./middlewares/auth");
const { default: mongoose } = require("mongoose");
const LocationsService = require("../services/locations-service");
const now = new Date();

module.exports = (app) => {
  const locationService = new LocationsService();

  // ==================== Create new location ====================
  app.post("/create/new/location", async (req, res, next) => {
    console.log("API==>", "/create/new/location");
  
    try {
      const { storeId, locations } = req.body;
  
      // Validate storeId
      if (!storeId) {
        return res.status(400).json({ message: "storeId is required" });
      }
  
      // Validate locations array
      if (!locations || !Array.isArray(locations) || locations.length === 0) {
        return res.status(400).json({ message: "At least one location is required" });
      }
  
      // Validate each location in locations array
      for (const loc of locations) {
        if (!loc.locationName) {
          return res.status(400).json({ message: "locationName is required" });
        }
        if (!loc.address) {
          return res.status(400).json({ message: "address is required" });
        }
      }
  
      // Proceed to the service with valid data
      const newLocation = { storeId, locations };
      const { data } = await locationService.createNewLocation(newLocation);
  
      return res.json(data);
    } catch (err) {
      console.error("Error creating new location", err);
  
      // Check for Mongoose validation errors and send proper error response
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
  
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // ==================== Get Location by ID ====================
  app.get("/get/location/:locationId/:storeId", async (req, res, next) => {
    console.log("API==>", "/get/location/:locationId/:storeId");

    try {
        const locationId = req.params.locationId.trim();
        const storeId = req.params.storeId.trim(); 

        console.log("Params==>", { locationId, storeId });
        
        const locationData = await locationService.getLocation(locationId, storeId);

        return res.json(locationData);
    } catch (err) {
        console.error("Error getting location", err);

        // Send a proper error response to the client
        return res.status(500).json({
            message: "An error occurred while retrieving the location.",
            error: err.message
        });
    }
});

  // ==================== Update location data ====================
  app.put("/update/location/:locationId/:storeId", async (req, res, next) => {
    console.log("API==>", "/update/location/:locationId/:storeId");
  
    try {
        const { locationId, storeId } = req.params; 
        const updateData = req.body;
  
        const response = await locationService.updateOrAddLocation(locationId, storeId, updateData);
  
        return res.json(response);
    } catch (err) {
        console.error("Error updating location", err);
        next(err); 
    }
  });

  // ==================== Deactivate a Location ====================
  app.put("/location/deactivate/:locationId", async (req, res, next) => {
    console.log("API==>", `/location/deactivate/${req.params.locationId}`);

    try {
      const { locationId } = req.params;

      // Call the service to deactivate the location
      const deactivatedLocation = await locationService.deactivateLocation(locationId);

      // Return the formatted response
      return res.json(deactivatedLocation);
    } catch (err) {
      console.error("Error deactivating location", err);
      next(err);
    }
  });

  // ==================== Reactivate a Location ====================
  app.put("/location/reactivate", async (req, res) => {
    const { locationId } = req.body;

    if (!locationId) {
      return res.status(400).json({
        message: "locationId is required",
        status: false,
      });
    }

    try {
      const updatedLocation = await locationService.reactivateLocation(locationId);

      return res.status(200).json({
        message: "Location reactivated successfully",
        status: true,
        data: updatedLocation,
      });
    } catch (err) {
      console.error("Error reactivating location:", err);
      return res.status(500).json({
        message: err.message || "Internal Server Error",
        status: false,
      });
    }
  });
};
