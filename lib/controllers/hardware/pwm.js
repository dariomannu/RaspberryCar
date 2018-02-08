/**
 * Control movement with motors wired to a pca9685 unit
 * /usr/sbin/i2cset -y 1 0x40 0 128
 **/

'use strict'

const MAX_PWM_PORTS = 16 // pca9685 has 16 PWM ports
const PWM_MAX = 4095
const SERVO_STEERING = true // using a servo motor for steering?

import RxTween from 'rxtween';
import Rx from 'rxjs-easing';
const pca9685config = {
	"freq": "50",   // frequency of the device
	"correctionFactor": "1.118", // correction factor - fine tune the frequency
	"address": 0x40, // i2c bus address
	"device": '/dev/i2c-1', // device name
	//"debug": console.log // adds some debugging methods if set
}
const pca9685lib = require('@dariomannu/adafruit-pca9685')
var pca9685controller = pca9685lib(pca9685config)

const state = Array(MAX_PWM_PORTS) // state of each PWM port
const PWMPortMap = {
	//         PWM PORT#    Anode/Control/Cathode wires
	FORWARD:      '0',   // Red/none/GND
	REVERSE:      '1',   // Yellow/none/GND
	LEFT:         '2',   // Green/none/GND
	RIGHT:        '3',   // Blue/none/GND

	ENGINE:       '4',   // Red/none/Black
	LIGHT:        '5',   // Red/none/Black
	BACKLIGHT:    '6',   // Purple/none/Black
	LASER:        '7',   // Orange/none/Yellow

	// :            '8', // ...
	// :            '9', // ...
	// :           '10', // ...
	STEER:       '11',   // Orange/Yellow/Brown

	// :            '8', // ...
	// :            '9', // ...
	// :           '10', // ...
	// :           '11', // ...
}

/**
  * Perform initial sanity tests and return
 **/
function setup() {
	return Promise.resolve()
}

/**
  * Disable PWM
  * pause/disable PCA9685 operation by setting the "enable" pin high
 **/
function disable() {
	// TODO
}

/**
  * Reset all PWM channels
 **/
function cleanUp() {
	pca9685controller.stop()
}

/**
  * private setState
  * remember chip state locally to help transitions
  * @param port number
  * @param v number [0..1]
  * @return Promise
 **/
function setState(port, v) {
	var p = parseInt(PWMPortMap[port])
	state[p] = v
}

/**
  * private getState
  * get locally saved chip state
  * @param port number
  * @return Promise
 **/
function getState(port) {
	var p = parseInt(port)
	return state[p] || 0
}

/**
  * reset()
  * zero-out all ports - stop everything
 **/
function reset() {
	let motors = [
		PWMPortMap['FORWARD'],
		PWMPortMap['REVERSE'],
		PWMPortMap['LEFT'],
		PWMPortMap['RIGHT'],
	].map(x => power(x, 0))

	let lights = [...Array(12).keys()].map(x=>tween(x +motors.length, getState(x +motors.length), 0, 250))

	return Promise.all([].concat(motors, lights))
		.then([...Array(16).keys()].forEach(p=>setState(p, 0)))
}

/**
  * Drive
  * drive vehicle/turn - movement vector defines power
  * @param vector({float x: [0..1], float y: [0..1]})
  * @return Promise
 **/
function drive(vector) {
	var commands = []
	if( !vector || !('x' in vector || 'y' in vector) || (vector.x > 1 || vector.y > 1) ) {
		drive({ x: 0, y: 0 })
		return Promise.reject(`Invalid movement vector ${vector}`)
	}

	if( 'y' in vector ) {
		let yMod = Math.abs(vector.y)

		if(vector.y > 0 ) {
			commands.push(power( PWMPortMap['REVERSE'],    0 ))
			commands.push(power( PWMPortMap['FORWARD'], yMod ))
		} else if( vector.y < 0 ) {
			commands.push(power( PWMPortMap['FORWARD'],    0 ))
			commands.push(power( PWMPortMap['REVERSE'], yMod ))
		} else if( vector.y === 0 ) {
			commands.push(power( PWMPortMap['FORWARD'],    0 ))
			commands.push(power( PWMPortMap['REVERSE'],    0 ))
		}
	}

	if( SERVO_STEERING) {
		if( 'x' in vector ) {
			let SPAN = 250
			let MID = 1300
			let x = MID +SPAN *vector.x

			commands.push(pulse( 'STEER',  x ))
		}
	} else {
		if( 'x' in vector ) {
			let xMod = Math.abs(vector.x)

			if( vector.x > 0 ) {
				commands.push(power( PWMPortMap['LEFT'],  0 ))
				commands.push(power( PWMPortMap['RIGHT'], xMod ))
			} else if( vector.x < 0 ) {
				commands.push(power( PWMPortMap['RIGHT'], 0 ))
				commands.push(power( PWMPortMap['LEFT'],  xMod ))
			} else if( vector.x === 0 ) {
				commands.push(power( PWMPortMap['RIGHT'], 0 ))
				commands.push(power( PWMPortMap['LEFT'],  0 ))
			}
		}
	}

	return Promise.all(commands)
}

/**
  * Power
  * @param port PCA9685 port number
  * @param value PWM value 0..1
  * @return Promise
 **/
function power(port, value) {
	let p = port in PWMPortMap ? PWMPortMap[port] : parseInt(port)
	let v = Math.abs(value)

	if( p < 0 || p >= MAX_PWM_PORTS || isNaN(v) ) {
		return Promise.reject(`Invalid PWM power request: ${port}, ${value}`)
	} else {
		return pca9685controller.setPwm(p, 0, Math.round(v *PWM_MAX))
			.then(x=>setState(port, v))
	}
}

/**
  * Pulse
  * @param port PCA9685 port number
  * @param value PWM pulse
  * @return Promise
 **/
function pulse(port, value) {
	let p = port in PWMPortMap ? PWMPortMap[port] : parseInt(port)
	return pca9685controller.setPulse(p, value)
		//.then(x=>setState(port, v))
}

function toggle(port, from=getState(PWMPortMap[port]), to=Math.round(1-getState(PWMPortMap[port])), duration=250) {
	return tween(port, from, to, duration)
}

/**
  * Tween PWM values
  * @param port PCA9685 port number
  * @param from initial PWM value
  * @param to final PWM value
  * @param duration animation length
  * @return Promise
 **/
function tween(port, from, to, duration=250) {
	from = !isNaN(from)? from : getState(PWMPortMap[port])
	to = !isNaN(to)? to : Math.round(1-getState(PWMPortMap[port]))

	return new Promise((resolve, reject) => {
		var path = {
			from,
			to,
			duration,
			ease: from < to ? RxTween.Exp.easeIn : RxTween.Bounce.easeOut,
			interval: 20
		}

		function done() {
			setState(PWMPortMap[port], to)
			resolve()
		}

		RxTween(path)
			.forEach(x=>power(port, x), reject, done)
	})
}

process.on( 'SIGINT', cleanUp )
process.on( 'uncaughtException', cleanUp )

module.exports = {
	setup,
	drive,
	power,
	tween,
	reset,
}

