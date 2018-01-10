import {marbles} from 'rxjs-marbles'
import {gamepadFilter} from './gamepad.js'

describe("gamepad", () => {
	let window, navigator
	let inputEvents
	let gamepadFrames
	let animationFrameCallback

	beforeEach(() => {
		window = {}
		navigator = {}
		inputEvents = []

		let gamepadFrames = getFixedGamepadEvents(inputEvents)
		window.requestAnimationFrame = f => {
			animationFrameCallback = f
			navigator.getGamepads = () => {
				return idleState
			}
			animationFrameCallback()

			//for(var i of gamepadFrames) {
			//	navigator.getGamepads = () => {
			//		console.log('@@@', i)
			//		return i
			//	}
			//	f()
			//}
		}
	})

	const idleState = {
		length: 1,
		item: () => {
			return {
				axes: [0, 0, 0, 0, 0, 0],
				buttons: [
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
					{pressed: false, value: 0, touched: false},
				]
			}
		}
	}

	const inputs = {
		L: { // Turn Left
				length: 1,
				item: () => {
					return {
						axes: [-1, -1, -1, -1, -1, -1],
						buttons: [
						]
					}
				}
			},
		R: {event: 'axis'  , gamepad: 0, axis: 0, value:  1 }, // Turn Right
		F: {event: 'axis'  , gamepad: 0, axis: 1, value: -1 }, // Move Forwards
		B: {event: 'axis'  , gamepad: 0, axis: 1, value:  1 }, // Reverse

		N: {event: 'button', gamepad: 0, button: 0, pressed: true, touched: false}, // Neutral
	}
	
	const outputs = {
		L: {x: -1},       // Left
		R: {x:  1},       // Right
		F: {y:  1},       // Forward
		B: {y: -1},       // Backward
		n: {x:  0, y: 0}, // neutral
		y: {x:  0},       // no-sideways (x=0)
		x: {y:  0},       // no front-back (y=0)
	}

	const check = (m, input, subscription, output) => {
		console.log('hic')
		let x = gamepadFilter(window, navigator)
			.do((x)=>{
				console.log('PSH', x)
				inputEvents.push(x)
				return x
			})
			.do((x)=>{
				console.log('animationFrame')
				if(animationFrameCallback)
					animationFrameCallback()
				return x
			})
			.do((x)=>console.log('>>>', x))

		const source =  m.hot(input, inputs)
		const expected = m.cold(output, outputs)

		m.expect(x).toBeObservable(expected)
		m.expect(source).toHaveSubscriptions(subscription)
	}

	function* getFixedGamepadEvents(e) {
		yield *e
		console.log('EEEE')
		return idleState
		while(true)
			yield idleState
	}

	describe('simple movements', () => {
		it("moves left", marbles((m) => {
			const i = "--^----L----|"
			const s =   "^---------!"
			const o =   "-----L----|"

			check(m, i, s, o)
		}))
	})

})

