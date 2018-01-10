//import {Rx} from './Rx.js';

const	origo = {x: 0, y: 0}

const unload    = Rx.Observable.fromEvent(window, 'unload')
const lostfocus = Rx.Observable.fromEvent(window, 'blur')

const page = Rx.Observable
	.merge(unload, lostfocus)
	.mapTo(origo)

export {page}

