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
			const { path: dtsPath, dir: dtsDir } = getArtifactsPath(
				entryModuleId,
				'dts',
				cwd,
				cacheDir,
			)
			fs.mkdirSync(dtsDir, { recursive: true })
			fs.writeFileSync(dtsPath, dtsFile)
			return dtsPath
		},

		readDts: (entryModuleId) => {
			const { path: dtsPath } = getArtifactsPath(
				entryModuleId,
				'dts',
				cwd,
				cacheDir,
			)
			if (!fs.existsSync(dtsPath)) {
				return undefined
			}
			return fs.readFileSync(dtsPath, 'utf8')
		},

		writeMjs: (entryModuleId, mjsFile) => {
			const { path: mjsPath, dir: mjsDir } = getArtifactsPath(
				entryModuleId,
				'mjs',
				cwd,
				cacheDir,
			)
			fs.mkdirSync(mjsDir, { recursive: true })
			fs.writeFileSync(mjsPath, mjsFile)
			return mjsPath
		},

		readMjs: (entryModuleId) => {
			const { path: mjsPath } = getArtifactsPath(
				entryModuleId,
				'mjs',
				cwd,
				cacheDir,
			)
			if (!fs.existsSync(mjsPath)) {
				return undefined
			}
			return fs.readFileSync(mjsPath, 'utf8')
		},
	}
}
