//import {Rx} from './Rx.js'

const MAX_BUTTONS = 13
const buttonMap = [
		// [ ]
		[{ command: 'POWER', target: 'ENGINE',    value: 1 }],
		// X
		[{ command: 'MEOW' }],
		// ( )
		[{ command: 'POWER', target: 'LIGHT',     value: 1 }],
		// /_\
		[{ command: 'POWER', target: 'BACKLIGHT', value: 1 }],
		// ?
		[{ command: 'NOP' }],
		// ?
		[{ command: 'NOP' }],
		// ?
		[{ command: 'NOP' }],
		// ?
		[{ command: 'NOP' }],
		// [STOP]
		[{ command: 'HORN' }],
		// PLAY
		[{ command: 'ENGINE' }],
		// ?
		[{ command: 'NOP' }],
		// ?
		[{ command: 'NOP' }],
		// HOME
		[{ command: 'RESET' }],
]

const buttonPressed  = b => b.pressed || b.touched
const buttonReleased = b => !b.pressed || !b.touched

const gamepadController = eventStream => {
	var previousState = {
		axes: [0, 0, 0, 0, 0, 0],
		buttons: [...Array(MAX_BUTTONS)].map(()=>({pressed: false, value: 0, touched: false})),
	}

	const actions = gamepad => {
		let events = []
		gamepad.axes && gamepad.axes.forEach((a,ai) => {
			if(previousState.axes[ai] !== a) {
				events.push(ai&1?{y:a}:{x:a})
			}
		})

		gamepad.buttons && gamepad.buttons.forEach((b,bi) => {
			if( previousState.buttons[bi] && previousState.buttons[bi].pressed !== b.pressed || previousState.buttons[bi] && previousState.buttons[bi].touched !== b.touched )
				//events.push({event: 'button', gamepad: i, button: bi, pressed: b.pressed, touched: b.touched, previousState: b.value})
				if(buttonPressed(b))
					events.push(buttonMap[bi])
		})

		previousState = {
			axes: gamepad.axes ? gamepad.axes.slice() : [],
			buttons: gamepad.buttons.map(b => ({
				pressed: b.pressed, touched: b.touched, value: b.value
			}))
		}

		return events
	}

	return eventStream
		.flatMap(actions)
}

export {
	MAX_BUTTONS,
	gamepadController,
}

