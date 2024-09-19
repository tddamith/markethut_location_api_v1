const UserAuth = require("./middlewares/auth");
const { default: mongoose } = require("mongoose");
const UsersService = require("../services/tests-service");
const now = new Date();

module.exports = (app) => {
  const userService = new UsersService();

  //==================== create new user ====================
  app.post("/create/new/user", async (req, res, next) => {
    console.log("API==>", "/create/new/user");
    try {
      const {
        userType,
        firstName,
        password,
        businessName,
        BRno,
        mobileNo,
        favoriteArea,
        termsAndCondition,
      } = req.body;

      const { data } = await userService.createNewUser({
        userId: new mongoose.Types.ObjectId(),
        firstName: firstName,
        businessName: businessName,
        BRno: BRno,
        mobileNo: mobileNo,
        userType: userType && userType.toString(),
        favoriteArea: favoriteArea,
        password: password,
        createdAt: now.toISOString(),
        termsAndCondition: termsAndCondition,
        status: "new",
      });
      return res.json(data);
    } catch (err) {
      console.error("data", err);
      next(err);
    }
  });

  //==================== user authentication ====================
  app.post("/user/authentication", async (req, res, next) => {
    console.log("API==>", "/user/authentication");
    try {
      const { mobileNo, password, userId } = req.body;

      const { data } = await userService.signIn({
        password: password,
        mobileNo: mobileNo,
        userId: userId,
      });
      console.log("authentication", data);
      return res.json(data);
    } catch (err) {
      console.error("data", err);
      next(err);
      return res.json(data);
    }
  });

  //==================== Get user data  ====================
  // Define a route for finding an existing user by mobile number
  app.get("/find/existing/user/by/:mobileNo", async (req, res, next) => {
    console.log("API==>", "/find/existing/user/by/:mobileNo");

    try {
      // Extract the mobile number from the request parameters
      const { mobileNo } = req.params;
      // Find the existing user using the userService
      const { data } = await userService.FindExistingUserByMobileNo({
        mobileNo,
      });
      console.log("data", data);
      return res.json(data);
    } catch (err) {
      // Log the error for debugging purposes
      console.error("Error finding user by mobile number", err);
      // Pass the error to the next middleware
      next(err);
      // Optionally send an error response to the client
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //==================== Get user data  ====================
  // Define a route for finding an existing user by mobile number
  app.get("/get/user/by/:userId", UserAuth, async (req, res, next) => {
    console.log("API==>", "/get/user/by/:userId");

    try {
      // Extract the mobile number from the request parameters
      const { userId } = req.params;
      // Find the existing user using the userService
      const { data } = await userService.GetUserById({
        userId,
      });
      console.log("data", data);
      return res.json(data);
    } catch (err) {
      // Log the error for debugging purposes
      console.error("Error finding user by mobile number", err);
      // Pass the error to the next middleware
      next(err);
      // Optionally send an error response to the client
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //==================== Get waiter by id ====================
  app.put("/update/user/password", async (req, res, next) => {
    try {
      const { userId, password } = req.body;
      const { data } = await userService.UpdateUserPassword({
        userId,
        password,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  //==================== update user favorite offers ====================
  app.put("/add/user/favorite/offer", UserAuth, async (req, res, next) => {
    console.log("API==>", "/add/user/favorite/offer");
    try {
      const { offerId, categoryId, merchantId, bankId } = req.body;
      const { userId } = req.user;

      const { data } = await userService.UpdateUserFavoriteOffers({
        userId: userId,
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

  //==================== remove offer from user favorite ====================
  app.put(
    "/remove/offer/from/user/favorite",
    UserAuth,
    async (req, res, next) => {
      console.log("API==>", "/remove/offer/from/user/favorite");
      try {
        const { offerId } = req.body;
        const { userId } = req.user;

        const { data } = await userService.removeOfferFromUserFavorite({
          userId: userId,
          offerId: offerId,
        });
        return res.json(data);
      } catch (err) {
        console.error("data", err);
        next(err);
      }
    }
  );

  app.get(
    "/get/offer/favorite/by/:userId",
    UserAuth,
    async (req, res, next) => {
      console.log("API==>", "/get/offer/favorite/by/:userId");
      try {
        const { userId } = req.params;
        const { data } = await userService.getFavoriteOfferByUser({
          userId: userId,
        });
        console.log("data", data);
        return res.json(data?.data);
      } catch (err) {
        console.error("get_all_users", err);
        next(err);
      }
    }
  );

  // Define a route for session validation using a token
  app.get("/session/validate/:token", async (req, res, next) => {
    console.log("API==>", "/session/validate/:token");
    try {
      // Extract the token from the request parameters
      const { token } = req.params;
      const { data } = await userService.SessionValidate({ token });
      console.log("session validate", data);
      return res.json(data);
    } catch (err) {
      // Log the error for debugging purposes
      console.error("Error validating session", err);
      // Pass the error to the next middleware
      next(err);
      // Optionally send an error response to the client
      // Note: 'data' is undefined here, so use an appropriate error message
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

};