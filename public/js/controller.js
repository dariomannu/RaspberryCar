import {page} from './inputs/page.js'
import {gyroscopeFilter} from './inputs/gyroscope.js'
import {keyboardFilter} from './inputs/keyboard.js'
import {extraKeysFilter} from './inputs/extrakeys.js'
import {gamepadFilter} from './inputs/gamepad.js'

const gyroscope = gyroscopeFilter(Rx.Observable.fromEvent(window, 'deviceorientation'))
const arrowKeys = keyboardFilter(Rx.Observable.merge(Rx.Observable.fromEvent(document, 'keydown'), Rx.Observable.fromEvent(document, 'keyup')))
const extraKeys = extraKeysFilter(Rx.Observable.merge(Rx.Observable.fromEvent(document, 'keydown'), Rx.Observable.fromEvent(document, 'keyup')))

const gp0move = e => e.event === 'axis' && e.gamepad === 0 && ~[1,4].indexOf(e.axis)
const axisCoordinates = e => { return e.axis & 1 ? { y: -e.value } : { x: e.value } }
const gamepad = gamepadFilter(window, navigator)

// MOVEMENT
const gamepadaxis0 = gamepad
	.filter(gp0move)
	.map(axisCoordinates)

const movement = Rx.Observable.merge(page, arrowKeys, gyroscope, gamepadaxis0)
	.map(data => ({ command: 'MOVE', ...data }))

// SFX
const sfxMap = e => {
	let sound
	switch(e.button) {
		case 8: // STOP
			return [{ command: 'HORN' }]
			break
		case 9: // PLAY
			return [{ command: 'ENGINE' }]
			break
		case 0: // [ ]
			return [{ command: 'POWER', target: 'ENGINE', value: 1 }]
			break
		case 1: // X
			return [{ command: 'MEOW' }]
			break
		case 2: // ( )
			return [{ command: 'POWER', target: 'LIGHT', value: 1 }]
			break
		case 3: // /_\
			return [{ command: 'POWER', target: 'BACKLIGHT', value: 1 }]
			break
		case 12: // HOME
			return [
				{ command: 'POWER', target: 'BACKLIGHT', value: 0 },
				{ command: 'POWER', target: 'LIGHT', value: 0 },
				{ command: 'POWER', target: 'ENGINE', value: 0 },
				{ command: 'POWER', target: 'LASER', value: 0 },
				{ command: 'MOVE', x: 0, y: 0 },
				{ command: 'MOVE', y: 0 },
			]
			break
		default:
			sound = 'NOP'
			break
	}
	return { command: sound }
}

const sfx = gamepad
	.filter(e => e.event==='button' && e.pressed === true)
	.flatMap(sfxMap)

// STREAM
const controller = Rx.Observable.merge(movement, sfx, extraKeys)
	//.do(console.debug.bind(null, 'STREAM'))

export { controller }
