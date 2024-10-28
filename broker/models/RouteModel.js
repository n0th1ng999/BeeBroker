const mongoose = require("mongoose");

const Route = mongoose.model("Route", {
	pathSegment: mongoose.Types.String,
	value: Number,
	subRoutes: mongoose.Types.ArraySubdocument,
});

module.exports = Route;

// Example usage:
