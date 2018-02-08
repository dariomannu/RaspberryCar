import {marbles} from 'rxjs-marbles'
import {gyroscopeFilter} from './gyroscope.js'

describe('gyroscope', () => {
	const leftIn = {
		0: { alpha: 0, beta: 0, gamma:    0, }, // flat
		n: { alpha: 0, beta: 0, gamma:   -5, }, // weak left
		1: { alpha: 0, beta: 0, gamma:  -10, }, // 10° left
		2: { alpha: 0, beta: 0, gamma:  -20, }, // 20° left
		4: { alpha: 0, beta: 0, gamma:  -40, }, // 40° left
		6: { alpha: 0, beta: 0, gamma:  -60, }, // 60° left
		8: { alpha: 0, beta: 0, gamma:  -80, }, // 80° left
		9: { alpha: 0, beta: 0, gamma:  -90, }, // 90° left
		a: { alpha: 0, beta: 0, gamma: -100, }, // 100° left
	}

	const leftOut = {
		0: { command: 'DRIVE', x:   0,     y: 0 },
		1: { command: 'DRIVE', x:  -0.222, y: 0 },
		2: { command: 'DRIVE', x:  -0.444, y: 0 },
		4: { command: 'DRIVE', x:  -0.889, y: 0 },
		F: { command: 'DRIVE', x:  -1,     y: 0 }, // Full left
	}

	const rightIn = {
		0: { alpha: 0, beta: 0, gamma:   0, },
		n: { alpha: 0, beta: 0, gamma:   5, }, // weak right
		1: { alpha: 0, beta: 0, gamma:  10, },
		2: { alpha: 0, beta: 0, gamma:  20, },
		4: { alpha: 0, beta: 0, gamma:  40, },
		6: { alpha: 0, beta: 0, gamma:  60, },
		8: { alpha: 0, beta: 0, gamma:  80, },
		9: { alpha: 0, beta: 0, gamma:  90, },
		a: { alpha: 0, beta: 0, gamma: 100, },
	}

	const rightOut = {
		0: { command: 'DRIVE', x:  0,     y: 0 },
		1: { command: 'DRIVE', x:  0.222, y: 0 },
		2: { command: 'DRIVE', x:  0.444, y: 0 },
		4: { command: 'DRIVE', x:  0.889, y: 0 },
		F: { command: 'DRIVE', x:  1,     y: 0 }, // Full right
	}

	const forwardIn = {
		0: { beta:    0, alpha: 0, gamma: 0 }, // flat
		n: { beta:    0, alpha: 0, gamma: 0 }, // weak left
		1: { beta:  -10, alpha: 0, gamma: 0 }, // 10° left
		2: { beta:  -20, alpha: 0, gamma: 0 }, // 20° left
		4: { beta:  -40, alpha: 0, gamma: 0 }, // 40° left
		6: { beta:  -60, alpha: 0, gamma: 0 }, // 60° left
		8: { beta:  -80, alpha: 0, gamma: 0 }, // 80° left
		9: { beta:  -90, alpha: 0, gamma: 0 }, // 90° left
		a: { beta: -100, alpha: 0, gamma: 0 }, // 100° left
	}

	const forwardOut = {
		0: { command: 'DRIVE', x: 0, y:   0     },
		1: { command: 'DRIVE', x: 0, y:  0.222  },
		2: { command: 'DRIVE', x: 0, y:  0.444  },
		4: { command: 'DRIVE', x: 0, y:  0.889  },
		F: { command: 'DRIVE', x: 0, y:   1     }, // Full throttle
	}

	const reverseIn = {
		0: { beta:   0, alpha: 0, gamma: 0 },
		n: { beta:   0, alpha: 0, gamma: 0 }, // weak right
		1: { beta:  10, alpha: 0, gamma: 0 },
		2: { beta:  20, alpha: 0, gamma: 0 },
		4: { beta:  40, alpha: 0, gamma: 0 },
		6: { beta:  60, alpha: 0, gamma: 0 },
		8: { beta:  80, alpha: 0, gamma: 0 },
		9: { beta:  90, alpha: 0, gamma: 0 },
		a: { beta: 100, alpha: 0, gamma: 0 },
	}

	const reverseOut = {
		0: { command: 'DRIVE', x: 0, y:  0     },
		1: { command: 'DRIVE', x: 0, y: -0.222 },
		2: { command: 'DRIVE', x: 0, y: -0.444 },
		4: { command: 'DRIVE', x: 0, y: -0.889 },
		F: { command: 'DRIVE', x: 0, y: -1     }, // Full throttle
	}

	const outputs = {
		y: { command: 'DRIVE', x:  0 }, // no-sideways (x=0)
		x: { command: 'DRIVE', y:  0 }, // no front-back (y=0)
	}

	const check = (m, source, subscription, expected) => {
		m.expect(gyroscopeFilter(source)).toBeObservable(expected)
		m.expect(source).toHaveSubscriptions(subscription)
	}

	describe('emits x/y coordinates in the -1..1/-1..1 range', () => {
		it('maps negative gamma to x left', marbles(m => {
			const i = '--^---00-1-2---46089a-|'
			const s =   '^-------------------!'
			const o =   '----00-1-2---4F0FFF-|'
			check(m, m.hot(i, leftIn), s, m.cold(o, leftOut))
		}))

		it('maps positive gamma to x right', marbles(m => {
			const i = '--^---0n-1-2---46089a-|'
			const s =   '^-------------------!'
			const o =   '----00-1-2---4F0FFF-|'
			check(m, m.hot(i, rightIn), s, m.cold(o, rightOut))
		}))

		it('maps negative beta to forward', marbles(m => {
			const i = '--^---0n-1-2---46089a-|'
			const s =   '^-------------------!'
			const o =   '----00-1-2---4F0FFF-|'
			check(m, m.hot(i, forwardIn), s, m.cold(o, forwardOut))
		}))

		it('maps positive beta to reverse', marbles(m => {
			const i = '--^---0n-1-2---46089a-|'
			const s =   '^-------------------!'
			const o =   '----00-1-2---4F0FFF-|'
			check(m, m.hot(i, reverseIn), s, m.cold(o, reverseOut))
		}))
	})
})

