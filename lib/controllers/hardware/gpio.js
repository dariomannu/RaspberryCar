/**
 * Control movement with motors directly wired to an L298N unit
 **/

'use strict';

const gpio = require('rpi-gpio');

const pinMap = {
	FORWARD: 24, // Blue wire
	BACK:    23, // Red wire
	LEFT:    21, // Yellow wire
	RIGHT:   22, // Green wire
}

const setup = () => {
	gpio.setMode(gpio.MODE_RPI)
	return Promise.all(Object.keys(pinMap).map(pinName => new Promise((resolve, reject) => {
		const pin = pinMap[pinName]
		//console.log(`gpio.setup ${pin}`, pin)
		gpio.setup(pin, gpio.DIR_OUT, err => {
			err && reject(err) || resolve()
		})
	})))
	.catch((e) => {
		console.error('GPIO Setup error', e);
		process.exit(1);
	});
}

function drive(vector) {
	var commands = []
	if( !vector ) {
		console.warn('Invalid vector', vector)
		vector = { x: 0, y: 0 }
	}

	if( 'y' in vector) {
		if(vector.y > 0 ) {
			commands.push(gpio.write( pinMap['BACK'],    false ))
			commands.push(gpio.write( pinMap['FORWARD'],  true ))
		} else if( vector.y < 0 ) {
			commands.push(gpio.write( pinMap['FORWARD'], false ))
			commands.push(gpio.write( pinMap['BACK'],     true ))
		} else if( vector.y === 0 ) {
			commands.push(gpio.write( pinMap['FORWARD'], false ))
			commands.push(gpio.write( pinMap['BACK'],    false ))
		}
	}

	if( 'x' in vector) {
		if( vector.x > 0 ) {
			commands.push(gpio.write( pinMap['LEFT'],    false ))
			commands.push(gpio.write( pinMap['RIGHT'],    true ))
		} else if( vector.x < 0 ) {
			commands.push(gpio.write( pinMap['RIGHT'],   false ))
			commands.push(gpio.write( pinMap['LEFT'],     true ))
		} else if( vector.x === 0 ) {
			commands.push(gpio.write( pinMap['RIGHT'],   false ))
			commands.push(gpio.write( pinMap['LEFT'],    false ))
		}
	}

	return Promise.all(commands)
}

module.exports = {
	setup,
	drive,
}

