/**
 * Re-exports the Bun file API for working with files in the file system.
 * The Bun file API provides an optimized interface for file operations with
 * methods for reading, writing, and checking file existence.
 *
 * @type {typeof import('bun').file}
 * @see {@link https://bun.sh/docs/api/file-io | Bun File I/O Documentation}
 *
 * @example
 * ```javascript
 * import { file } from '@tevm/bun'
 *
 * // Create a file reference
 * const myFile = file('path/to/file.txt')
 *
 * // Check if the file exists
 * const exists = await myFile.exists()
 *
 * // Read file as text
 * const content = await myFile.text()
 *
 * // Write to file
 * await myFile.write('Hello, world!')
 * ```
 */
export const file = require('bun').file
