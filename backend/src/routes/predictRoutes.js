import express from 'express'
import predictBill from '../controller/predictController.js'

const predictRouter = express.Router()

predictRouter.post('/predict', predictBill)

export default predictRouter
