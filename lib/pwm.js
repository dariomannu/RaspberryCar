// /usr/sbin/i2cset -y 1 0x40 0 128

const driver = require('@dariomannu/adafruit-pca9685')({
	"freq": "50",   // frequency of the device
	"correctionFactor": "1.118", // correction factor - fine tune the frequency 
	"address": 0x40, // i2c bus address
	"device": '/dev/i2c-1', // device name
	"debug": console.log // adds some debugging methods if set 
});

function pwm(channel, value) {
	var ch = parseInt(channel)
	var v = parseInt(value)
	//console.log(`driver.setPwm(${ch}, ${0},${v});`)
	return driver.setPwm(ch, 0, v)
}

function pulse(channel, value) {
	var ch = parseInt(channel)
	var v = parseInt(value)
	console.log(`driver.setPulse(${ch}, ${v})`)
	return driver.setPulse(ch, v)
}

function stop() {
	return driver.stop()
}

export {pwm, pulse, stop}

