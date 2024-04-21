import type { Language } from '@volar/language-core'
import { SolFile } from './SolFile.js'

export const language: Language<SolFile> = {
	createVirtualFile(fileName, snapshot) {
		if (fileName.endsWith('s.sol')) {
			// return new Html1File(fileName, snapshot);
			return new SolFile(fileName, snapshot)
		}
		if (fileName.endsWith('.sol')) {
			return new SolFile(fileName, snapshot)
		}
		return undefined
	},
	updateVirtualFile(solfile, snapshot) {
		solfile.update(snapshot)
	},
}
