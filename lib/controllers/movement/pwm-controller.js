/**
 * Control movement with motors wired to a PCA9685 unit
 **/

'use strict'

var pca9685 = require('../../pwm.js')

const PWM_MAX = 4095
const PWMPortMap = {
	//        PORT     Anode wire/Cathode wire
	FORWARD:   '0', // Blue/GND
	BACK:      '1', // Red/GND
	LEFT:      '2', // Yellow/GND
	RIGHT:     '3', // Green/GND
	ENGINE:    '4', // Red/Black
	LIGHT:     '5', // Red/Black
	BACKLIGHT: '6', // Purple/Black
	LASER:     '7', // Orange/Yellow
}

function reset() {
	return Promise.all([...Array(12).keys()].map(x=>pca9685.pwm(x, 0)))
}

/**
  * Move
  * @param vector({float x: [0..1], float y: [0..1]})
  * @return Promise
 **/
function move(vector) {
	var commands = []
	if( !vector || !('x' in vector || 'y' in vector) || (vector.x > 1 || vector.y > 1) ) {
		//console.warn('Invalid movement vector', vector)
		move({ x: 0, y: 0 })
		return Promise.reject('Invalid movement vector' +vector)
	}

	let x = Math.abs(vector.x) *PWM_MAX
	let y = Math.abs(vector.y) *PWM_MAX

	if( 'y' in vector) {
		if(vector.y > 0 ) {
			commands.push(pca9685.pwm( PWMPortMap['BACK'],    0 ))
			commands.push(pca9685.pwm( PWMPortMap['FORWARD'], y ))
		} else if( vector.y < 0 ) {
			commands.push(pca9685.pwm( PWMPortMap['FORWARD'], 0 ))
			commands.push(pca9685.pwm( PWMPortMap['BACK'],    y ))
		} else if( vector.y === 0 ) {
			commands.push(pca9685.pwm( PWMPortMap['FORWARD'], 0 ))
			commands.push(pca9685.pwm( PWMPortMap['BACK'],    0 ))
		}
	}

	if( 'x' in vector) {
		if( vector.x > 0 ) {
			commands.push(pca9685.pwm( PWMPortMap['LEFT'],  0 ))
			commands.push(pca9685.pwm( PWMPortMap['RIGHT'], x ))
		} else if( vector.x < 0 ) {
			commands.push(pca9685.pwm( PWMPortMap['RIGHT'], 0 ))
			commands.push(pca9685.pwm( PWMPortMap['LEFT'],  x ))
		} else if( vector.x === 0 ) {
			commands.push(pca9685.pwm( PWMPortMap['RIGHT'], 0 ))
			commands.push(pca9685.pwm( PWMPortMap['LEFT'],  0 ))
		}
	}

	return Promise.all(commands)
}

/**
  * Power
  * @param target PCA9685 port number
  * @param value PWM value
  * @return Promise
 **/
function power(target, value) {
	if( !PWMPortMap[target] || isNaN(value) ) {
		console.warn('Invalid power request', target, value)
		return Promise.reject('Invalid PWM power request:', target, value)
	} else {
		return pca9685.pwm(PWMPortMap[target], Math.abs(value) *PWM_MAX)
	}
}

module.exports = {
	move,
	power,
	reset,
}

