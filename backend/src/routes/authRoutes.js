import express from 'express'
import { register, login, googleAuth } from '../controller/authController.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/google', googleAuth)

export default authRouter
