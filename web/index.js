/**
* HTTP & WebSocket Server
**/

const path = require('path')
const express = require('express')
const http = require('http')
const socket = require('socket.io')

function createServer(port, host, router) {
	const app = express()
	const server = http.createServer(app)
	const io = socket(server, {path: '/control'})

	app.use(express.static(path.join(__dirname, '..', 'public')))

	const serverReady = new Promise((resolve, reject) => {
		server.listen(port, host, e => {
			if(e) 
				reject(e)
			else
				resolve({server, app, socket: io})
		})
	})

	io.on('connection', socket => {
		socket.on('disconnect', message => {
			console.log('Signal lost. Triggering emergency breaks')
			router({ command: 'RESET' })
				.catch(e => {
					console.error('CRITICAL: Cannot pull emergency brakes', e)
					socket.emit( 'ERROR', { error: e, message } )
				})
		})

		socket.on('MESSAGE', message => {
			router(message)
				.then(() => socket.emit( 'ECHO',  { message }))
				.catch(e => socket.emit( 'ERROR', { error: e, message }))
		})
	})

	return serverReady
}

module.exports = {
	createServer
}
