import { isAbsolute, resolve } from 'node:path'

/**
 * @param {string} filePath
 * @returns {string}
 */
const formatPath = (filePath) => filePath.replace(/\\/g, '/')

/**
 * @param {string} modulePath
 * @param {string} basedir
 * @returns {string}
 */
export const resolveCacheKey = (modulePath, basedir) => {
	if (modulePath.startsWith('.') || isAbsolute(modulePath)) {
		return formatPath(resolve(basedir, modulePath))
	}
	return modulePath
}
