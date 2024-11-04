const mongoose = require("mongoose");

const User = mongoose.model("User", {
	username: String,
	password: String,
	roles: [String],
});

module.exports = User;

// Example usage:
