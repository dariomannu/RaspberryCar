'use strict';

const Sound = require('node-aplay')
const path = require('path')
const fs = require('fs')

function play(src) {
	return new Promise((resolve, reject) => {
		let fileName = path.join(__dirname, '..', '..', '..', 'SFX', src)
		console.log('PLAY:', fileName)
		fs.exists(fileName, exists => {
			if(exists) {
				// FIXME: reject if missing
				let s = new Sound(fileName);
				s.play();
				s.on('error', reject)
				s.on('complete', resolve);
			}
		}) 
	});
}

exports.play = play

exports.horn = function() {
	return play('beep.wav');
}

exports.meow = function() {
	return play('meow.wav');
}

exports.engine = function() {
	return play('engine.wav');
}

