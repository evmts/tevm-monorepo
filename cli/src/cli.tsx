#!/usr/bin/env node
import Pastel from 'pastel'

const app = new Pastel({
	name: 'tevm',
	version: '0.0.0',
	description: 'Tevm CLI tool',
	importMeta: import.meta,
})

await app.run()
