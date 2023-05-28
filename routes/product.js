const express = require("express");
const router = express.Router();

//get the controler
const authController = require("../controllers/auth.js");
const userController = require("../controllers/user.js");
const productController = require("../controllers/product");

//create a product
router
  .route("/product/create/:userId")
  .post(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    productController.create
  );

router
  .route("/product/:productId/:userId")
  .put(
    //update product
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    productController.update
  )
  .delete(
    //delete product
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    productController.delete
  );

//read single product info
router.route("/product/:productId").get(productController.read);

//read all product info
router.route("/products").get(productController.readAll);

//get product photo
router.route("/product/photo/:productId").get(productController.getPhoto);

//get product categorise
router.route("/products/categories").get(productController.getCategories);

//get search product
router.route("/products/by/search").post(productController.searchData);

//get  by typing product
router.route("/products/search").get(productController.querySearchData);

//show related product
router
  .route("/products/related/:productId")
  .get(productController.getRelatedProducts);

//find user by id
router.param("userId", userController.userById);
//find product by id
router.param("productId", productController.productById);

module.exports = router;
