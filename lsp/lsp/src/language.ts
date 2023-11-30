import { SolFile } from './SolFile.js'
import { type Language } from '@volar/language-core'

export const language: Language<SolFile> = {
	createVirtualFile(fileName, snapshot) {
		if (fileName.endsWith('s.sol')) {
			// return new Html1File(fileName, snapshot);
			return new SolFile(fileName, snapshot)
		} else if (fileName.endsWith('.sol')) {
			return new SolFile(fileName, snapshot)
		}
		return undefined
	},
	updateVirtualFile(solfile, snapshot) {
		solfile.update(snapshot)
	},
}
