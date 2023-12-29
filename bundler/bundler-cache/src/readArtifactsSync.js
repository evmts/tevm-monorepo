import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * @param {string} cacheDir
 * @param {import('./types.js').FileAccessObject} fs
 * @param {string} cwd
 * @param {string} entryModuleId
 * @returns {import('@tevm/compiler').ResolvedArtifacts | undefined}
 */
export const readArtifactsSync = (cacheDir, fs, cwd, entryModuleId) => {
	const { path: artifactsPath } = getArtifactsPath(
		entryModuleId,
		'artifactsJson',
		cwd,
		cacheDir,
	)
	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	if (!fs.existsSync(artifactsPath) || !fs.existsSync(metadataPath)) {
		return undefined
	}

	const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))

	const didContentChange =
		metadata.version !== version ||
		Object.entries(metadata.files).some(([sourcePath, timestamp]) => {
			return timestamp !== fs.statSync(sourcePath).mtimeMs
		})

	if (didContentChange) {
		return undefined
	}

	const content = fs.readFileSync(artifactsPath, 'utf8')

	try {
		return JSON.parse(content)
	} catch (e) {
		throw new Error(
			`Cache miss for ${entryModuleId} because it isn't valid json`,
		)
	}
}
