const jsonDBService = require('../jsonDatabaseService');
const { body, validationResult } = require('express-validator');

// Validator requirements for each method of Bike API
exports.validate = (method) => {
    switch (method) {
        case 'Bike_Create': {
            return [
                body('id')
                    .isLength({ min: 1 }).withMessage('ID field is required'),
                body('name')
                    .isLength({ min: 1 }).withMessage('Name is required'),
                body('year')
                    .optional()
                    .isInt().withMessage('Year must be an integer')
                    .isLength({ min: 4, max: 4 }).withMessage('Year must be 4 characters long')
            ]
        };
        case 'Bike_UpdateOne': {
            return [
                body('name')
                    .isLength({ min: 1 }).withMessage('Name is required'),
                body('year')
                    .optional()
                    .isInt().withMessage('Year must be an integer')
                    .isLength({ min: 4, max: 4 }).withMessage('Year must be 4 characters long')
            ]
        };
    }
}

exports.Bike_Create = function (req, res) {

    // Data validation not passing : Unprocessable Entity (422)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Bike_Create validation error(s) :" + JSON.stringify(errors.array()));
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        let allBikes = jsonDBService.load();

        // If bike with same ID already exists : Conflict (409)
        const bikeToRead = allBikes.find(bike => bike.id === req.body.id);
        if (bikeToRead) {
            return res.sendStatus(409);
        }

        // Add new bike object to DB object then write DB again
        let newBike = {
            id: req.body.id,
            name: req.body.name,
            brand: req.body.brand,
            year: req.body.year,
            type: req.body.type,
        };
        allBikes.push(newBike);
        jsonDBService.write(allBikes);

        // Object was added to Database successfully : Created (201)
        return res.sendStatus(201);
    } catch (err) {
        // Error when calling database service : Internal Server Error (500)
        return res.sendStatus(500);
    }
};


exports.Bike_ReadOne = function (req, res) {

    let id = req.params.id;

    try {
        // Load DB as an object then find the bike corresponding to the param ID
        let allBikes = jsonDBService.load();
        const bikeToRead = allBikes.find(bike => bike.id === id);

        if (bikeToRead) {
            // Bike was found : send it as JSON : OK (200)
            return res.send(bikeToRead);
        } else {
            // The ID doesn't exist : Not Found (404)
            return res.sendStatus(404);
        }
    } catch (err) {
        // Error when calling database service : Internal Server Error (500)
        return res.sendStatus(500);
    }
};


exports.Bike_ReadAll = async function (req, res) {
    try {
        let allBikes = jsonDBService.load();
        res.send(allBikes);
    } catch (err) {
        // Error when calling database service : Internal Server Error (500)
        return res.sendStatus(500);
    }
};


exports.Bike_UpdateOne = function (req, res) {

    // Data validation not passing : Unprocessable Entity (422)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Bike_UpdateOne validation error(s) :" + JSON.stringify(errors.array()));
        return res.status(422).json({ errors: errors.array() });
    }

    let id = req.params.id;
    try {
        // Load DB as an object and find bike to update
        let allBikes = jsonDBService.load();
        const bikeToUpdate = allBikes.find(bike => bike.id === id);
        if (bikeToUpdate) {
            // If bike to update was found, replace it with new bike datas
            let updatedBike = {
                id: req.params.id, // CANNOT CHANGE ID : keep the same (from params, not body)
                name: req.body.name,
                brand: req.body.brand,
                year: req.body.year,
                type: req.body.type,
            };
            var index = allBikes.indexOf(bikeToUpdate);
            allBikes[index] = updatedBike;
            jsonDBService.write(allBikes);

            // Update successful (but not returning any content) : No Content (204)
            return res.sendStatus(204);
        } else {
            // The ID doesn't exist : Not Found (404)
            return res.sendStatus(404);
        }
    } catch (err) {
        // Error when calling database service : Internal Server Error (500)
        return res.sendStatus(500);
    }
};


exports.Bike_DeleteOne = function (req, res) {
    let id = req.params.id;
    try {
        // Load DB as an object and find bike to delete
        let allBikes = jsonDBService.load();
        const bikeToDelete = allBikes.find(bike => bike.id === id);
        if (bikeToDelete) {
            var index = allBikes.indexOf(bikeToDelete);
            allBikes.splice(index);
            jsonDBService.write(allBikes);

            // Delete successful (but not returning any content) : No Content (204)
            return res.sendStatus(204);
        } else {
            // The ID doesn't exist : Not Found (404)
            return res.sendStatus(404);
        }
    } catch (err) {
        // Error when calling database service : Internal Server Error (500)
        return res.sendStatus(500);
    }
};