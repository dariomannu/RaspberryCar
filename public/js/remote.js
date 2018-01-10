// import {io} from './lib/socket.io.slim.js'

var socket;

function connect(url) {
	socket = io(url)
}

function heartbeat(data) {
	socket.emit('HEARTBEAT', { t: (new Date()).getTime() })
}

function command(data) {
	console.log('COMMAND', data)
	socket.emit('COMMAND', data)
}

const receive = new Rx.Observable((observer) => {
	socket.on('MESSAGE', (e) => {
		observer._next(e)
	});
	socket.on('disconnect', observer.onEnd)
})

const remote = {
	connect: connect,
	receive: receive,
	command: command,
	heartbeat: heartbeat,
}

export {remote};

