/**
* Movement Controller interface
**/

const path = require('path')

module.exports = function (controllerImplementation) {
	if (!controllerImplementation)
		throw new Error('Invalid hardware controller "${controller}"')

	return require(path.join(__dirname, controllerImplementation +'.js'))
}

