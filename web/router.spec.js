const router   = require('./router.js')

describe('web router', () => {
	var route, hardwareMock, soundMock

	beforeEach(() => {
		hardwareMock = {
			drive: sinon.spy(),
			tween: sinon.spy(),
			power: sinon.spy(),
			reset: sinon.spy(),
		}

		soundMock = {
			play: sinon.spy(),
			horn: sinon.spy(),
			engine: sinon.spy(),
			meow: sinon.spy(),
		}

		route = router(hardwareMock, soundMock)
	})

	it('drives', async () => {
		const direction = { command: 'DRIVE', x: 0.25, y: 1 }
		await route(direction)
		hardwareMock.drive.should.have.been.calledWith(direction)
	})

	it('resets', async () => {
		await route({ command: 'RESET' })
		hardwareMock.reset.should.have.been.calledWith()
	})

	it('powers lights with tweens', async () => {
		const command = { command: 'TWEEN', target: 'something' }
		await route(command)
		hardwareMock.tween.should.have.been.calledWith('something')
	})

	it('blows the horn', async () => {
		const command = { command: 'HORN' }
		await route(command)
		soundMock.horn.should.have.been.calledWith()
	})

	it('turns on the engine', async () => {
		const command = { command: 'ENGINE' }
		await route(command)
		soundMock.engine.should.have.been.calledWith()
	})

	it('rejects unknown commands', () => {
		const command = { command: 'JustDoIt!' }
		route(command).should.be.rejected
	})
})

