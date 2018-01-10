/**
 * Dummy no-op movement controller
 **/

'use strict'

function power(target, value) {
	return Promise.resolve()
}

function reset() {
	return Promise.resolve()
}

function move(vector) {
	return Promise.resolve()
}

module.exports = {
	move,
	power,
	reset,
}

