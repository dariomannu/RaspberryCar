import {marbles} from 'rxjs-marbles'
import {ui} from './ui.js'

describe('ui', () => {
	describe('when buttons with data-command attributes are clicked', () => {
		const createButtonClickEvent = (command, target) => ({
			target: {
				getAttribute: a => a==='data-command'?command:a==='data-target'?target:undefined
			}
		})

		const inputs = {
			R: createButtonClickEvent('RESET'),
			1: createButtonClickEvent('COMMAND1', 'TARGET1'),
			2: createButtonClickEvent('COMMAND2', 'TARGET2'),
		}

		const outputs = {
			R: { command: 'RESET', target: undefined },
			1: { command: 'COMMAND1', target: 'TARGET1' },
			2: { command: 'COMMAND2', target: 'TARGET2' },
		}

		const check = (m, source, subscription, expected) => {
			m.expect(ui.buttons(source)).toBeObservable(expected)
			m.expect(source).toHaveSubscriptions(subscription)
		}

		it('maps clicks to commands specified in their data attributes', marbles(m => {
			const i = "-R--^---R--RR--RRR--12122111---|"
			const s =     "^--------------------------!"
			const o =     "----R--RR--RRR--12122111---|"

			check(m, m.hot(i, inputs), s, m.cold(o, outputs))
		}))
	})
})

