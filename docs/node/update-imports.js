import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get all files that might need to be updated
const allMdxFiles = []

function getAllMdxFiles(dir) {
	const files = fs.readdirSync(dir)

	files.forEach((file) => {
		const filePath = path.join(dir, file)
		const stat = fs.statSync(filePath)

		if (stat.isDirectory()) {
			getAllMdxFiles(filePath)
		} else if (file.endsWith('.mdx')) {
			allMdxFiles.push(filePath)
		}
	})
}

getAllMdxFiles(path.resolve(__dirname, 'docs/pages'))

// Filter for files that have vocs/components imports with problematic components
const files = allMdxFiles.filter((file) => {
	try {
		const content = fs.readFileSync(file, 'utf8')
		return (
			content.includes("from 'vocs/components'") &&
			(content.includes('Tabs') ||
				content.includes('Tab') ||
				content.includes('Card') ||
				content.includes('Cards') ||
				content.includes('FileTree'))
		)
	} catch (_e) {
		return false
	}
})

// Function to update imports in a file
function updateImports(filePath) {
	const fullPath = path.resolve(__dirname, filePath)
	const content = fs.readFileSync(fullPath, 'utf8')

	// Extract existing components from vocs/components
	const importMatch = content.match(/import\s*{(.*?)}\s*from\s*['"]vocs\/components['"]/)

	if (!importMatch) {
		console.log(`No vocs/components import found in ${filePath}`)
		return
	}

	const components = importMatch[1].split(',').map((comp) => comp.trim())

	// Components to keep from vocs/components
	const vocsComponents = ['Callout', 'Button', 'Steps', 'Step', 'HomePage']

	// Components to get from our custom components
	const customComponents = ['Tab', 'TabGroup', 'Card', 'CardGrid', 'FileTree']

	const keepComponents = components.filter((comp) => {
		// Extract the actual component name (ignoring aliases)
		const compName = comp.split(' as ')[0]
		return vocsComponents.includes(compName)
	})

	const needCustomComponents = components
		.filter((comp) => {
			// Extract the actual component name (ignoring aliases)
			const compName = comp.split(' as ')[0]
			return customComponents.includes(compName) || compName === 'Cards' || compName === 'Tabs'
		})
		.map((comp) => {
			// Replace Tabs with TabGroup and Cards with CardGrid
			if (comp === 'Tabs') return 'TabGroup'
			if (comp === 'Cards') return 'CardGrid'
			return comp
		})

	// Create new imports
	let newContent = content

	// Replace the vocs/components import
	if (keepComponents.length > 0) {
		const vocsImport = `import { ${keepComponents.join(', ')} } from 'vocs/components'`
		newContent = newContent.replace(/import\s*{.*?}\s*from\s*['"]vocs\/components['"]/, vocsImport)
	} else {
		newContent = newContent.replace(/import\s*{.*?}\s*from\s*['"]vocs\/components['"]\s*\n/, '')
	}

	// Add custom components import if needed
	if (needCustomComponents.length > 0) {
		// Calculate the relative path to components based on the file's location
		const depth = filePath.split('/').length - 2 // -2 for docs/pages
		const relativePath = Array(depth).fill('..').join('/')
		const customComponentsImport = `import { ${needCustomComponents.join(', ')} } from '${relativePath}/components'`

		if (keepComponents.length > 0) {
			// Add after the vocs import
			newContent = newContent.replace(
				/import\s*{.*?}\s*from\s*['"]vocs\/components['"]/,
				`$&\n${customComponentsImport}`,
			)
		} else {
			// Add at the beginning of the frontmatter
			newContent = newContent.replace(/---\s*\n(.*?)\n---\s*\n/s, `---\n$1\n---\n\n${customComponentsImport}\n`)
		}
	}

	// Write the updated content back to the file
	fs.writeFileSync(fullPath, newContent)
	console.log(`Updated imports in ${filePath}`)
}

// Update all files
files.forEach(updateImports)
