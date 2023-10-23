import { defineConfig } from '../../defineConfig.js'

defineConfig(() => {
	throw new Error('test: configFnThrows')
})
