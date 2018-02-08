// import {io} from './lib/socket.io.slim.js'

function connect(url) {
	const messages = new Rx.Subject()
	const socket = io(url, {path: '/control', reconnection: 500})
	socket.on('MESSAGE', x => messages.next(x))
	//socket.once('disconnect', () => messages.complete())
	return {
		messages,
		command: data => socket.emit('MESSAGE', data),
	}
}

const socket = {
	connect
}

export {socket}

