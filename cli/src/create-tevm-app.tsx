#!/usr/bin/env node
import Pastel from 'pastel'

/**
 * Uses file based routing to route commands to the [./commands](./commands) directory.
 * @see https://github.com/vadimdemedes/pastel
 */
new Pastel({
	importMeta: import.meta,
	name: 'tevm',
	version: 'beta',
	description: 'entrypoint to tevm cli',
}).run()
console.clear()
