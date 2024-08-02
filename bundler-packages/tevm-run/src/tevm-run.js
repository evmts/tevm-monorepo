#!/usr/bin/env bun

import('./run.js')
	.then(({ run }) => {
		return run()
	})
	.catch((e) => {
		console.error('An error occurred:', e)
		process.exit(1)
	})
