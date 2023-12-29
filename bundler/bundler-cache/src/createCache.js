import { getArtifactsPath } from './getArtifactsPath.js'
import { readArtifacts } from './readArtifacts.js'
import { readArtifactsSync } from './readArtifactsSync.js'
import { writeArtifacts } from './writeArtifacts.js'
import { writeArtifactsSync } from './writeArtifactsSync.js'

/**
 * Creates a Tevm cache object for reading and writing cached items
 * @param {string} cacheDir
 * @param {import('./types.js').FileAccessObject} fs
 * @param {string} cwd
 * @returns {import('./types.js').Cache}
 */
export const createCache = (cacheDir, fs, cwd) => {
	return {
		writeArtifactsSync: (entryModuleId, compiledContracts) => {
			return writeArtifactsSync(
				cwd,
				cacheDir,
				entryModuleId,
				compiledContracts,
				fs,
			)
		},

		writeArtifacts: async (entryModuleId, compiledContracts) => {
			return writeArtifacts(cwd, cacheDir, entryModuleId, compiledContracts, fs)
		},

		readArtifactsSync: (entryModuleId) => {
			return readArtifactsSync(cacheDir, fs, cwd, entryModuleId)
		},

		readArtifacts: async (entryModuleId) => {
			return readArtifacts(cacheDir, fs, cwd, entryModuleId)
		},

		// Note: though we are writing dts and mjs files, we don't read from them
		// They are cheap to generate and we only write them for debugging purposes
		// And to get @tevm/tsc to work

		writeDtsSync: (entryModuleId, dtsFile) => {
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

		writeDts: async (entryModuleId, dtsFile) => {
			const { path: dtsPath, dir: dtsDir } = getArtifactsPath(
				entryModuleId,
				'dts',
				cwd,
				cacheDir,
			)
			await fs.mkdir(dtsDir, { recursive: true })
			await fs.writeFile(dtsPath, dtsFile)
			return dtsPath
		},

		readDtsSync: (entryModuleId) => {
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

		readDts: async (entryModuleId) => {
			const { path: dtsPath } = getArtifactsPath(
				entryModuleId,
				'dts',
				cwd,
				cacheDir,
			)
			if (!(await fs.exists(dtsPath))) {
				return undefined
			}
			return fs.readFile(dtsPath, 'utf8')
		},

		writeMjsSync: (entryModuleId, mjsFile) => {
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

		writeMjs: async (entryModuleId, mjsFile) => {
			const { path: mjsPath, dir: mjsDir } = getArtifactsPath(
				entryModuleId,
				'mjs',
				cwd,
				cacheDir,
			)
			await fs.mkdir(mjsDir, { recursive: true })
			await fs.writeFile(mjsPath, mjsFile)
			return mjsPath
		},

		readMjsSync: (entryModuleId) => {
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

		readMjs: async (entryModuleId) => {
			const { path: mjsPath } = getArtifactsPath(
				entryModuleId,
				'mjs',
				cwd,
				cacheDir,
			)
			if (!(await fs.exists(mjsPath))) {
				return undefined
			}
			return fs.readFile(mjsPath, 'utf8')
		},
	}
}
