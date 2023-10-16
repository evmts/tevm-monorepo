import { constants } from 'fs'
import { access } from 'fs/promises'

/**
 * Checks if a file exists at the given path
 * @param {string} path - path to check
 * @returns {Promise<boolean>} true if the file exists, false otherwise
 * @example
 * ```typescript
 * import { fileExists } from '@eth-optimism/config'
 * await fileExists('./someFile.txt')
 * ```
 */
export const fileExists = async (path) => {
	try {
		// TODO not the most robust check for existence here
		await access(path, constants.F_OK)
		return true
	} catch (e) {
		// TODO should be inspecting the error here
		return false
	}
}
