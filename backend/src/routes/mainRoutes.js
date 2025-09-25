import express from 'express'

import calBudget from '../controller/mainController.js'

const mainRouter = express.Router()

mainRouter.post('/budget', calBudget)

export default mainRouter