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
export const writeArtifactsSync = (
	cwd,
	cacheDir,
	entryModuleId,
	resolvedArtifacts,
	fs,
) => {
	const { dir, path } = getArtifactsPath(
		entryModuleId,
		'artifactsJson',
		cwd,
		cacheDir,
	)

	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
	fs.writeFileSync(path, JSON.stringify(resolvedArtifacts, null, 2))
	fs.writeFileSync(
		metadataPath,
		JSON.stringify(
			{
				version,
				files: Object.fromEntries(
					Object.keys(resolvedArtifacts.solcInput.sources).map((sourcePath) => {
						// for efficiency let's only check the last updated timestamp of the files
						return [sourcePath, fs.statSync(sourcePath).mtimeMs]
					}),
				),
			},
			null,
			2,
		),
	)

	return path
}
