import {marbles} from 'rxjs-marbles'
import {keyboardFilter} from './keyboard.js'

describe("keyboard", () => {
	const inputs = {
		L: { key: 'ArrowLeft',  type: 'keydown' },
		R: { key: 'ArrowRight', type: 'keydown' },
		F: { key: 'ArrowUp',    type: 'keydown' },
		B: { key: 'ArrowDown',  type: 'keydown' },
		l: { key: 'ArrowLeft',  type: 'keyup'   },
		r: { key: 'ArrowRight', type: 'keyup'   },
		f: { key: 'ArrowUp',    type: 'keyup'   },
		b: { key: 'ArrowDown',  type: 'keyup'   },
	}
	
	const outputs = {
		L: { command: 'DRIVE', x: -1 }, // Left
		R: { command: 'DRIVE', x:  1 }, // Right
		F: { command: 'DRIVE', y:  1 }, // Forward
		B: { command: 'DRIVE', y: -1 }, // Backward
		l: { command: 'DRIVE', x:  0 }, // not-left
		r: { command: 'DRIVE', x:  0 }, // not right
		f: { command: 'DRIVE', y:  0 }, // not forward
		b: { command: 'DRIVE', y:  0 }, // not backward
		y: { command: 'DRIVE', x:  0 }, // no-sideways (x=0)
		x: { command: 'DRIVE', y:  0 }, // no front-back (y=0)
	}

	const check = (m, input, subscription, output) => {
		const source =  m.hot(input, inputs)
		const expected = m.cold(output, outputs)

		m.expect(keyboardFilter(source)).toBeObservable(expected)
		m.expect(source).toHaveSubscriptions(subscription)
	}

	describe('simple movements', () => {
		it("drives left", marbles(m => {
			const i = "--^----L--l--|"
			const s =   "^----------!"
			const o =   "-----L--y--|"

			check(m, i, s, o)
		}))

		'LRFB'.split('').forEach(dir => {
			it(`drives ${dir}`, marbles(m => {
				const i = `--^----%--@--%@--%%%%%--@@@@@----%%@%-|`.replace(/%/g, dir).replace(/@/g, dir.toLowerCase())
				const s =   '^-----------------------------------!'
				const o =   `-----%--@--%@--%------@--------%-@%-|`.replace(/%/g, dir).replace(/@/g, dir.toLowerCase())

				check(m, i, s, o)
			}))
		})

		it("sends correct x,y coordinates in the correct sequence", marbles(m => {
			let i,s,o
			i = "--^--L--F--lf----L-B--lb----R-B--r-b-|"
			s =   "^----------------------------------!"
			o =   "---L--F--yx----L-B--lb----R-B--r-b-|"

			check(m, i, s, o)
		}))
	})

	describe('opposite keys', () => {
		it("clears out two opposite L-R keystrokes", marbles(m => {
			const i = "--^----L-R-RRR---F-B-BB-|"
			const s =   "^---------------------!"
			const o =   "-----L-y-------F-x----|"

			check(m, i, s, o)
		}))

		it("nulls out two opposite F-B keystrokes", marbles(m => {
			const i = "--^----F-B-BB-----|"
			const s =   "^---------------!"
			const o =   "-----F-x--------|"

			check(m, i, s, o)
		}))

		it("makes the correct keystroke prevail between opposites", marbles(m => {
			let i,s,o
			i = "--^----L-R-r-l---|"
			s =   "^--------------!"
			o =   "-----L-y-L-y---|"

			check(m, i, s, o)

			i = "--^----L-R-l--r---|"
			s =   "^---------------!"
			o =   "-----L-y-R--y---|"

			check(m, i, s, o)
		}))
	})
})

