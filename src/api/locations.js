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
      const { storeId, locations } = req.body; // Expecting an array of locations
  
      const newLocation = {
        storeId: storeId,
        locations: locations,
      };
  
      const { data } = await locationService.createNewLocation(newLocation);
      return res.json(data);
    } catch (err) {
      console.error("Error creating new location", err);
      next(err);
    }
  });
 

  //==================== Get Location by ID ====================
  app.get("/get/location", async (req, res, next) => {
    console.log("API==>", "/get/location");

    try {
        const { locationId, storeId } = req.query;

        // Trim both locationId and storeId to remove any accidental spaces or newlines
        const trimmedLocationId = locationId.trim();
        const trimmedStoreId = storeId.trim();

        // Call the service layer to get the location information
        const locationData = await locationService.getLocationById(trimmedLocationId, trimmedStoreId);

        // If no data is found, return an appropriate response
        if (!locationData) {
            return res.status(404).json({
                message: "Location not found.",
                status: false,
                data: null
            });
        }

        // Respond with the location data
        return res.json(locationData);
    } catch (err) {
        console.error("Error getting location", err);
        next(err);
    }
});



  //==================== Update location data ====================
  app.put("/update/location/:locationId/:storeId", async (req, res, next) => {
    console.log("API==>", "/update/location/:locationId/:storeId");
  
    try {
      const { locationId, storeId } = req.params; // Get locationId and storeId from URL params
      const updateData = req.body; // Get update data from request body
  
      // Call the service to update location by both locationId and storeId
      const updatedLocation = await locationService.updateLocationById(locationId, storeId, updateData);
  
      // Return success response
      return res.json(updatedLocation);
    } catch (err) {
      console.error("Error updating location", err);
      next(err); // Pass error to middleware
    }
  });
  

  
};
