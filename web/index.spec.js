const request = require('supertest');
const web     = require('./index.js')
const io      = require('socket.io-client')

describe('web server', () => {
	var webserver, webapp, routerMock

	beforeEach((done) => {
		routerMock = {
			route: sinon.spy(),
		}

		web.createServer(0, 'localhost', routerMock)
			.then(({server, app, socket}) => {
				webapp = app
				webserver = server
				done()
			})
	})

	afterEach(async () => {
		await webserver.close()
	})

	it('listens on specified host:port', () => {
		return request(webapp)
			.get('/')
			.expect(200)
			.expect(/RaspberryCar/)
	})

	xit('listens on a websocket at /control ', done => {
		const socket = io.connect('localhost:6000', {
			'path': '/control',
			'reconnection': 500,
			'reconnection delay': 0,
			'reopen delay' : 0,
			'force new connection' : true,
		})

		socket.on('connect', () => {
			console.log('connected')
			socket.disconnect()
			done()
		})
	})
})

