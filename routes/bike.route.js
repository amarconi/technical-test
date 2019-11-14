const express = require('express');
const router = express.Router();

const bikeController = require('../controllers/bike.controller');

router.post('/',
    bikeController.validate('Bike_Create'),
    bikeController.Bike_Create);

router.get('/:id',
    bikeController.Bike_ReadOne);

router.get('/',
    bikeController.Bike_ReadAll);

router.put('/:id',
    bikeController.validate('Bike_UpdateOne'),
    bikeController.Bike_UpdateOne);

router.delete('/:id',
    bikeController.Bike_DeleteOne);


module.exports = router;