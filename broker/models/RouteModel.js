const mongoose = require("mongoose");

const valueSchema = new mongoose.Schema({
	timestamp: { type: Date, default: Date.now },
	value: { type: mongoose.Schema.Types.Mixed }, // Allows any data type
});

const RouteSchema = new mongoose.Schema({
	topic: { type: String, required: true },
	value: [valueSchema], 
});

const Route = mongoose.model("Route", RouteSchema);

module.exports = Route;
