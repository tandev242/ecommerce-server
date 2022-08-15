const express = require('express')
const { signup, signin, signinWithGoogle, isUserLoggedIn, sendOtpToEmail, updateForgetPassword } = require('../controllers/auth')
const { verifyOtp } = require('../controllers/otp')
const { validateSignupRequest, validateSigninRequest, validateForgotPasswordRequest, isRequestValidated } = require('../validators')
const { requireSignin } = require('../common-middleware')

const router = express.Router()

router.post('/signup', validateSignupRequest, isRequestValidated, signup)
router.post('/signin',validateSigninRequest, isRequestValidated, signin)
router.post('/signin/google', signinWithGoogle)
router.post('/verifyOtp', verifyOtp)
router.post('/sendOtpToEmail', sendOtpToEmail)
router.post('/updateForgetPassword', validateForgotPasswordRequest, updateForgetPassword)
router.post('/isUserLoggedIn', requireSignin, isUserLoggedIn)

module.exports = router