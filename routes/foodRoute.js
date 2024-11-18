const express = require('express')
const { addFood, listFood, removeFood } = require('../controllers/foodcontroller')
const upload = require("../middleware/multer");

const foodRouter = express.Router()

foodRouter.post("/add", upload.fields([{name:"image",maxCount:1}]), addFood);
foodRouter.get('/list', listFood)
foodRouter.post('/remove',removeFood)

module.exports = foodRouter