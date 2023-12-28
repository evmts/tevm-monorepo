import { getArtifactsPath } from './getArtifactsPath.js'
import { readArtifacts } from './readArtifacts.js'
import { writeArtifacts } from './writeArtifacts.js'

/**
 * Creates a Tevm cache object for reading and writing cached items
 * @param {string} cacheDir
 * @param {import('./types.js').FileAccessObject} fs
 * @param {string} cwd
 * @returns {import('./types.js').Cache}
 */
export const createCache = (cacheDir, fs, cwd) => {
	return {
		writeArtifacts: (entryModuleId, compiledContracts) => {
			return writeArtifacts(cwd, cacheDir, entryModuleId, compiledContracts, fs)
		},

		readArtifacts: (entryModuleId) => {
			return readArtifacts(cacheDir, fs, cwd, entryModuleId)
		},

		// Note: though we are writing dts and mjs files, we don't read from them
		// They are cheap to generate and we only write them for debugging purposes
		// And to get @tevm/tsc to work

		writeDts: (entryModuleId, dtsFile) => {
			const dtsPath = getArtifactsPath(entryModuleId, 'dts', cwd, cacheDir)
			fs.writeFileSync(dtsPath, dtsFile)
			return dtsPath
		},

		readDts: (entryModuleId) => {
			const dtsPath = getArtifactsPath(entryModuleId, 'dts', cwd, cacheDir)
			if (!fs.existsSync(dtsPath)) {
				return undefined
			}
			return fs.readFileSync(dtsPath, 'utf8')
		},

		writeMjs: (entryModuleId, mjsFile) => {
			const mjsPath = getArtifactsPath(entryModuleId, 'mjs', cwd, cacheDir)
			fs.writeFileSync(mjsPath, mjsFile)
			return mjsPath
		},

		readMjs: (entryModuleId) => {
			const mjsPath = getArtifactsPath(entryModuleId, 'mjs', cwd, cacheDir)
			if (!fs.existsSync(mjsPath)) {
				return undefined
			}
			return fs.readFileSync(mjsPath, 'utf8')
		},
	}
}
