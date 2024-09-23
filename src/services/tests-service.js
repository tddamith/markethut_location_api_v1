/*const { default: mongoose } = require("mongoose");
const {
  UsersRepository,
  MobileNoVerificationRepository,
  OffersRepository,
} = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  ValidatePassword,
  GenerateSignature,
  GenerateOTPSignature,
  SessionValidate,
} = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-errors");
const jwt = require("jsonwebtoken");
const { OtPGenerate } = require("../utils/verification-code-handler");

const now = new Date();

class UsersService {
  constructor() {
    this.repository = new UsersRepository();
  }

  // ############ Get user by mobileNo ############
  async FindExistingUserByMobileNo(userInputs) {
    console.log("find User ===>", { userInputs });
    const { mobileNo } = userInputs;
    try {
      const result = await this.repository.FindExistingUser({ mobileNo });
      console.log("get user ==> :", result);
      let token = "";
      if (result?.userId) {
        token = await GenerateOTPSignature({
          firstName: result.firstName,
          userId: result.userId,
          mobileNo: result.mobileNo,
        });
      }
      return FormateData({
        status: !!result,
        message: result ? "found user data." : "user not found",
        data: result,
        token: token,
      });
    } catch (err) {
      console.error("Error-user-service", err);
      throw new APIError("Data Not found user-service", err);
    }
  }

  // ############ Get user by userId ############
  async GetUserById(userInputs) {
    console.log("find User ===>", { userInputs });
    const { userId } = userInputs;
    try {
      const result = await this.repository.FindExistingByUserId({ userId });
      console.log("get user ==> :", result);
      return FormateData({
        status: !!result,
        message: result ? "found user data." : "user not found",
        data: result,
      });
    } catch (err) {
      console.error("Error-user-service", err);
      throw new APIError("Data Not found user-service", err);
    }
  }

  // ############ Create new user ############
  async createNewUser(userInputs) {
    console.log("create new User ===>", { userInputs });
    const {
      userId,
      firstName,
      businessName,
      BRno,
      mobileNo,
      userType,
      favoriteArea,
      password,
      createdAt,
      termsAndCondition,
      status,
    } = userInputs;

    try {
      const isExisting = await this.repository.FindExistingUser({ mobileNo });
      console.log("existing user ===>", { isExisting });

      if (!isExisting && password) {
        let salt = await GenerateSalt();
        let userPassword = await GeneratePassword(password, salt);
        const result = await this.repository.createNewUser({
          userId,
          firstName,
          businessName,
          BRno,
          mobileNo,
          userType,
          favoriteArea,
          password: userPassword,
          salt,
          termsAndCondition,
          accountVerificationCode: 0,
          isEmailVerification: false,
          isMobileVerification: false,
          isBRVerification: false,
          isBusinessVerification: false,
          isAdminVerification: false,
          isAccountVerification: false,
          isAccountBlock: false,
          documentURL: null,
          status,
          createdAt,
          updateAt: createdAt,
        });

        // send OTP
        let token = await GenerateOTPSignature({
          firstName,
          userId,
          mobileNo,
        });
        const otpCode = await OtPGenerate();

        // Here, send OTP logic can be added (e.g., sendOTP({ mobileNo: "+94" + mobileNo, OTP: otpCode }));

        return FormateData({
          status: !!result,
          message: result ? "User create Success." : "User create error",
          data: {
            user: result,
            token: token,
          },
        });
      }
      return FormateData({
        status: false,
        message: "user is existing.",
        data: {
          userId: isExisting && isExisting.userId,
          firstName: isExisting && isExisting.firstName,
          status: isExisting && isExisting.status,
        },
      });
    } catch (err) {
      console.error("Error User service", err);
      throw new APIError("Data Not found User service", err);
    }
  }

  // ############ Authentication (SignIn) ############
  async signIn(userInputs) {
    console.log("sign in admin user ===>", { userInputs });
    const { mobileNo, password, userId } = userInputs;

    try {
      const existingUser = await this.repository.getUserData({ userId });
      console.log("existing user ===>", { existingUser });

      if (existingUser) {
        const validPassword = await ValidatePassword(
          password,
          existingUser.password,
          existingUser.salt
        );
        console.log("valid password status====>", validPassword);

        if (validPassword) {
          let token = await GenerateSignature({
            firstName: existingUser.firstName,
            userId: existingUser.userId,
            mobileNo: existingUser.mobileNo,
            userType: existingUser.userType,
          });

          const user = await this.repository.FindExistingByUserId({ userId });
          console.log("token", token);

          return FormateData({
            status: !!token,
            message: token ? "login ok." : "login error",
            token: token,
            data: user,
          });
        }
      }
      return FormateData({
        status: false,
        message: "invalid user",
        data: {},
      });
    } catch (err) {
      console.error("Error admin user service", err);
      throw new APIError("Data Not found admin user service", err);
    }
  }

  // ############ Update User Password ############
  async UpdateUserPassword(userInputs) {
    console.log("update User ===>", { userInputs });
    const { userId, password } = userInputs;

    try {
      const existingUser = await this.repository.FindExistingByUserId({ userId });
      console.log("existing User ===>", { existingUser });

      if (existingUser) {
        let salt = await GenerateSalt();
        let userPassword = await GeneratePassword(password, salt);

        const userResult = await this.repository.UpdateUserPassword({
          userId,
          password: userPassword,
          salt,
        });

        const updatedUser = await this.repository.FindExistingByUserId({ userId });

        return FormateData({
          status: !!userResult,
          message: userResult ? "User update success." : "User update error",
          data: updatedUser,
        });
      }
      return FormateData({
        status: false,
        message: "User Mobile No is not existing.",
        data: existingUser,
      });
    } catch (err) {
      console.error("Error User service", err);
      throw new APIError("Data Not found User service", err);
    }
  }

  // ############ Update User Favorite Offers ############
  async UpdateUserFavoriteOffers(userInputs) {
    try {
      console.log("update user ===>>", { userInputs });

      const { userId, offerId, categoryId, merchantId, bankId } = userInputs;

      const existingUser = await this.repository.FindExistingByUserId({ userId });
      console.log("existingUser :::", existingUser);

      if (!existingUser) {
        return FormateData({
          status: false,
          message: "User not found",
          data: null,
        });
      }

      const updatedFavorites = existingUser.favorites
        ? [...existingUser.favorites, { offerId, categoryId, merchantId, bankId }]
        : [{ offerId, categoryId, merchantId, bankId }];

      const result = await this.repository.UpdateUserFavoriteOffers({
        userId,
        favorites: updatedFavorites,
      });

      const updatedUser = await this.repository.FindExistingByUserId({ userId });

      return FormateData({
        status: !!result,
        message: result ? "User update success." : "User update error",
        data: {
          user: updatedUser,
          token: "",
        },
      });
    } catch (err) {
      console.error("Error-user-service", err);
      throw new APIError("Data not found in user-service", err);
    }
  }

  // ############ Remove Offer from User Favorite ############
  async removeOfferFromUserFavorite(userInputs) {
    console.log("remove favorite ===>", { userInputs });
    const { userId, offerId } = userInputs;

    try {
      const isExisting = await this.repository.FindExistingByUserId({ userId });
      console.log("existEvent :::", isExisting);

      if (isExisting) {
        let favorites = isExisting.favorites || [];

        favorites = favorites.filter(fav => fav.offerId !== offerId);

        const result = await this.repository.UpdateUserFavoriteOffers({
          userId,
          favorites,
        });

        const updatedUser = await this.repository.FindExistingUser({ mobileNo: isExisting.mobileNo });

        return FormateData({
          status: !!result,
          message: result ? "User update success." : "User update error",
          data: {
            user: updatedUser,
            token: "",
          },
        });
      } else {
        return FormateData({
          status: !!isExisting,
          message: "User not found",
          data: isExisting,
        });
      }
    } catch (err) {
      console.error("Error-user-service", err);
      throw new APIError("Data Not found user-service", err);
    }
  }

  // ############ Get Favorite Offers by User ############
  async getFavoriteOfferByUser(userInputs) {
    console.log("find favorite offers ===>", { userInputs });
    const { userId } = userInputs;

    try {
      const result = await this.repository.GetFavoriteOfferByUser({ userId });
      console.log("get user ==> :", result);

      return FormateData({
        status: !!result,
        message: result ? "found user data." : "user not found",
        data: result,
      });
    } catch (err) {
      console.error("Error-user-service", err);
      throw new APIError("Data Not found user-service", err);
    }
  }

  // ############ Session Validation ############
  async SessionValidate(userInputs) {
    const { token } = userInputs;
    console.log("useVerification, token", token);

    try {
      const status = await SessionValidate({ token });

      return FormateData({
        status: !!status,
        message: status ? "session secure," : "invalid session",
        token,
        data: [],
      });
    } catch (err) {
      console.error("Error admin user service", err);
      throw new APIError("Data Not found admin user service", err);
    }
  }
}

module.exports = UsersService;*/
