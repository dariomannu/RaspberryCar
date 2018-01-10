//import {Rx} from './Rx.js';

const extraKeysFilter = (keystream) => {
	const	origo = { x: 0, y: 0 }
	const keyMap = {
		"KeyE": { command: 'POWER', target: 'ENGINE',    value: 1 },
		"KeyL": { command: 'POWER', target: 'LIGHT',     value: 1 },
		"KeyB": { command: 'POWER', target: 'BACKLIGHT', value: 1 },
		"KeyH": { command: 'HORN' },
		"KeyX": { command: 'RESET' },
	};

	const sgn = x => x>0?1:x<0?-1:0
	const mod = x => x?sgn(x)*x/x:0

	const enabledKeys = e => e.code in keyMap
	const eventType = e => e.type
	const keyCode = e => e.code

	const command = e => {
		let res = Object.assign({}, keyMap[e.code])
		//if(e.type === 'keyup')
		//	res.value = 0
		return res
	}

	return keystream
		.filter(enabledKeys)
		.groupBy(keyCode)
		.map(group => group.distinctUntilChanged(null, eventType))
		.map(group => group.map(command))
		.mergeAll()
}

export {extraKeysFilter}

