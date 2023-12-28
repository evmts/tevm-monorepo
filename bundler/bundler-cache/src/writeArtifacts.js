import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * Writes the artifacts to disk.
 * @param {string} cwd
 * @param {string} cacheDir
 * @param {string} entryModuleId
 * @param {import('@tevm/compiler').ResolvedArtifacts} resolvedArtifacts
 * @param {import('./types.js').FileAccessObject} fs
 */
export const writeArtifacts = (
	cwd,
	cacheDir,
	entryModuleId,
	resolvedArtifacts,
	fs,
) => {
	const artifactsPath = getArtifactsPath(
		entryModuleId,
		'artifactsJson',
		cwd,
		cacheDir,
	)

	fs.writeFileSync(artifactsPath, JSON.stringify(resolvedArtifacts, null, 2))

	const metadata = {
		version,
		files: Object.fromEntries(
			Object.keys(resolvedArtifacts.solcInput.sources).map((sourcePath) => {
				// for efficiency let's only check the last updated timestamp of the files
				return [sourcePath, fs.statSync(sourcePath).mtimeMs]
			}),
		),
	}

	fs.writeFileSync(
		getMetadataPath(entryModuleId, cwd, cacheDir),
		JSON.stringify(metadata, null, 2),
	)

	return artifactsPath
}
