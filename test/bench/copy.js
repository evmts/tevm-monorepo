import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { mkdirp } from 'mkdirp'

const sourcePath = 'test/bench/src/resolutions'
const destPath = 'bundler-packages/resolutions-rs/fixtures'

// Find all Solidity files in the source directory
const files = await glob(`${sourcePath}/**/*.sol`)

console.log(`Found ${files.length} Solidity files to copy.`)

// Process each file
for (const filePath of files) {
	// Calculate the relative path from sourcePath
	const relativePath = path.relative(sourcePath, filePath)

	// Create the destination path
	const destFilePath = path.join(destPath, relativePath)

	// Ensure the destination directory exists
	const destDir = path.dirname(destFilePath)

	// Create directory if it doesn't exist
	await mkdirp(destDir)

	// Copy the file
	fs.copyFileSync(filePath, destFilePath)

	console.log(`Copied: ${filePath} -> ${destFilePath}`)
}

console.log('Finished copying all files!')
