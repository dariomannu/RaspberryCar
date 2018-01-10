//import {Rx} from './Rx.js';

const filter_low = 0.2
const resolution = 2

const sgn = x => x>0?1:x<0?-1:0

const coordinates = e => {
	let b = Math.min(1, Math.abs(e.beta /45))
	let g = Math.min(1, Math.abs(e.gamma /45))

	if(Math.abs(b) < filter_low)
		b = 0
	if(Math.abs(g) < filter_low)
		g = 0

	return {
		x:  sgn(e.gamma) *g.toFixed(resolution),
		y: -sgn(e.beta)  *b.toFixed(resolution),
	}
}

const gyroscopeFilter = (events) => {
	return events
		.map(coordinates)
}

export {gyroscopeFilter}

