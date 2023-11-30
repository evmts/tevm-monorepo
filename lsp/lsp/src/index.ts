import {
	createConnection,
	startLanguageServer,
} from '@volar/language-server/node.js'
import { plugin } from './plugin.js'

startLanguageServer(createConnection(), plugin)
