/**
 * Dummy no-op movement controller
 **/
'use strict'

import RxTween from 'rxtween';
import Rx from 'rxjs-easing';

function tween(target, from=0, to=1, duration=1000) {
	console.log(`Tween ${target} from ${from} to ${to} in ${duration}`)
	return Promise.resolve()
}

function power(target, value) {
	return Promise.resolve()
}

function reset() {
	return Promise.resolve()
}

function drive(vector) {
	return Promise.resolve()
}

function setup() {
	return Promise.resolve()
}

module.exports = {
	setup,
	drive,
	tween,
	power,
	reset,
}

