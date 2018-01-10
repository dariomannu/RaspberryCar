/**
 * Control movement with motors directly wired to an L298N unit
 **/

'use strict';

var gpio = require('../../gpio.js');

const PinMap = {
	FORWARD: 'GPIO25', // Blue wire
	BACK:    'GPIO24', // Red wire
	LEFT:    'GPIO22', // Yellow wire
	RIGHT:   'GPIO23', // Green wire
}

gpio.setup()
	.catch((e) => {
		console.error('GPIO Setup error', e);
		//process.exit(1);
	});

function move(vector) {
	var commands = []
	if( !vector ) {
		console.warn('Invalid vector', vector)
		vector = { x: 0, y: 0 }
	}

	if( 'y' in vector) {
		if(vector.y > 0 ) {
			commands.push(gpio.write( PinMap['BACK'],    false ))
			commands.push(gpio.write( PinMap['FORWARD'],  true ))
		} else if( vector.y < 0 ) {
			commands.push(gpio.write( PinMap['FORWARD'], false ))
			commands.push(gpio.write( PinMap['BACK'],     true ))
		} else if( vector.y === 0 ) {
			commands.push(gpio.write( PinMap['FORWARD'], false ))
			commands.push(gpio.write( PinMap['BACK'],    false ))
		}
	}

	if( 'x' in vector) {
		if( vector.x > 0 ) {
			commands.push(gpio.write( PinMap['LEFT'],    false ))
			commands.push(gpio.write( PinMap['RIGHT'],    true ))
		} else if( vector.x < 0 ) {
			commands.push(gpio.write( PinMap['RIGHT'],   false ))
			commands.push(gpio.write( PinMap['LEFT'],     true ))
		} else if( vector.x === 0 ) {
			commands.push(gpio.write( PinMap['RIGHT'],   false ))
			commands.push(gpio.write( PinMap['LEFT'],    false ))
		}
	}

	return Promise.all(commands)
}

module.exports = {
	move
}

