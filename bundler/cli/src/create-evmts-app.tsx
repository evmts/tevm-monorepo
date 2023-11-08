#!/usr/bin/env node
import Pastel from 'pastel'

const app = new Pastel({
	importMeta: import.meta,
	name: 'create-evmts-app',
	version: 'beta',
	description: 'Scaffold a new EVMTS application',
})

app.run()
