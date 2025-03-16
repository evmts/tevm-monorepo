#!/usr/bin/env node

/**
 * A utility script to find JavaScript and TypeScript files with exported symbols
 * that are missing JSDoc comments
 *
 * Usage:
 * node scripts/jsdoc-helper/find-missing-jsdoc.js [directory]
 *
 * Example:
 * node scripts/jsdoc-helper/find-missing-jsdoc.js packages/state
 */

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

// Default to project root if no directory specified
const searchDir = process.argv[2] || '.'

// Files/directories to exclude
const EXCLUDE_PATTERNS = [
	'.d.ts$',
	'.spec.ts$',
	'.spec.js$',
	'.test.ts$',
	'.test.js$',
	'dist/',
	'node_modules/',
	'.git/',
	'coverage/',
]

const EXPORT_PATTERNS = [
	'export\\s+(const|let|var|function|class|interface|type|enum)\\s+([\\w$]+)',
	'export\\s+default\\s+(function|class)\\s+([\\w$]+)',
	'export\\s+default\\s+(function|class)\\s*\\(',
	'export\\s+type\\s+([\\w$]+)\\s*=',
	'export\\s+interface\\s+([\\w$]+)',
]

// Colors for console output
const COLORS = {
	RESET: '\x1b[0m',
	RED: '\x1b[31m',
	GREEN: '\x1b[32m',
	YELLOW: '\x1b[33m',
	BLUE: '\x1b[34m',
	MAGENTA: '\x1b[35m',
	CYAN: '\x1b[36m',
}

/**
 * Find all JS and TS files in the given directory
 */
function findFiles(dir) {
	try {
		// Use find to get all JS and TS files
		const excludeArgs = EXCLUDE_PATTERNS.map((pattern) => `-not -path "*${pattern}*"`).join(' ')
		const cmd = `find ${dir} -type f \\( -name "*.js" -o -name "*.ts" \\) ${excludeArgs}`

		const output = execSync(cmd, { encoding: 'utf8' })
		return output.split('\n').filter(Boolean)
	} catch (error) {
		console.error(`${COLORS.RED}Error finding files:${COLORS.RESET}`, error.message)
		return []
	}
}

/**
 * Check if a file has exports without JSDoc
 */
function checkFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8')
		const lines = content.split('\n')
		const results = []

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim()

			// Check if line contains an export
			for (const pattern of EXPORT_PATTERNS) {
				const match = line.match(new RegExp(pattern))
				if (match) {
					const exportName = match[2] || match[1] || 'default'

					// Check for JSDoc comment before this export (up to 5 lines back)
					let hasJSDoc = false
					for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
						const prevLine = lines[j].trim()
						if (prevLine.includes('*/')) {
							hasJSDoc = true
							break
						}
						// If we encounter a non-empty, non-comment line, stop looking
						if (prevLine !== '' && !prevLine.startsWith('//') && !prevLine.startsWith('*')) {
							break
						}
					}

					if (!hasJSDoc) {
						results.push({
							line: i + 1,
							text: line,
							name: exportName,
						})
					}
				}
			}
		}

		return results.length > 0 ? { file: filePath, exports: results } : null
	} catch (error) {
		console.error(`${COLORS.RED}Error reading file ${filePath}:${COLORS.RESET}`, error.message)
		return null
	}
}

/**
 * Generate JSDoc template for different types of exports
 */
function generateJSDocTemplate(exportInfo) {
	const { text } = exportInfo

	// Determine export type
	if (text.includes('function') || text.includes('const') || text.includes('let') || text.includes('var')) {
		return `/**
 * [Description of what this function does]
 * 
 * @param {[type]} [paramName] - [Description of parameter]
 * @returns {[type]} [Description of return value]
 * @example
 * \`\`\`typescript
 * import { ${exportInfo.name} } from '[package-path]'
 * 
 * // Example usage
 * \`\`\`
 */`
	}
	if (text.includes('class')) {
		return `/**
 * [Description of what this class represents]
 * 
 * @example
 * \`\`\`typescript
 * import { ${exportInfo.name} } from '[package-path]'
 * 
 * const instance = new ${exportInfo.name}()
 * \`\`\`
 */`
	}
	if (text.includes('interface') || text.includes('type')) {
		return `/**
 * [Description of what this type represents]
 * 
 * @example
 * \`\`\`typescript
 * import { ${exportInfo.name} } from '[package-path]'
 * 
 * const value: ${exportInfo.name} = {
 *   // Initialize properties
 * }
 * \`\`\`
 */`
	}
	return `/**
 * [Description]
 */`
}

/**
 * Main function
 */
function main() {
	console.log(`${COLORS.CYAN}Searching for files with missing JSDoc in ${searchDir}...${COLORS.RESET}`)

	const files = findFiles(searchDir)
	console.log(`${COLORS.BLUE}Found ${files.length} JS/TS files to check${COLORS.RESET}`)

	const results = []

	// Process each file
	for (const file of files) {
		const fileResult = checkFile(file)
		if (fileResult) {
			results.push(fileResult)
		}
	}

	// Print results
	if (results.length === 0) {
		console.log(`${COLORS.GREEN}No missing JSDoc comments found!${COLORS.RESET}`)
		return
	}

	console.log(`${COLORS.YELLOW}Found ${results.length} files with missing JSDoc comments:${COLORS.RESET}`)

	let totalMissingJSDoc = 0

	for (const result of results) {
		console.log(`\n${COLORS.MAGENTA}${result.file}:${COLORS.RESET}`)

		for (const exportItem of result.exports) {
			console.log(`  ${COLORS.YELLOW}Line ${exportItem.line}:${COLORS.RESET} ${exportItem.text}`)
			console.log(`  ${COLORS.GREEN}Suggested JSDoc:${COLORS.RESET}`)
			console.log(`  ${generateJSDocTemplate(exportItem).replace(/\n/g, '\n  ')}`)
			console.log()
			totalMissingJSDoc++
		}
	}

	console.log(`${COLORS.YELLOW}Total exported symbols missing JSDoc: ${totalMissingJSDoc}${COLORS.RESET}`)
}

main()
