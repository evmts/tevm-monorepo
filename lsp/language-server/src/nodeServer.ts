import { plugin } from './languageServerPlugin'
import {
	createConnection,
	startLanguageServer,
} from '@volar/language-server/node'

startLanguageServer(createConnection(), plugin)
