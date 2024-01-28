#!/usr/bin/env node
import Pastel from 'pastel'

/**
 * Uses file based routing to route commands to the [./commands](./commands) directory.
 * @see https://github.com/vadimdemedes/pastel
 */
new Pastel({
	importMeta: import.meta,
	name: 'create-evmts-app',
	version: 'beta',
	description: 'Scaffold a new EVMTS application',
}).run()
console.clear()
