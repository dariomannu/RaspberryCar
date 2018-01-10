//import {Rx} from './Rx.js';

const keyboardFilter = (keystream) => {
	const	origo = { x: 0, y: 0 }
	const keyMap = {
		"ArrowUp":    { y:  1 },
		"ArrowDown":  { y: -1 },
		"ArrowLeft":  { x: -1 },
		"ArrowRight": { x:  1 },
	};

	const sgn = x => x>0?1:x<0?-1:0
	const mod = x => x?sgn(x)*x/x:0

	const enabledKeys = e => e.key in keyMap
	const keyEvent = e => e.key +e.type
	const changeByAxis = e => +e.type + Object.keys(keyMap[e.key])[0]

	const coordinates = e => Object.assign(keyMap[e.key], {type: e.type})

	const combine = group => group.scan(sum, origo).zip()
	const sum = (a, b) => {
		let res = {}
		let r = (b.type==='keydown')*2-1
		if(b.x)
			res.x = mod((a.x||0)+(b.x||0)*r)
		if(b.y)
			res.y = mod((a.y||0)+(b.y||0)*r)
		return res
	}

	return keystream
		.filter(enabledKeys)
		.groupBy(changeByAxis)
		.map(group => group.distinctUntilChanged(null, keyEvent))
		.map(group => group.map(coordinates))
		.flatMap(combine)
		.mergeAll()
}

export {keyboardFilter}

