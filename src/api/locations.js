const LocationAuth = require("./middlewares/auth");
const { default: mongoose } = require("mongoose");
const LocationsService = require("../services/locations-service");
const now = new Date();

module.exports = (app) => {
  const locationService = new LocationsService();

  //==================== create new location ====================
  app.post("/create/new/location", async (req, res, next) => {
    console.log("API==>", "/create/new/location");
    try {
      const {
        storeId,
        locations =[] ,
        userName,
        password,
        logoUrl,
        isEmailVerification,
        isAccountVerification,
      } = req.body;

      // Ensure locations is provided and is an array
      if (!locations || !Array.isArray(locations)) {
        return res.status(400).json({ error: "Locations must be a valid array" });
      }

      // Format locations array
      const formattedLocations = locations.map((location) => ({
        locationId: location.locationId,
        locationName: location.locationName,
        address: location.address,
        status: location.status,
      }));

      const { data } = await locationService.createNewLocation({
        storeId: new mongoose.Types.ObjectId(),
        locations: formattedLocations,
        userName: userName,
        password: password,
        logoUrl: logoUrl,
        isEmailVerification: isEmailVerification,
        isAccountVerification: isAccountVerification,
        createdAt: now.toISOString(),
        status: "new",
      });
      return res.json(data);
    } catch (err) {
      console.error("Error creating location", err);
      next(err);
    }
  });

  //==================== location authentication ====================
  app.post("/location/authentication", async (req, res, next) => {
    console.log("API==>", "/location/authentication");
    try {
      const { storeId, password } = req.body;

      const { data } = await locationService.signIn({
        storeId: storeId,
        password: password,
      });
      console.log("authentication", data);
      return res.json(data);
    } catch (err) {
      console.error("Error during authentication", err);
      next(err);
    }
  });

  //==================== Get location data by storeId ====================
  app.get("/find/existing/location/by/:storeId", async (req, res, next) => {
    console.log("API==>", "/find/existing/location/by/:storeId");

    try {
      const { storeId } = req.params;
      const { data } = await locationService.FindExistingLocationByStoreId({
        storeId,
      });
      console.log("data", data);
      return res.json(data);
    } catch (err) {
      console.error("Error finding location by storeId", err);
      next(err);
    }
  });

  //==================== Get location data by locationId ====================
  app.get("/get/location/by/:locationId", async (req, res, next) => {
    console.log("API==>", "/get/location/by/:locationId");

    try {
      const { locationId } = req.params;
      const { data } = await locationService.GetLocationById({
        locationId,
      });
      console.log("data", data);
      return res.json(data);
    } catch (err) {
      console.error("Error finding location by locationId", err);
      next(err);
    }
  });

  //==================== Update location password ====================
  app.put("/update/location/password", async (req, res, next) => {
    try {
      const { storeId, password } = req.body;
      const { data } = await locationService.UpdateLocationPassword({
        storeId: storeId,
        password: password,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  //==================== Add favorite offers to location ====================
  app.put("/add/location/favorite/offer", LocationAuth, async (req, res, next) => {
    console.log("API==>", "/add/location/favorite/offer");
    try {
      const { offerId, categoryId, merchantId, bankId } = req.body;
      const { locationId } = req.user;

      const { data } = await locationService.UpdateLocationFavoriteOffers({
        locationId: locationId,
        offerId: offerId,
        categoryId: categoryId,
        merchantId: merchantId,
        bankId: bankId,
      });

      return res.json(data);
    } catch (err) {
      console.error("Error:", err);
      next(err);
    }
  });

  //==================== Remove offer from location favorites ====================
  app.put("/remove/offer/from/location/favorite", LocationAuth, async (req, res, next) => {
    console.log("API==>", "/remove/offer/from/location/favorite");
    try {
      const { offerId } = req.body;
      const { locationId } = req.user;

      const { data } = await locationService.removeOfferFromLocationFavorite({
        locationId: locationId,
        offerId: offerId,
      });
      return res.json(data);
    } catch (err) {
      console.error("Error:", err);
      next(err);
    }
  });

  //==================== Get favorite offers by locationId ====================
  app.get("/get/offer/favorite/by/:locationId", LocationAuth, async (req, res, next) => {
    console.log("API==>", "/get/offer/favorite/by/:locationId");
    try {
      const { locationId } = req.params;
      const { data } = await locationService.getFavoriteOfferByLocation({
        locationId: locationId,
      });
      console.log("data", data);
      return res.json(data?.data);
    } catch (err) {
      console.error("Error getting favorite offers", err);
      next(err);
    }
  });

  //==================== Session validation using a token ====================
  app.get("/session/validate/:token", async (req, res, next) => {
    console.log("API==>", "/session/validate/:token");
    try {
      const { token } = req.params;
      const { data } = await locationService.SessionValidate({ token });
      console.log("session validate", data);
      return res.json(data);
    } catch (err) {
      console.error("Error validating session", err);
      next(err);
    }
  });
};
