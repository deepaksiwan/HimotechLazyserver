const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  forgotPassword,
  resetPassword,
  viewProfile,
  editProfile,
  updateProfilePic,
} = require("../controllers/profileController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/v1/Profile/signup:
 *   post:
 *     tags:
 *       - Profiles
 *     description: Signup
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email required.
 *         in: formData
 *         required: true
 *       - name: userName
 *         description: userName required.
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, You have successfully signup.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/v1/profile/login:
 *   post:
 *     tags:
 *       - Profiles
 *     description: login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email required.
 *         in: formData
 *         required: true
 *       - name: password
 *         description: Password required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, You have successfully Login.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */


router.post("/login", login);


/**
 * @swagger
 * /api/v1/profile/forget:
 *   post:
 *     tags:
 *       - Profiles
 *     description: forget password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, OTP successfully send on email.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */

router.post("/forget", forgotPassword);

/**
 * @swagger
 * /api/v1/profile/reset:
 *   post:
 *     tags:
 *       - Profiles
 *     description: reset password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: newPassword
 *         description: newPassword required.
 *         in: formData
 *         required: true
 *       - name: confirmPassword
 *         description: confirmPassword required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks,Your Password reset successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.post("/reset", resetPassword);

/**
 * @swagger
 * /api/v1/Profile/viewProfile:
 *   get:
 *     tags:
 *       - Profiles
 *     description: view profile
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Profile data succesfully  fetched
 *       404:
 *         description: The profile is not found
 *       501:
 *         description: Something went wrong!
 */
router.get("/viewProfile", verifyToken, viewProfile);



/**
 * @swagger
 * /api/v1/profile/editProfile:
 *   put:
 *     tags:
 *       - Profiles
 *     description: editProfile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: editProfile
 *         description: profile edit.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/editProfile'
 *     responses:
 *       200:
 *         description: Profile Edit Successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.put("/editProfile", verifyToken, editProfile);

/**
 * @swagger
 * /api/v1/profile/updateProfilePic:
 *   put:
 *     tags:
 *       - Profiles
 *     description: editProfile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: updateProfilePic
 *         description: change profile pic.
 *         in: formData
 *         required: true
 *         schema:
 *            type: string
 *            properties:
 *                profilePic:
 *                type: string
 *     responses:
 *       200:
 *         description: Profile Edit Successfully.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.put("/updateProfilePic", verifyToken, updateProfilePic);
module.exports = router;
