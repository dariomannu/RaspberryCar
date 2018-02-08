//import {Rx} from './Rx.js';

const	origo = { command: 'DRIVE', x: 0, y: 0 }

const page = {
	unload: window => Rx.Observable.fromEvent(window, 'unload').mapTo(origo),
	blur:   window => Rx.Observable.fromEvent(window, 'blur'  ).mapTo(origo),
}

export {page}

