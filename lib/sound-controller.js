'use strict';

const Sound = require('node-aplay')
const path = require('path')

function play(src) {
	console.log('PLAY:', src)
	return new Promise((resolve, reject) => {
		let fileName = path.join(__dirname, '..', 'SFX', src)
		// FIXME: reject if missing
		let s = new Sound(fileName);
		s.play();
		s.on('error', reject)
		s.on('complete', function(error) {
			if (error !== null) {
				reject('sound play error: ', error);
			} else {
				resolve()
			}
		});
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

