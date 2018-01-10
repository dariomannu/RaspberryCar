import {marbles} from 'rxjs-marbles'
import {gyroscopeFilter} from './gyroscope.js'

describe("gyroscope", () => {
	const leftIn = {
		0: {alpha: 0, beta: 0, gamma:    0}, // flat
		n: {alpha: 0, beta: 0, gamma:   -5}, // weak left
		1: {alpha: 0, beta: 0, gamma:  -10}, // 10° left
		2: {alpha: 0, beta: 0, gamma:  -20}, // 20° left
		4: {alpha: 0, beta: 0, gamma:  -40}, // 40° left
		6: {alpha: 0, beta: 0, gamma:  -60}, // 60° left
		8: {alpha: 0, beta: 0, gamma:  -80}, // 80° left
		9: {alpha: 0, beta: 0, gamma:  -90}, // 90° left
		a: {alpha: 0, beta: 0, gamma: -100}, // 100° left
	}

	const leftOut = {
		0: {x:   0,    y: 0},
		1: {x:  -0.22, y: 0},
		2: {x:  -0.44, y: 0},
		4: {x:  -0.89, y: 0},
		6: {x:  -1,    y: 0},
		8: {x:  -1,    y: 0},
		9: {x:  -1,    y: 0},
		a: {x:  -1,    y: 0},
	}

	const rightIn = {
		0: {alpha: 0, beta: 0, gamma:   0},
		n: {alpha: 0, beta: 0, gamma:   5}, // weak right
		1: {alpha: 0, beta: 0, gamma:  10},
		2: {alpha: 0, beta: 0, gamma:  20},
		4: {alpha: 0, beta: 0, gamma:  40},
		6: {alpha: 0, beta: 0, gamma:  60},
		8: {alpha: 0, beta: 0, gamma:  80},
		9: {alpha: 0, beta: 0, gamma:  90},
		a: {alpha: 0, beta: 0, gamma: 100},
	}

	const rightOut = {
		0: {x:  0,    y: 0},
		1: {x:  0.22, y: 0},
		2: {x:  0.44, y: 0},
		4: {x:  0.89, y: 0},
		6: {x:  1,    y: 0},
		8: {x:  1,    y: 0},
		9: {x:  1,    y: 0},
		a: {x:  1,    y: 0},
	}

	const forwardIn = {
		0: {alpha: 0, beta: 0, gamma:    0}, // flat
		n: {alpha: 0, beta: 0, gamma:   -5}, // weak left
		1: {alpha: 0, beta: 0, gamma:  -10}, // 10° left
		2: {alpha: 0, beta: 0, gamma:  -20}, // 20° left
		4: {alpha: 0, beta: 0, gamma:  -40}, // 40° left
		6: {alpha: 0, beta: 0, gamma:  -60}, // 60° left
		8: {alpha: 0, beta: 0, gamma:  -80}, // 80° left
		9: {alpha: 0, beta: 0, gamma:  -90}, // 90° left
		a: {alpha: 0, beta: 0, gamma: -100}, // 100° left
	}

	const forwardOut = {
		0: {x: 0, y:   0   },
		1: {x: 0, y:  -0.22},
		2: {x: 0, y:  -0.44},
		4: {x: 0, y:  -0.89},
		6: {x: 0, y:  -1   },
		8: {x: 0, y:  -1   },
		9: {x: 0, y:  -1   },
		a: {x: 0, y:  -1   },
	}

	const reverseIn = {
		0: {alpha: 0, beta: 0, gamma:   0},
		n: {alpha: 0, beta: 0, gamma:   5}, // weak right
		1: {alpha: 0, beta: 0, gamma:  10},
		2: {alpha: 0, beta: 0, gamma:  20},
		4: {alpha: 0, beta: 0, gamma:  40},
		6: {alpha: 0, beta: 0, gamma:  60},
		8: {alpha: 0, beta: 0, gamma:  80},
		9: {alpha: 0, beta: 0, gamma:  90},
		a: {alpha: 0, beta: 0, gamma: 100},
	}

	const reverseOut = {
		0: {x: 0, y:  0   },
		1: {x: 0, y:  0.22},
		2: {x: 0, y:  0.44},
		4: {x: 0, y:  0.89},
		6: {x: 0, y:  1   },
		8: {x: 0, y:  1   },
		9: {x: 0, y:  1   },
		a: {x: 0, y:  1   },
	}

	const outputs = {
		y: {x:  0}, // no-sideways (x=0)
		x: {y:  0}, // no front-back (y=0)
	}

	const check = (m, source, subscription, expected) => {
		m.expect(gyroscopeFilter(source)).toBeObservable(expected)
		m.expect(source).toHaveSubscriptions(subscription)
	}

	describe('emits x/y coordinates in the -1..1/-1..1 range', () => {
		it("maps negative gamma to x left", marbles((m) => {
			const i = "--^---0n-1-2---46089a-|"
			const s =   "^-------------------!"
			const o =   "----00-1-2---46089a-|"
			check(m, m.hot(i, leftIn), s, m.cold(o, leftOut))
		}))

		it("maps positive gamma to x right", marbles((m) => {
			const i = "--^---0n-1-2---46089a-|"
			const s =   "^-------------------!"
			const o =   "----00-1-2---46089a-|"
			check(m, m.hot(i, rightIn), s, m.cold(o, rightOut))
		}))

		it("maps negative beta to forward", marbles((m) => {
			const i = "--^---0n-1-2---46089a-|"
			const s =   "^-------------------!"
			const o =   "----00-1-2---46089a-|"
			check(m, m.hot(i, leftIn), s, m.cold(o, leftOut))
		}))

		it("maps positive beta to reverse", marbles((m) => {
			const i = "--^---0n-1-2---46089a-|"
			const s =   "^-------------------!"
			const o =   "----00-1-2---46089a-|"
			check(m, m.hot(i, rightIn), s, m.cold(o, rightOut))
		}))
	})
})

