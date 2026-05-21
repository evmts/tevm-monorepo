#!/usr/bin/env node
import { createRequire } from 'node:module'
import Pastel from 'pastel'

const packageJson = createRequire(import.meta.url)('../package.json') as { version: string }

const app = new Pastel({
	name: 'tevm',
	version: packageJson.version,
	description: 'Tevm CLI tool',
	importMeta: import.meta,
})

await app.run()
