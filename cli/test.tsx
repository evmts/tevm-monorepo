import test from 'ava'
import chalk from 'chalk'
import { render } from 'ink-testing-library'
import Index from './source/commands/index.js'

test('greet user', (t) => {
	const { lastFrame } = render(<Index options={{ name: 'Jane' }} />)

	t.is(lastFrame(), `Hello, ${chalk.green('Jane')}`)
})
