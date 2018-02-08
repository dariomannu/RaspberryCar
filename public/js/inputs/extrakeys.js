//import {Rx} from './Rx.js';

const extraKeysFilter = (keystream) => {
	const	origo = { x: 0, y: 0 }
	const keyMap = {
		"KeyE": { command: 'TWEEN', target: 'ENGINE',    from: 0, to: 1 },
		"KeyL": { command: 'TWEEN', target: 'LIGHT',     from: 0, to: 1 },
		"KeyS": { command: 'TWEEN', target: 'LASER',     from: 0, to: 1 },
		//"KeyR": { command: 'POWER', target: 'ENGINE',    value: 1 },
		//"KeyT": { command: 'POWER', target: 'LIGHT',     value: 1 },
		"KeyB": { command: 'TWEEN', target: 'BACKLIGHT', from: 0, to: 1 },
		"KeyH": { command: 'HORN' },
		"KeyG": { command: 'ENGINE' },
		"KeyM": { command: 'MEOW' },
		"KeyX": { command: 'RESET' },
	};

	const sgn = x => x>0?1:x<0?-1:0
	const mod = x => x?sgn(x)*x/x:0

	const enabledKeys = e => e.code in keyMap
	const eventType = e => e.type
	const keyCode = e => e.code
	const keyDown = e => e.type === 'keydown'

	const command = e => {
		let res = Object.assign({}, keyMap[e.code])
		return res
	}

	return keystream
		.filter(enabledKeys)
		.filter(keyDown)
		.groupBy(keyCode)
		//.map(group => group.distinctUntilChanged(null, eventType))
		.map(group => group.map(command))
		.mergeAll()
}

export {extraKeysFilter}

