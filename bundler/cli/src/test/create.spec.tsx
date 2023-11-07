import Create from '../commands/create.js'
import { afterAll, expect, test } from 'vitest'
import chalk from 'chalk'
import { render } from 'ink-testing-library'
import React from 'react'
import { existsSync, rmSync } from 'fs-extra'
import { join } from 'path'

afterAll(() => {
	rmSync(join(__dirname, '..', '..', 'my-app'), { recursive: true })
})

test('Should work', async () => {
	const { lastFrame, stdin } = render(
		<Create
			args={["my-app"]}
			options={{
				default: false,
				template: 'remix-wagmi',
				noGit: false,
				noInstall: false,
			}} />)

	// hackily waiting
	await new Promise((resolve) => setTimeout(resolve, 2000))

	expect(lastFrame()).toMatchSnapshot()
	stdin.write('\r')
	expect(lastFrame()).toBe(`Hello, ${chalk.green('Jane')}`)
	/*
	stdin.write('\r')
	expect(lastFrame()).toBe(`Hello, ${chalk.green('Jane')}`)
	stdin.write('\r')
	expect(lastFrame()).toBe(`Hello, ${chalk.green('Jane')}`)
	stdin.write('\r')
	expect(lastFrame()).toBe(`Hello, ${chalk.green('Jane')}`)
	stdin.write('\r')
	expect(lastFrame()).toBe(`Hello, ${chalk.green('Jane')}`)
	stdin.write('\r')

	await new Promise(resolve => setTimeout(resolve, 1000))
	*/

	expect(existsSync(join(__dirname, '..', '..', 'my-app'))).toBe(true)
})
