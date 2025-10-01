#!/usr/bin/env node

/**
 * A utility script to add JSDoc comments to JavaScript and TypeScript files
 * with exported symbols that are missing documentation.
 *
 * Usage:
 * node scripts/jsdoc-helper/add-jsdoc.js [filepath]
 *
 * Example:
 * node scripts/jsdoc-helper/add-jsdoc.js packages/state/src/state-types/ForkOptions.ts
 */

const fs = require('node:fs')
const _path = require('node:path')

// Get the file path from command line args
const filePath = process.argv[2]

if (!filePath) {
	console.error('Please provide a file path to process')
	process.exit(1)
}

if (!fs.existsSync(filePath)) {
	console.error(`File not found: ${filePath}`)
	process.exit(1)
}

// Export patterns to match
const EXPORT_PATTERNS = [
	{
		regex: /export\s+(const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/,
		type: 'variable',
		nameGroup: 2,
	},
	{
		regex: /export\s+function\s+([a-zA-Z0-9_$]+)/,
		type: 'function',
		nameGroup: 1,
	},
	{
		regex: /export\s+class\s+([a-zA-Z0-9_$]+)/,
		type: 'class',
		nameGroup: 1,
	},
	{
		regex: /export\s+interface\s+([a-zA-Z0-9_$]+)/,
		type: 'interface',
		nameGroup: 1,
	},
	{
		regex: /export\s+type\s+([a-zA-Z0-9_$]+)\s*=/,
		type: 'type',
		nameGroup: 1,
	},
	{
		regex: /export\s+enum\s+([a-zA-Z0-9_$]+)/,
		type: 'enum',
		nameGroup: 1,
	},
	{
		regex: /export\s+default\s+function\s+([a-zA-Z0-9_$]+)?/,
		type: 'function',
		nameGroup: 1,
	},
	{
		regex: /export\s+default\s+class\s+([a-zA-Z0-9_$]+)?/,
		type: 'class',
		nameGroup: 1,
	},
]

/**
 * Checks if a line has a preceding JSDoc comment
 */
function hasPrecedingJSDoc(lines, lineIndex) {
	// Check up to 5 lines back for JSDoc comments
	for (let i = lineIndex - 1; i >= Math.max(0, lineIndex - 5); i--) {
		const line = lines[i].trim()

		// If we find the end of a JSDoc comment, return true
		if (line.includes('*/')) {
			return true
		}

		// If we encounter a non-empty, non-comment line, stop looking
		if (line !== '' && !line.startsWith('//') && !line.startsWith('*')) {
			break
		}
	}

	return false
}

/**
 * Generate appropriate JSDoc template based on export type
 */
function generateJSDoc(exportType, name) {
	switch (exportType) {
		case 'function':
			return `/**
 * [Description of what ${name || 'this function'} does]
 * @param {any} [paramName] - [Description of parameter]
 * @returns {any} [Description of return value]
 * @example
 * \`\`\`typescript
 * import { ${name || 'functionName'} } from '[package-path]'
 * 
 * // Example usage of ${name || 'function'}
 * \`\`\`
 */`

		case 'class':
			return `/**
 * [Description of what ${name || 'this class'} represents]
 * @example
 * \`\`\`typescript
 * import { ${name || 'ClassName'} } from '[package-path]'
 * 
 * const instance = new ${name || 'ClassName'}()
 * \`\`\`
 */`

		case 'variable':
			return `/**
 * [Description of ${name}]
 * @example
 * \`\`\`typescript
 * import { ${name} } from '[package-path]'
 * 
 * // Example usage
 * \`\`\`
 */`

		case 'interface':
		case 'type':
			return `/**
 * [Description of what this ${exportType} represents]
 * @example
 * \`\`\`typescript
 * import { ${name} } from '[package-path]'
 * 
 * const value: ${name} = {
 *   // Initialize properties
 * }
 * \`\`\`
 */`

		case 'enum':
			return `/**
 * [Description of the enum ${name}]
 * @example
 * \`\`\`typescript
 * import { ${name} } from '[package-path]'
 * 
 * const value = ${name}.SomeValue
 * \`\`\`
 */`

		default:
			return `/**
 * [Description]
 */`
	}
}

/**
 * Process a file to add JSDoc comments
 */
function processFile(filePath) {
	console.log(`Processing ${filePath}...`)

	try {
		const content = fs.readFileSync(filePath, 'utf8')
		const lines = content.split('\n')
		const newLines = [...lines] // Copy lines for modification

		let insertCount = 0

		// Scan each line for exports
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim()

			// Skip lines that already have JSDoc comments
			if (hasPrecedingJSDoc(lines, i)) {
				continue
			}

			// Check if line matches any export pattern
			for (const pattern of EXPORT_PATTERNS) {
				const match = line.match(pattern.regex)

				if (match) {
					const exportName = match[pattern.nameGroup] || 'default'
					const indentation = lines[i].match(/^\s*/)[0] // Preserve indentation

					// Generate appropriate JSDoc
					const jsDoc = generateJSDoc(pattern.type, exportName)
						.split('\n')
						.map((jsdocLine) => indentation + jsdocLine)
						.join('\n')

					// Insert JSDoc comment before the export
					newLines.splice(i + insertCount, 0, jsDoc)
					insertCount++

					console.log(`Added JSDoc for ${pattern.type} "${exportName}"`)
					break
				}
			}
		}

		if (insertCount === 0) {
			console.log('No missing JSDoc comments found.')
			return false
		}

		// Write the modified content back to the file
		fs.writeFileSync(filePath, newLines.join('\n'))
		console.log(`Added ${insertCount} JSDoc comment${insertCount !== 1 ? 's' : ''}.`)
		return true
	} catch (error) {
		console.error(`Error processing file: ${error.message}`)
		return false
	}
}

processFile(filePath)
