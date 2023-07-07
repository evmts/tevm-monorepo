import { createConnection, startLanguageServer } from '@volar/language-server/node'
import { plugin } from './languageServerPlugin'

startLanguageServer(createConnection(), plugin);

