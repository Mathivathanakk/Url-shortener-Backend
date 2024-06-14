import express from 'express';
import { activateAccount, forgotPassword, getUser, resetPassword, signinUser, signupUser } from '../Controllers/userController.js';
import authMiddlewares from '../Middlewares/authMiddleWare.js';



const router=express.Router();


router.post('/signup-user',signupUser)//signup
router.post('/signin-user',signinUser)//signin
router.post('/forgot-password',forgotPassword)//forgot password
router.post('/reset-password/:id/:token',resetPassword)//reset password
router.post('/activate-account/:id',activateAccount)//activate your account
router.get('/get-user',authMiddlewares,getUser)// getting authorized user




export default router