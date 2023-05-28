const express = require("express");
const router = express.Router();

//get the controler
const authController = require("../controllers/auth.js");
const userController = require("../controllers/user.js");
const categoryController = require("../controllers/category");

//create new category
router
  .route("/category/create/:userId")
  .post(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    categoryController.create
  );

// update / delete a category
router
  .route("/category/:categoryID/:userId")
  .put(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    categoryController.update
  )
  .delete(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    categoryController.delete
  );


//get single category
router.route('/category/:categoryID')
    .get(categoryController.read)

//get all category
router.route('/categories')
    .get(categoryController.readAll)    


//find user by id
router.param("userId", userController.userById);

//find category by id
router.param("categoryID", categoryController.categoryById);

module.exports = router;
