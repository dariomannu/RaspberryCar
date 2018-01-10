'use strict'

const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 31337
//const movement_controller = require('./lib/controllers/movement/gpio-controller.js');
//const movement_controller = require('./lib/controllers/movement/pwm-controller.js');
const movement_controller = require('./lib/controllers/movement/dummy-controller.js');
const sound_controller = require('./lib/sound-controller.js')

server.listen(port, '::', function () {
  console.log('Server listening at port %d', port);
})

app.use(express.static(path.join(__dirname, 'public')))

var emergencyStopTimer
const emergencyStop = () => {
	console.log('Signal lost. Triggering emergency breaks')
	movement_controller.reset()
}

io.on('connection', function (socket) {
	socket.on('HEARTBEAT', function(data) {
		emergencyStopTimer && clearTimeout(emergencyStopTimer)
		emergencyStopTimer = setTimeout(emergencyStop, 1000)
		//socket.emit('MESSAGE', { type: 'heartbeat', q: data.t, t: (new Date()).getTime() })
	})

	socket.on('COMMAND', function(data) {
		var p
		switch(data.command) {
			case 'MOVE':
				console.log('MOVE:', data)
				p=movement_controller.move(data)
				break
			case 'GLIDE':
				console.log('GLIDE:', data);
				break;
			case 'POWER':
				console.log('POWER:', data)
				p=movement_controller.power(data.target, data.value)
				break
			case 'RESET':
				console.log('RESET');
				p=movement_controller.reset();
				break
			case 'SFX':
				console.log('SFX:', data);
				p=sound_controller.play(data.file)
				break
			case 'HORN':
				console.log('HORN:', data);
				p=sound_controller.horn()
				break
			case 'ENGINE':
				p=sound_controller.engine()
				break
			case 'MEOW':
				p=sound_controller.meow()
				break
			default:
				p=Promise.reject('Unknown command')
				break
		}

		return p
			.then(() => socket.emit(  'MESSAGE', { data }))
			.catch((e) => socket.emit('~ERROR~', { data, error: e }))
	})
})

process.on( 'SIGINT', function() {
	console.log('SIGINT caught. Exiting')
	movement_controller
		.reset()
		.then(process.exit.bind(0))
});

