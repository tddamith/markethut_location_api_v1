const {
    APIError,
    BadRequestError,
    STATUS_CODES,
  } = require("../../utils/app-errors");
  const { TestModel } = require("../models");
  
  class TestsRepository {
    //############ create new user ############
    async createNewUser({
      userId,
      firstName,
      businessName,
      BRno,
      mobileNo,
      userType,
      favoriteArea,
      password,
      salt,
      createdAt,
      profileAvatar,
      termsAndCondition,
      accountVerificationCode,
      isEmailVerification,
      isMobileVerification,
      isBRVerification,
      isBusinessVerification,
      isAdminVerification,
      isAccountVerification,
      isAccountBlock,
      documentURL,
      status,
    }) {
      try {
        const user = new TestModel({
          userId,
          firstName,
          businessName,
          BRno,
          mobileNo,
          userType,
          favoriteArea,
          password,
          salt,
          createdAt,
          profileAvatar,
          termsAndCondition,
          accountVerificationCode,
          isEmailVerification,
          isMobileVerification,
          isBRVerification,
          isBusinessVerification,
          isAdminVerification,
          isAccountVerification,
          isAccountBlock,
          documentURL,
          status,
        });
        return await user.save();
      } catch (err) {
        console.log("Error", err);
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Create user"
        );
      }
    }
  
    //############ Update mobile Verification ############
    async UpdateUserMobileVerification({ userId, mobileNoVerification }) {
      try {
        let filterQuery = { userId: userId };
        let updateQuery = {
          isMobileVerification: mobileNoVerification,
          isAccountVerification: true,
        };
        return await TestModel.findOneAndUpdate(filterQuery, updateQuery, {
          rawResult: true,
          upsert: true,
        });
      } catch (err) {
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to update mobile verification"
        );
      }
    }
  
    //############ Update mobile Verification ############
    async blockUser({ userId }) {
      try {
        let filterQuery = { userId: userId };
        let updateQuery = {
          isAccountBlock: true,
        };
        return await TestModel.findOneAndUpdate(filterQuery, updateQuery, {
          rawResult: true,
          upsert: true,
        });
      } catch (err) {
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to update mobile verification"
        );
      }
    }
  
    //############ Find existing username ############
    async FindExistingUser({ mobileNo }) {
      try {
        return await TestModel.findOne({
          mobileNo: mobileNo,
        }).select({
          firstName: 0,
          salt: 0,
          password: 0,
          accountVerificationCode: 0,
          BRno: 0,
          documentURL: 0,
          favoriteArea: 0,
          isAccountVerification: 0,
          isAdminVerification: 0,
          isBRVerification: 0,
          isBusinessVerification: 0,
          isEmailVerification: 0,
          lastUpdateAt: 0,
          status: 0,
          termsAndCondition: 0,
          businessName: 0,
          createdAt: 0,
          favorites: 0,
        });
      } catch (err) {
        console.log("FindExistingUser_error", err);
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Find user"
        );
      }
    }
  
    //############ Find existing username ############
    async FindExistingByUserId({ userId }) {
      try {
        return await TestModel.findOne({
          userId: userId,
        }).select({
          salt: 0,
          password: 0,
          accountVerificationCode: 0,
          BRno: 0,
          documentURL: 0,
          favoriteArea: 0,
          isAccountVerification: 0,
          isAdminVerification: 0,
          isBRVerification: 0,
          isBusinessVerification: 0,
          isEmailVerification: 0,
          lastUpdateAt: 0,
          // mobileNo: 0,
          status: 0,
          // termsAndCondition: 0,
          businessName: 0,
          createdAt: 0,
        });
      } catch (err) {
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Find user"
        );
      }
    }
  
    //############ Update User favorite Restaurants ############
    async UpdateUserFavoriteOffers({ userId, favorites }) {
      try {
        let filterQuery = { userId: userId };
        let updateQuery = {
          favorites: favorites,
        };
        console.log("updateQuery===>", updateQuery);
        return await TestModel.findOneAndUpdate(filterQuery, updateQuery, {
          rawResult: true,
          upsert: true,
        });
      } catch (err) {
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to update favorites"
        );
      }
    }
  
    async getUserData({ userId }) {
      try {
        return await TestModel.findOne({
          userId: userId,
        });
      } catch (err) {
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Find user"
        );
      }
    }
  
    //############ Update User Password ############
    async UpdateUserPassword({ userId, password, salt }) {
      try {
        let filterQuery = {
          userId: userId,
        };
        let updateQuery = {
          password: password,
          salt: salt,
        };
  
        return await TestModel.findOneAndUpdate(filterQuery, updateQuery, {
          rawResult: true,
          upsert: true,
        });
      } catch (err) {
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Find staff"
        );
      }
    }
  
    async GetFavoriteOfferByUser({ userId }) {
      try {
        // return await TestModel.findOne({
        //   userId: userId,
        // }).select({
        //   firstName: 0,
        //   salt: 0,
        //   password: 0,
        //   accountVerificationCode: 0,
        //   BRno: 0,
        //   documentURL: 0,
        //   isAccountVerification: 0,
        //   isAdminVerification: 0,
        //   isBRVerification: 0,
        //   isBusinessVerification: 0,
        //   isEmailVerification: 0,
        //   lastUpdateAt: 0,
        //   termsAndCondition: 0,
        //   businessName: 0,
        //   createdAt: 0,
        // });
        return await TestModel.aggregate([
          {
            $match: { userId: userId },
          },
          // Unwind the favorites array to process each favorite individually
          { $unwind: "$favorites" },
  
          // Lookup for offers
          {
            $lookup: {
              from: "offers",
              let: { offerId: "$favorites.offerId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$offerId", "$$offerId"] },
                  },
                },
                {
                  $project: {
                    offerId: 1,
                    bannerImageURL: 1,
                    label: 1,
                    header: 1,
                    createAt: 1,
                  },
                },
              ],
              as: "favoriteOffers",
            },
          },
  
          // Unwind the favoriteOffers array to include matched offer details
          {
            $unwind: {
              path: "$favoriteOffers",
              preserveNullAndEmptyArrays: true,
            },
          },
  
          // Lookup for banks
          {
            $lookup: {
              from: "banks",
              let: { bankId: "$favorites.bankId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$bankId", "$$bankId"] },
                  },
                },
                { $project: { bankId: 1, bankName: 1, logoURL: 1 } },
              ],
              as: "bank",
            },
          },
  
          // Unwind the bank array to include matched bank details
          { $unwind: { path: "$bank", preserveNullAndEmptyArrays: true } },
  
          // Lookup for merchants
          {
            $lookup: {
              from: "merchants",
              let: { merchantId: "$favorites.merchantId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$merchantId", "$$merchantId"] },
                  },
                },
                {
                  $project: {
                    merchantId: 1,
                    merchantName: 1,
                    contactNo: 1,
                    logoURL: 1,
                  },
                },
              ],
              as: "merchant",
            },
          },
  
          // Unwind the merchant array to include matched merchant details
          { $unwind: { path: "$merchant", preserveNullAndEmptyArrays: true } },
  
          // Lookup for categories
          {
            $lookup: {
              from: "categories",
              let: { categoryId: "$favorites.categoryId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$categoryId"] },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    categoryName: 1,
                  },
                },
              ],
              as: "category",
            },
          },
  
          // Unwind the category array to include matched category details
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
  
          // Group back to reconstruct the favorites array with detailed info
          {
            $group: {
              _id: "$_id",
              favorites: {
                $push: {
                  offer: "$favoriteOffers",
                  bank: "$bank",
                  merchant: "$merchant",
                  category: "$category",
                },
              },
              // Retain other fields (excluding the 'favorites' array to avoid duplication)
              userId: { $first: "$userId" },
              // Add other fields as necessary here
            },
          },
  
          // Project to include only necessary fields
          {
            $project: {
              _id: 1,
              userId: 1,
              favorites: 1,
              // Include other fields if necessary
            },
          },
        ]);
      } catch (err) {
        console.log("FindExistingUser_error", err);
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Find user"
        );
      }
    }
  }
  
  module.exports = TestsRepository;
