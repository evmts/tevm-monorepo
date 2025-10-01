/**
 * Utilities for generating editor templates
 */
import { isViemAction } from './clients.js'

// @ts-nocheck
// This disables TypeScript checking for this file since it has many index access issues

/**
 * Helper to create a formatted template for arguments
 * @param {any} value - The value to format for template
 * @returns {string} - The formatted string
 */
function parseArgsForTemplate(value) {
	if (typeof value !== 'string') return `${value}`

	try {
		// Only try to parse if it looks like JSON
		if (value.trim().startsWith('[') || value.trim().startsWith('{')) {
			const parsedValue = JSON.parse(value)
			return JSON.stringify(parsedValue)
		}
	} catch (_e) {
		// Parsing failed, so treat it as a regular string
	}

	// Return as quoted string
	return `"${value}"`
}

/**
 * Creates all template files needed for the editor
 * @param {string} actionName - The action name
 * @param {any} options - The options object
 * @param {Function} _createParams - Function to create params
 */
export function generateTemplates(actionName, options, _createParams) {
	// Note: renamed createParams to _createParams to indicate it's unused

	// Determine Viem vs TEVM action
	const isViem = isViemAction(actionName)

	// Check if we need to import ERC20 for this action
	const needsAbi = actionName === 'readContract' || actionName === 'multicall' || actionName === 'simulateCalls'

	const needsERC20 = needsAbi && (!options['abi'] || options['abi'] === '')

	// Generate script template using the appropriate client
	const scriptTemplate = generateScriptTemplate(actionName, options, isViem, needsERC20)

	// Generate standard configuration files
	const packageJson = generatePackageJson(actionName)
	const pluginsTemplate = generatePluginsTemplate()
	const bunfigTemplate = generateBunfigTemplate()
	const tsconfigTemplate = generateTsconfigTemplate()

	// Generate readme with action-specific info
	const readmeContent = generateReadmeContent(actionName, options, isViem)

	return {
		scriptTemplate,
		packageJson,
		pluginsTemplate,
		bunfigTemplate,
		tsconfigTemplate,
		readmeContent,
	}
}

/**
 * Generate script template for an action
 * @param {string} actionName - The action name
 * @param {any} options - The options object
 * @param {boolean} isViem - Whether this is a Viem action
 * @param {boolean} needsERC20 - Whether to import ERC20 contract
 * @returns {string} - The script template
 */
function generateScriptTemplate(actionName, options, isViem, needsERC20) {
	// Filter out UI-only options
	/**
	 * @type {any}
	 */
	const paramsObj = {}
	Object.entries(options).forEach(([key, value]) => {
		if (key === 'run' || key === 'formatJson' || key === 'rpc') return
		paramsObj[key] = value
	})

	// Format the params
	const paramsStr = Object.entries(paramsObj)
		.map(([key, value]) => {
			if (value === undefined) return null

			// Handle different value types
			if (typeof value === 'bigint') {
				return `    ${key}: BigInt("${value.toString()}")`
			} else if (key === 'abi') {
				// Skip abi in params string - we'll handle it separately
				return null
			} else if (key === 'args') {
				return `    ${key}: ${parseArgsForTemplate(value)}`
			} else if (typeof value === 'string') {
				return `    ${key}: "${value.replace(/"/g, '\\"')}"` // Escape quotes
			} else if (typeof value === 'boolean' || typeof value === 'number') {
				return `    ${key}: ${value}`
			}
			return null
		})
		.filter(Boolean)
		.join(',\n')

	// Handle ABI specially
	let abiParam = ''
	if (options['abi']) {
		try {
			const parsedAbi = JSON.parse(options['abi'])
			abiParam = `    abi: ${JSON.stringify(parsedAbi)},\n`
		} catch (_e) {
			// If parsing fails and we need an ABI, use ERC20
			if (needsERC20) {
				abiParam = '    abi: ERC20.abi,\n'
			}
		}
	} else if (needsERC20) {
		// If no ABI provided but we need one, use ERC20.abi
		abiParam = '    abi: ERC20.abi,\n'
	}

	// Add onStep handler for tevmCall actions
	let onStepHandler = ''
	if (actionName === 'call' || actionName === 'tevmCall') {
		onStepHandler = `
    // Uncomment this onStep handler to inspect EVM execution step by step
    // onStep: (data, next) => {
    //   console.log(data.opcode.name); // Log the current opcode name
    //   next?.(); // Continue to the next step
    // },`
	}

	// Create the function call
	let functionCall
	if (isViem) {
		// For Viem actions
		functionCall =
			needsERC20 && !abiParam
				? `${actionName}({
    abi: ERC20.abi,
${paramsStr}
})`
				: `${actionName}({
${abiParam}${paramsStr}
})`
	} else {
		// For TEVM actions
		functionCall =
			needsERC20 && !abiParam
				? `${actionName}({
    abi: ERC20.abi,
${paramsStr}${onStepHandler}
})`
				: `${actionName}({
${abiParam}${paramsStr}${onStepHandler}
})`
	}

	// Create the final script template
	if (isViem) {
		// For Viem actions
		let formattedViemParams = functionCall

		// Fix numeric values in Viem calls
		formattedViemParams = formattedViemParams.replace(
			/"(value|gas|gasPrice|maxFeePerGas|maxPriorityFeePerGas)": "(\d+)"/g,
			'"$1": BigInt("$2")',
		)

		return `import { createPublicClient, http } from 'viem'
${needsERC20 ? "import { ERC20 } from '@tevm/contract'" : ''}

const client = createPublicClient({
  transport: http('${options['rpc'] || 'http://localhost:8545'}')
})

client.${formattedViemParams}
  .then(console.log)
  .catch(console.error)
`
	} else {
		// For TEVM actions
		return `import { createMemoryClient } from '@tevm/memory-client'
import { http } from '@tevm/jsonrpc'
${needsERC20 ? "import { ERC20 } from '@tevm/contract'" : ''}

const client = createMemoryClient({
  fork: {transport: http('${options['rpc'] || 'http://localhost:8545'}')}
})

client.${functionCall}
  .then(console.log)
  .catch(console.error)
`
	}
}

/**
 * Generate the package.json template
 * @param {string} actionName - The action name
 * @returns {string} - The package.json content
 */
function generatePackageJson(actionName) {
	return `{
  "name": "tevm-${actionName}-script",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "tevm": "latest",
    "viem": "latest"
  },
  "devDependencies": {
    "@tevm/ts-plugin": "latest",
    "@tevm/bun-plugin": "latest",
    "typescript": "latest",
    "bun-types": "latest"
  }
}`
}

/**
 * Generate the plugins.ts template
 * @returns {string} - The plugins.ts content
 */
function generatePluginsTemplate() {
	return `import { bunPluginTevm } from '@tevm/bun-plugin'
import { plugin } from 'bun'

// Load Tevm plugin to enable solidity imports
// Tevm is configured in the tsconfig.json
plugin(bunPluginTevm({}))
`
}

/**
 * Generate the bunfig.toml template
 * @returns {string} - The bunfig.toml content
 */
function generateBunfigTemplate() {
	return `# Load plugin including Tevm plugin
# Tevm is configured in the tsconfig.json
preload = ["./plugins.ts"]

# Use plugin in tests too
[test]
preload = ["./plugins.ts"]
`
}

/**
 * Generate the tsconfig.json template
 * @returns {string} - The tsconfig.json content
 */
function generateTsconfigTemplate() {
	return `{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@tevm/ts-plugin"
      }
    ],
    "target": "es6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["bun-types"]
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
`
}

/**
 * Generate README content based on the action
 * @param {string} actionName - The action name
 * @param {any} options - The options object
 * @param {boolean} isViem - Whether this is a Viem action
 * @returns {string} - The README content
 */
function generateReadmeContent(actionName, options, isViem) {
	const apiType = isViem ? 'Viem' : 'TEVM'

	let readmeContent = `# TEVM ${actionName} Script

This temporary project was created by the TEVM CLI to help you execute a ${actionName} action using the ${apiType} API.

## What to do now?

1. Wait a few seconds for dependencies to install (happening in the background)
2. Edit the \`script.ts\` file that opened in your editor
3. Save the file and exit the editor when you're done
4. The script will execute automatically with Bun

## Current Configuration

- **Target RPC**: ${options['rpc'] || 'http://localhost:8545'}
`

	// Add action-specific information
	if (actionName === 'call' || actionName === 'tevmCall') {
		readmeContent += `- **Target Contract**: ${options['to'] || 'Not specified'}
- **From Account**: ${options['from'] || 'Not specified'}
${options['data'] ? `- **Call Data**: ${options['data']}` : ''}
`
	} else if (actionName === 'readContract') {
		readmeContent += `- **Contract Address**: ${options['address'] || options['to'] || 'Not specified'}
- **Function Name**: ${options['functionName'] || 'Not specified'}
`
	} else if (actionName === 'estimateGas') {
		readmeContent += `- **To Address**: ${options['to'] || 'Not specified'}
- **From Address**: ${options['from'] || 'Not specified'}
${options['data'] ? `- **Transaction Data**: ${options['data']}` : ''}
`
	}

	readmeContent += `
## Documentation

- TEVM Documentation: https://tevm.sh/
- Viem Documentation: https://viem.sh/

## Troubleshooting

- If you encounter dependency issues, try running \`bun install\` manually in this directory
- Make sure your target RPC endpoint is accessible
- Check that your contract address and call data are valid
`

	return readmeContent
}
