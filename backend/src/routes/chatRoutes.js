import express from 'express'
import chatWithGroq from '../controller/chatController.js'

const chatRouter = express.Router()

chatRouter.post('/chat', chatWithGroq)

export default chatRouter
