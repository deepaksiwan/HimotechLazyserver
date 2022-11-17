const express =require("express")
const router=express.Router()
const {
  login,
  signup,
  forgotPassword,
  resetPassword,
  viewProfile,
  editProfile,
  updateProfilePic
} =require('../controllers/profileController');
const {verifyToken}=require('../middleware/auth')


/**
* @swagger
* /api/v1/Profile/signup:
*   post:
*     tags:
*       - Profiles
*     description: Login
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
router.post("/signup",signup)



 /**
 * @swagger
 * /api/v1/Profile/login:
 *   post:
 *     tags:
 *       - Profiles
 *     description: login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: login .
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/login'
 *     responses:
 *       200:
 *         description: Thanks, You have successfully Login.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */

router.post('/login',login);


router.post('/forgot',forgotPassword);

router.post('/reset/:id/:token',resetPassword);


/**
 * @swagger
 * /api/v1/Profile/viewProfile:
 *   get:
 *     security:
 *       - bearerAuth
 *     tags:
 *       - Profiles
 *     description: view profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Token required.
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Profile data succesfully  fetched
 *       404:
 *         description: The profile is not found
 *       501:
 *         description: Something went wrong!
 */
router.get("/viewProfile",verifyToken,viewProfile);

// /**
//  * @swagger
//  * /api/v1/Profile/create:
//  *   post:
//  *     summary: Create a new Profile
//  *     tags: [Profiles]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Profile'
//  *     responses:
//  *       201:
//  *         description: The Profile was successfully created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Profile'
//  *       500:
//  *         description: Some server error
//  *       501:
//  *         description: Something went wrong!
//  */
// router.post("/create",createProfileCollection)

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
 *       - name: Authorization
 *         description: Authorization required.
 *         in: header
 *         required: true
 *       - name: editProfile
 *         description: profile  edit as per need.
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
router.put("/editProfile",verifyToken,editProfile);

router.put("/updateProfilePic",verifyToken,updateProfilePic);
module.exports=router