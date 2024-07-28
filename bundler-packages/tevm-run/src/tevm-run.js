#!/usr/bin/env bun

console.log('tevm run', ...process.argv.slice(1))

import('./run.js')
	.then(({ run }) => {
		return run()
	})
	.catch((e) => {
		console.error('An error occurred:', e)
		process.exit(1)
	})
