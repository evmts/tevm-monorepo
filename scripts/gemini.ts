import { readdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import 'dotenv/config'
import { GeminiClient } from './lib/GeminiClient'
import { getResourceFiles, getZigFiles } from './lib/fileUtils'

interface ResourceConfig {
	name: string
	paths: string[]
	extensions: string[]
}

const RESOURCES: ResourceConfig[] = [
	{
		name: 'evmone',
		paths: ['evmone/**/*.cpp', 'evmone/**/*.hpp'],
		extensions: ['.cpp', '.hpp'],
	},
	{
		name: 'revm',
		paths: ['revm/crates/**/*.rs'],
		extensions: ['.rs'],
	},
	{
		name: 'execution-specs',
		paths: ['execution-specs/**/*.py'],
		extensions: ['.py'],
	},
	{
		name: 'go-ethereum',
		paths: ['go-ethereum/**/*.go'],
		extensions: ['.go'],
	},
]

// Initialize Gemini client
const gemini = new GeminiClient()

/**
 * Create context extraction task description
 */
function createContextExtractionTask(promptContent: string, resource: ResourceConfig): string {
	return `You are a prompt engineer helping to add relevant context from ${resource.name} to EVM implementation prompts.

## Your Task
Review the following prompt and the ${resource.name} codebase, then extract ONLY the most relevant code snippets that would help implement the requested feature.

## Original Prompt
${promptContent}

## Instructions
1. Read the original prompt carefully to understand what feature needs to be implemented
2. Search through the ${resource.name} code to find relevant implementations
3. Extract ONLY the most relevant code snippets that would help with this specific feature
4. Format your response as XML snippets that can be appended to the original prompt
5. Include corrections to the prompt if you notice any inaccuracies
6. Focus on quality over quantity - include only the most helpful context

## Output Format
Provide your response in this exact format:

<${resource.name}>
<file path="github_url_here">
[Include only the most relevant code snippets with proper context]
</file>

<file path="another_github_url_here">
[More relevant code if needed]
</file>
</${resource.name}>

If you found any errors or improvements for the original prompt, include them after the code snippets:

## Prompt Corrections
[Any corrections or improvements to the original prompt]

Remember: Only include code that is directly relevant to implementing the feature described in the prompt. Quality and relevance over quantity.`
}

/**
 * Process a single prompt file
 */
async function processPromptFile(
	promptFile: string,
	zigFiles: { file: string; content: string }[],
	resourceFiles: Map<string, { file: string; content: string; lang: string }[]>,
): Promise<void> {
	const promptName = basename(promptFile, '.md')
	console.log(`\n🔍 Processing prompt: ${promptName}`)

	// Skip WASM-related prompts for now
	if (promptName.toLowerCase().includes('wasm')) {
		console.log(`⏭️  Skipping WASM prompt: ${promptName}`)
		return
	}

	// Read the original prompt
	const originalPrompt = await readFile(promptFile, 'utf8')

	const enhancedParts = [originalPrompt]

	// Process each resource
	for (const resource of RESOURCES) {
		console.log(`  📚 Processing ${resource.name}...`)

		try {
			// Get pre-extracted resource files
			const files = resourceFiles.get(resource.name) || []

			// Create context extraction task
			const taskDescription = createContextExtractionTask(originalPrompt, resource)

			// Build parts array: task description + zig context + resource files + prompt
			const parts = [{ text: taskDescription }, { text: '## Our Current Zig EVM Implementation' }]

			// Add Zig files as individual parts
			for (const zigFile of zigFiles) {
				parts.push({
					text: `### ${zigFile.file}\n\`\`\`zig\n${zigFile.content}\n\`\`\``,
				})
			}

			// Add resource files as individual parts
			parts.push({ text: `## ${resource.name.toUpperCase()} Source Code` })
			for (const file of files) {
				parts.push({
					text: `### ${file.file}\n\`\`\`${file.lang}\n${file.content}\n\`\`\``,
				})
			}

			// Use GeminiClient for content generation with automatic chunking
			console.log(`  🧐 Validating token count for ${resource.name}...`)

			// Split parts into fixed and variable parts for chunking
			const taskDescriptionParts = parts.slice(0, 2) // task description + zig header
			const zigParts = parts.slice(2, 2 + zigFiles.length) // zig files
			const resourceHeaderIndex = 2 + zigFiles.length
			const resourceHeader = parts[resourceHeaderIndex] // resource header
			const resourceFileParts = parts.slice(resourceHeaderIndex + 1) // resource files

			// Fixed parts that should be included in every chunk
			const fixedParts = [...taskDescriptionParts, ...zigParts, resourceHeader]

			// Generate content with automatic chunking
			const allResponses = await gemini.generateContentWithChunking(resourceFileParts, fixedParts, {
				onChunkStart: (chunkNumber: number, totalParts: number) => {
					console.log(`  🤖 Sending chunk ${chunkNumber} to Gemini for ${resource.name} (${totalParts} parts)`)
				},
				onChunkComplete: (chunkNumber: number, _response: string) => {
					console.log(`  ✅ Received response from chunk ${chunkNumber} for ${resource.name}`)
				},
				delayBetweenChunks: 10000,
			})

			console.log(`  ✅ Received ${allResponses.length} total responses from Gemini for ${resource.name}`)

			// Combine all responses
			const combinedText = allResponses.join('\n\n---\n\n')
			enhancedParts.push(`## ${resource.name.toUpperCase()} Context`, combinedText, '')
		} catch (error) {
			console.error(`    ❌ Error processing ${resource.name}:`, error)
		} finally {
			// Add delay to avoid rate limiting (always run whether success or failure)
			await new Promise((resolve) => setTimeout(resolve, 10_000))
		}
	}

	// Write the enhanced prompt
	const enhancedFile = promptFile.replace('.md', '-enhanced.md')
	await writeFile(enhancedFile, enhancedParts.join('\n\n'))

	console.log(`  📝 Enhanced prompt saved to: ${enhancedFile}`)
	console.log(`  ✅ Completed processing: ${promptName}`)
}

/**
 * Main function - processes all prompts
 */
async function main() {
	console.log('🚀 Starting automated prompt enhancement...')

	// Get all prompt files
	const promptsDir = join(process.cwd(), 'src/evm/prompts')
	const promptFiles = readdirSync(promptsDir)
		.filter((file) => file.endsWith('.md'))
		.map((file) => join(promptsDir, file))

	console.log(`📋 Found ${promptFiles.length} prompt files to process`)

	// Extract all code once before processing prompts
	console.log('\n📦 Pre-extracting all codebase content...')

	// Extract Zig files once
	const zigFiles = await getZigFiles(['src/evm'])

	// Extract all external resource files concurrently
	const resourceFiles = new Map<string, { file: string; content: string; lang: string }[]>()
	const resourceExtractions = RESOURCES.map(async (resource) => {
		const files = await getResourceFiles(resource.paths, resource.extensions)
		resourceFiles.set(resource.name, files)
	})

	await Promise.all(resourceExtractions)

	console.log('✅ All codebase content extracted and cached')

	// Process all prompt files
	const filesToProcess = promptFiles
	console.log(`\n🔍 Processing ${filesToProcess.length} prompt files:`)
	filesToProcess.forEach((file, index) => {
		console.log(`  ${index + 1}. ${basename(file)}`)
	})

	// Process each prompt file
	for (const promptFile of filesToProcess) {
		await processPromptFile(promptFile, zigFiles, resourceFiles)
	}

	console.log('\n🎉 All prompts processed successfully!')
}

main().catch(console.error)
