import { App } from './App.js'
import chalk from 'chalk'
import { existsSync, rmSync } from 'fs-extra'
import { render } from 'ink-testing-library'
import { join } from 'path'
import React from 'react'
import { afterAll, expect, test } from 'vitest'

const TODO = true

afterAll(() => {
	try {
		rmSync(join(__dirname, '..', '..', 'my-app'), { recursive: true })
	} catch (e) {
		console.error(e)
	}
})

test('Should work', async () => {
	if (TODO) return
	const { lastFrame, stdin } = render(
		<App
			args={['my-app']}
			options={{
				noGit: false,
				noInstall: false,
				framework: 'remix',
				packageManager: 'bun',
				skipPrompts: true,
				useCase: 'ui',
				walletConnectProjectId: '123',
			}}
		/>,
	)

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
