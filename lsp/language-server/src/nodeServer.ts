#!/usr/bin/env node
import { plugin } from './languageServerPlugin'
import {
	createConnection,
	startLanguageServer,
} from '@volar/language-server/node'

if (process.argv.includes('--version')) {
	const pkgJSON = require('../package.json')
	console.log(`${pkgJSON['version']}`)
} else {
	startLanguageServer(createConnection(), plugin)
}
