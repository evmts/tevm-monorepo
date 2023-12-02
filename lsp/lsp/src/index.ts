import { plugin } from './plugin.js'
import {
	createConnection,
	startLanguageServer,
} from '@volar/language-server/node.js'

startLanguageServer(createConnection(), plugin)
