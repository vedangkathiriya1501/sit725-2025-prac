const carService = require('../services/carService');
exports.getAllCars = (req, res) => {
const items = carService.getAllCars();
res.json({ data: items });
};