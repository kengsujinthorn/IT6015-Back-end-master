const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");
// const pdfUpload = require("../middleware/pdf-upload");

const router = express.Router();

router.get("/", usersController.getUsers);

router.get("/application/:jid", usersController.getUserByApp);

router.post(
  "/signup",
  // fileUpload.fields(
  //   [
  //     {
  //       name: 'image',
  //       maxCount: 1
  //     }
  //   ]
  // ),
  fileUpload.single("image"),

  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    // check("companyAddress").not().isEmpty(),
    check("telNo").not().isEmpty(),
    // check("employer").not().isEmpty(),
    // check("dob").not().isEmpty(),
    // check("website").not().isEmpty(),
    // check("resume").not().isEmpty()
    check("telNo").not().isEmpty(),
    check("employer").not().isEmpty(),
  ],

  usersController.signup
);

router.post("/login", usersController.login);

router.post("/apply/:jobId", usersController.applyJob);

module.exports = router;
