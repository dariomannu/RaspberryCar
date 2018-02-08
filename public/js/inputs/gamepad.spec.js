import {marbles} from 'rxjs-marbles'
import {gamepadController, MAX_BUTTONS} from './gamepad.js'

const mockButtons = (pressed=[]) => [...Array(MAX_BUTTONS)].map((b,i)=>({pressed: !!~pressed.indexOf(i), value: 0, touched: !!~pressed.indexOf(i)}))

describe("Gamepad", () => {
	let inputEvents
	let gamepadFrames

	// State of a gamepad plugged in with no axis/button pressed
	const idleState = () => ({
		axes   : [0, 0, 0, 0, 0, 0],
		buttons: mockButtons()
	})

	/**
	 * Direction buttons as on a keyboard front/left, front, front/right, left, right, etc
	 *
	 * Q W E
	 * A   D
	 * Z X C
	 *
	 **/
	const inputs = {
		'I': idleState(),
		'A': { // Steer Left
			axes: [-1, 0, 0, 0, 0, 0],
			buttons: []
		},
		'D': { // Steer Right
			axes: [1, 0, 0, 0, 0, 0],
			buttons: []
		},
		'W': { // Drive Forward
			axes: [0, 1, 0, 0, 0, 0],
			buttons: []
		},
		'X': { // Drive Reverse
			axes: [0, -1, 0, 0, 0, 0],
			buttons: []
		},


		'a': { // Steer slightly Left
			axes: [-.7, 0, 0, 0, 0, 0],
			buttons: []
		},
		'd': { // Steer slightly Right
			axes: [.7, 0, 0, 0, 0, 0],
			buttons: []
		},
		'w': { // Drive slightly Forward
			axes: [0, .7, 0, 0, 0, 0],
			buttons: []
		},
		'x': { // Drive slightly Reverse
			axes: [0, -.7, 0, 0, 0, 0],
			buttons: []
		},

		'Q': { // Forward Left
			axes: [-1, 1, 0, 0, 0, 0],
			buttons: []
		},
		'E': { // Forward Right
			axes: [1, 1, 0, 0, 0, 0],
			buttons: []
		},
		'Z': { // Reverse Left
			axes: [-1, -1, 0, 0, 0, 0],
			buttons: []
		},
		'C': { // Reverse Right
			axes: [1, -1, 0, 0, 0, 0],
			buttons: []
		},

		'0': { // Button 0
			buttons: mockButtons([0])
		},
		'1': { // Button 1
			buttons: mockButtons([1])
		},
		'2': { // Button 1
			buttons: mockButtons([2])
		},
		'3': { // Button 1
			buttons: mockButtons([3])
		},
		'4': { // Button 1
			buttons: mockButtons([4])
		},
		'5': { // Button 1
			buttons: mockButtons([5])
		},
		'U': { // No buttons pressed
			buttons: mockButtons([])
		},
	}

	const outputs = {
		'-': {x:  0, y: 0}, // Neutral
		'L': {x: -1},       // Left
		'l': {x: -.7},      // Slightly Left
		'R': {x:  1},       // Right
		'r': {x: .7},       // Slightly Right
		'F': {y:  1},       // Forward
		'f': {y: .7},       // Slightly Forward
		'B': {y: -1},       // Reverse
		'b': {y: -.7},      // Slightly Reverse
		'Q': {x: -1, y: 1}, // Forward Left
		'E': {x:  1, y: 1}, // Forward Right
		'n': {x:  0, y: 0}, // neutral
		'y': {x:  0},       // no-sideways (x=0)
		'x': {y:  0},       // no front-back (y=0)
		'0': [{ command: 'POWER', target: 'ENGINE', value: 1 }],
		'1': [{ command: 'MEOW' }],
		'2': [{ command: 'POWER', target: 'LIGHT',     value: 1 }],
		'3': [{ command: 'POWER', target: 'BACKLIGHT', value: 1 }],
		'4': [{ command: 'NOP' }],
		'5': [{ command: 'NOP' }],
		'6': [{ command: 'NOP' }],
		'7': [{ command: 'NOP' }],
		'8': [{ command: 'HORN' }],
		'9': [{ command: 'ENGINE' }],
	}

	const check = (m, input, subscription, output) => {
		const source =  m.hot(input, inputs)
		const expected = m.cold(output, outputs)

		m.expect(gamepadController(source)).toBeObservable(expected)
		m.expect(source).toHaveSubscriptions(subscription)
	}

	describe('Controls simple movements at various speeds.', () => {

		it("Steers left/right", marbles(m => {
			const i = "--^----a-a-aaa-AA-AA-A-AAA-a-dDDDD-I-a-IDIAIIIII--"
			const s =   "^-----------------------------------------------"
			const o =   "-----l-------L-----------l-rR----y-l-yRyLy------"
			check(m, i, s, o)
		}))

		it("Drives forward/reverse, stops", marbles(m => {
			const i = "--^----w-w-www-WW-WW-W-WWW-w-xXXXX-IWXWX-I|"
			const s =   "^---------------------------------------!"
			const o =   "-----f-------F-----------f-bB----xFBFB-x|"
			check(m, i, s, o)
		}))

	})

	describe('Controls compound movements.', () => {

		it("Drives forward left/right, stops", marbles(m => {
			const i = "--^---Q----EQ-----I-----E-------|"
			const s =   "^-----------------------------!"
			const o =   "----(LF)-RL-----(yx)--(RF)----|"
			check(m, i, s, o)
		}))

		it("Drives reverse left/right, stops", marbles(m => {
			const i = "--^---Z----CZ-----I-----C-------|"
			const s =   "^-----------------------------!"
			const o =   "----(LB)-RL-----(yx)--(RB)----|"
			check(m, i, s, o)
		}))

	})

	describe('Controls buttons', () => {
		it("Controls gamepad button presses", marbles(m => {
			const i = "-0--^--000--1--111-2345432----|"
			const s =     "^-------------------------!"
			const o =     "---0----1------2345432----|"
			check(m, i, s, o)
		}))

		it("Controls multiple gamepad button presses", marbles(m => {
			const i = "-0--^--(012)---3---|"
			const s =     "^--------------!"
			const o =     "---(012)---3---|"
			check(m, i, s, o)
		}))
	})
})

