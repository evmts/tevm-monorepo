import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * @param {string} cacheDir
 * @param {import('./types.js').FileAccessObject} fs
 * @param {string} cwd
 * @param {string} entryModuleId
 * @returns {Promise<import('@tevm/compiler').ResolvedArtifacts | undefined>}
 */
export const readArtifacts = async (cacheDir, fs, cwd, entryModuleId) => {
	const { path: artifactsPath } = getArtifactsPath(
		entryModuleId,
		'artifactsJson',
		cwd,
		cacheDir,
	)
	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	if (!(await fs.exists(artifactsPath)) || !(await fs.exists(metadataPath))) {
		return undefined
	}

	const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'))

	const didContentChange =
		version !== metadata.version ||
		(
			await Promise.all(
				Object.entries(metadata.files).map(async ([sourcePath, timestamp]) => {
					const didChange = timestamp !== (await fs.stat(sourcePath)).mtimeMs
					return didChange
				}),
			)
		).some((didChange) => didChange)

	if (didContentChange) {
		return undefined
	}

	const content = await fs.readFile(artifactsPath, 'utf8')

	try {
		return JSON.parse(content)
	} catch (e) {
		throw new Error(
			`Cache miss for ${entryModuleId} because it isn't valid json`,
		)
	}
}
