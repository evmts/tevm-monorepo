import crypto from 'node:crypto'
import fs, { promises as fsPromises } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { type FileAccessObject, moduleFactory } from '@tevm/resolutions'
import { moduleFactoryJs } from '@tevm/resolutions-rs'
import { runPromise, runSync } from 'effect/Effect'
import { afterAll, bench, describe } from 'vitest'

/**
 * Benchmark that generates a deep module graph with 1000+ Solidity files
 * and benchmarks different module resolution implementations.
 *
 * This benchmark:
 * 1. Creates a temporary directory with a generated deep module graph
 * 2. Each module has a realistic number of imports
 * 3. Tests JavaScript sync, JavaScript async, and Rust implementations
 * 4. Cleans up the temporary files after the benchmark
 */

// Constants for the benchmark
const NUM_MODULES = 250 // Target number of modules to generate
const IMPORTS_PER_MODULE_MIN = 1
const IMPORTS_PER_MODULE_MAX = 5
const MODULE_DEPTH_MAX = 100 // Maximum directory depth (10x the original)
const MAX_MODULES_PER_DIR = 30

// Library imports configuration
const LIBS = ['@openzeppelin/contracts', '@uniswap/v3-core', '@chainlink/contracts']
const LIB_IMPORT_CHANCE = 0.25 // 25% chance of importing from a lib
const REMAPPED_IMPORT_CHANCE = 0.15 // 15% chance of importing from a remapped path
const NODE_MODULES_IMPORT_CHANCE = 0.2 // 20% chance of importing from node_modules

/**
 * Generate a realistic Solidity contract template
 */
function generateSolidityContract(contractName: string, imports: string[]) {
	const importStatements = imports.map((imp) => `import "${imp}";`).join('\n')

	return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

${importStatements}

/**
 * @title ${contractName}
 * @dev This is an auto-generated contract for benchmarking
 */
contract ${contractName} {
    // State variables
    uint256 private _value;
    address private _owner;
    mapping(address => uint256) private _balances;
    
    // Events
    event ValueChanged(uint256 newValue);
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    // Constructor
    constructor() {
        _owner = msg.sender;
        _value = 100;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == _owner, "Not owner");
        _;
    }
    
    // External functions
    function setValue(uint256 newValue) external onlyOwner {
        _value = newValue;
        emit ValueChanged(newValue);
    }
    
    function getValue() external view returns (uint256) {
        return _value;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    // Internal functions
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}`
}

/**
 * Create a temporary directory structure with specified module count and depth
 */
async function createModuleGraph() {
	// Create a unique temporary directory
	const tempDir = path.join(os.tmpdir(), `tevm-benchmark-${crypto.randomBytes(8).toString('hex')}`)

	console.log(`Creating module graph in: ${tempDir}`)
	await fsPromises.mkdir(tempDir, { recursive: true })

	// Setup directory structure
	const directories: string[] = []
	const moduleFiles: {
		path: string
		relativePath: string
		name: string
		imports: string[]
	}[] = []

	// Create directories for different depths
	for (let depth = 0; depth <= MODULE_DEPTH_MAX; depth++) {
		// We'll create fewer directories at deep levels to avoid too many empty directories
		const dirCountAtDepth = Math.max(1, Math.min(5, Math.floor(15 / (Math.floor(depth / 10) + 1))))

		for (let dirIdx = 0; dirIdx < dirCountAtDepth; dirIdx++) {
			const dirPath = path.join(tempDir, `depth${depth}_dir${dirIdx}`)
			directories.push(dirPath)
			await fsPromises.mkdir(dirPath, { recursive: true })
		}
	}

	// Create library directories for the 3 requested libs
	const libDirectories: Record<string, string[]> = {}

	for (const lib of LIBS) {
		// Create a directory structure for each library
		const libBaseDir = path.join(tempDir, 'node_modules', lib)
		await fsPromises.mkdir(libBaseDir, { recursive: true })

		// Create subdirectories for each library
		const libDirs = ['token', 'access', 'security', 'utils', 'interfaces', 'math', 'governance']
		libDirectories[lib] = []

		for (const dir of libDirs) {
			const libDir = path.join(libBaseDir, dir)
			await fsPromises.mkdir(libDir, { recursive: true })
			libDirectories[lib].push(libDir)
		}

		// Create some sample contracts in each library
		for (const libDir of libDirectories[lib]) {
			for (let i = 0; i < 5; i++) {
				const libDirName = path.basename(libDir)
				const contractName = `${libDirName.charAt(0).toUpperCase() + libDirName.slice(1)}${i}`
				const fileName = `${contractName}.sol`
				const filePath = path.join(libDir, fileName)
				const contractContent = generateSolidityContract(contractName, [])
				await fsPromises.writeFile(filePath, contractContent)
			}
		}
	}

	// Create a remapped directory called "foundation" with several subdirectories
	const remappedDir = path.join(tempDir, 'foundation')
	await fsPromises.mkdir(remappedDir, { recursive: true })

	const remappedSubDirs = ['core', 'standards', 'modules', 'protocols']
	const remappedDirs: string[] = []

	for (const dir of remappedSubDirs) {
		const remappedSubDir = path.join(remappedDir, dir)
		await fsPromises.mkdir(remappedSubDir, { recursive: true })
		remappedDirs.push(remappedSubDir)

		// Create some sample contracts in each remapped directory
		for (let i = 0; i < 5; i++) {
			const dirName = path.basename(remappedSubDir)
			const contractName = `Foundation${dirName.charAt(0).toUpperCase() + dirName.slice(1)}${i}`
			const fileName = `${contractName}.sol`
			const filePath = path.join(remappedSubDir, fileName)
			const contractContent = generateSolidityContract(contractName, [])
			await fsPromises.writeFile(filePath, contractContent)
		}
	}

	// Create node_modules directory with some common Ethereum packages
	const nodeModulesDir = path.join(tempDir, 'node_modules')
	await fsPromises.mkdir(nodeModulesDir, { recursive: true })

	// Additional node_modules packages beyond our main libs
	const additionalNodeModules = [
		'hardhat/console.sol',
		'solmate/src/tokens/ERC20.sol',
		'solmate/src/tokens/ERC721.sol',
		'solmate/src/utils/SafeTransferLib.sol',
		'forge-std/Test.sol',
		'forge-std/console.sol',
		'@rari-capital/solmate/src/tokens/ERC1155.sol',
	]

	// Create the directories and files for additional node_modules
	for (const modulePath of additionalNodeModules) {
		const parts = modulePath.split('/')
		const fileName = parts.pop() || '' // Get the file name
		const dirPath = path.join(nodeModulesDir, ...parts) // Join remaining parts for directory path

		await fsPromises.mkdir(dirPath, { recursive: true })

		const contractName = fileName.replace('.sol', '')
		const filePath = path.join(dirPath, fileName)
		const contractContent = generateSolidityContract(contractName, [])
		await fsPromises.writeFile(filePath, contractContent)
	}

	// Create modules with proper directory distribution
	for (let moduleIdx = 0; moduleIdx < NUM_MODULES; moduleIdx++) {
		const dirIndex = Math.floor(Math.random() * directories.length)
		const dirPath = directories[dirIndex]

		// Ensure we don't put too many modules in one directory
		const filesInDir = moduleFiles.filter((f) => path.dirname(f.path) === dirPath).length

		if (filesInDir >= MAX_MODULES_PER_DIR) {
			// Skip this directory and try with different one next time
			moduleIdx--
			continue
		}

		const contractName = `Contract_${moduleIdx}`
		const fileName = `${contractName}.sol`
		const filePath = path.join(dirPath, fileName)
		const relativeFilePath = path.relative(tempDir, filePath)

		moduleFiles.push({
			path: filePath,
			relativePath: relativeFilePath.replace(/\\/g, '/'), // Normalize for cross-platform
			name: contractName,
			imports: [], // We'll populate this later
		})
	}

	// Helper function to generate an import from a library
	const generateLibImport = () => {
		const lib = LIBS[Math.floor(Math.random() * LIBS.length)]
		const libDirs = libDirectories[lib]
		const randomDir = libDirs[Math.floor(Math.random() * libDirs.length)]
		const dirName = path.basename(randomDir)
		const contractIndex = Math.floor(Math.random() * 5)
		const contractName = `${dirName.charAt(0).toUpperCase() + dirName.slice(1)}${contractIndex}`

		return `${lib}/${dirName}/${contractName}.sol`
	}

	// Helper function to generate a remapped import
	const generateRemappedImport = () => {
		const remappedCategory = remappedSubDirs[Math.floor(Math.random() * remappedSubDirs.length)]
		const contractIndex = Math.floor(Math.random() * 5)
		const contractName = `Foundation${remappedCategory.charAt(0).toUpperCase() + remappedCategory.slice(1)}${contractIndex}`

		return `@foundation/${remappedCategory}/${contractName}.sol`
	}

	// Helper function to generate a node_modules import
	const generateNodeModulesImport = () => {
		return additionalNodeModules[Math.floor(Math.random() * additionalNodeModules.length)]
	}

	// Set up the imports (needs to be done after creating all files to prevent circular issues)
	for (let moduleIdx = 0; moduleIdx < moduleFiles.length; moduleIdx++) {
		const module = moduleFiles[moduleIdx]

		// Determine number of imports for this module
		const numImports = Math.floor(
			Math.random() * (IMPORTS_PER_MODULE_MAX - IMPORTS_PER_MODULE_MIN + 1) + IMPORTS_PER_MODULE_MIN,
		)

		// Import counter
		let importCount = 0

		// First decide if we'll add a library import
		if (Math.random() < LIB_IMPORT_CHANCE && importCount < numImports) {
			module.imports.push(generateLibImport())
			importCount++
		}

		// Next decide if we'll add a remapped import
		if (Math.random() < REMAPPED_IMPORT_CHANCE && importCount < numImports) {
			module.imports.push(generateRemappedImport())
			importCount++
		}

		// Next decide if we'll add a node_modules import
		if (Math.random() < NODE_MODULES_IMPORT_CHANCE && importCount < numImports) {
			module.imports.push(generateNodeModulesImport())
			importCount++
		}

		// Fill the rest with relative imports
		if (importCount < numImports) {
			// Avoid importing itself
			const availableModules = moduleFiles.filter(
				(m) => m.path !== module.path && !module.imports.some((imp) => imp.includes(m.name)),
			)

			// Randomly select modules to import
			for (let importIdx = 0; importIdx < numImports - importCount; importIdx++) {
				if (availableModules.length === 0) break

				const randomIndex = Math.floor(Math.random() * availableModules.length)
				const importModule = availableModules[randomIndex]

				// Calculate relative import path
				let relativePath = path.relative(path.dirname(module.path), path.dirname(importModule.path))

				// Handle same directory case (turn empty string into current dir)
				if (relativePath === '') {
					relativePath = '.'
				}

				const importPath = `${relativePath}/${path.basename(importModule.path)}`.replace(/\\/g, '/')
				module.imports.push(importPath)

				// Remove from available modules to prevent duplicate imports
				availableModules.splice(randomIndex, 1)
			}
		}
	}

	// Actually write the files
	console.log(`Writing ${moduleFiles.length} Solidity contract files...`)

	for (const module of moduleFiles) {
		const code = generateSolidityContract(module.name, module.imports)
		await fsPromises.writeFile(module.path, code)
	}

	// Create an entry point file that imports a subset of modules
	const entryPointFile = path.join(tempDir, 'EntryPoint.sol')

	// Make the entry point import from a mix of relative, lib, remapped, and node_modules paths
	const rootImports = [
		// Some relative imports
		...moduleFiles.slice(0, Math.min(3, moduleFiles.length)).map((m) => `./${m.relativePath}`),
		// A library import
		generateLibImport(),
		// A remapped import
		generateRemappedImport(),
		// A node_modules import
		generateNodeModulesImport(),
	]

	await fsPromises.writeFile(entryPointFile, generateSolidityContract('EntryPoint', rootImports))

	return {
		tempDir,
		entryPointFile,
		moduleCount:
			moduleFiles.length +
			LIBS.length * 7 * 5 + // Library files (3 libs × 7 directories × 5 files)
			remappedSubDirs.length * 5 + // Remapped files (4 directories × 5 files)
			additionalNodeModules.length, // Additional node_modules files
	}
}

/**
 * Create a file access object for the benchmark
 */
function createFileAccessObject(): FileAccessObject {
	return {
		readFile: async (filePath) => {
			try {
				return await fsPromises.readFile(filePath, 'utf8')
			} catch (error) {
				console.error(`Error reading file: ${filePath}`, error)
				throw error
			}
		},
		readFileSync: (filePath, encoding) => {
			try {
				return fs.readFileSync(filePath, encoding as BufferEncoding)
			} catch (error) {
				console.error(`Error reading file sync: ${filePath}`, error)
				throw error
			}
		},
		existsSync: (filePath) => {
			return fs.existsSync(filePath)
		},
		async exists(filePath) {
			try {
				await fsPromises.access(filePath)
				return true
			} catch {
				return false
			}
		},
	}
}

describe('Solidity Module Graph Resolution Benchmarks', async () => {
	// Generate the module graph before running the benchmark
	const { tempDir, entryPointFile, moduleCount } = await createModuleGraph()
	console.log(`Created module graph with ${moduleCount} modules`)
	console.log(`Entry point: ${entryPointFile}`)

	// Create the file access object
	const fao = createFileAccessObject()

	// Read the entry point file content
	const entryPointContent = await fsPromises.readFile(entryPointFile, 'utf8')

	// Set up remappings for our imports
	const remappings = {
		'@foundation/': path.join(tempDir, 'foundation/'),
		'@openzeppelin/contracts/': path.join(tempDir, 'node_modules/@openzeppelin/contracts/'),
		'@uniswap/v3-core/': path.join(tempDir, 'node_modules/@uniswap/v3-core/'),
		'@chainlink/contracts/': path.join(tempDir, 'node_modules/@chainlink/contracts/'),
	}

	// Include lib paths
	const libs = [path.join(tempDir, 'node_modules'), path.join(tempDir, 'foundation')]

	console.log('Remappings:', remappings)
	console.log('Libs:', libs)

	// Set up cleanup after all tests
	afterAll(async () => {
		try {
			await fsPromises.rm(tempDir, { recursive: true, force: true })
			console.log(`Cleaned up temporary directory: ${tempDir}`)
		} catch (error) {
			console.error(`Error cleaning up temporary directory: ${tempDir}`, error)
		}
	})

	// Run the benchmarks
	bench.skip('JavaScript sync Implementation', async () => {
		runSync(
			moduleFactory(
				entryPointFile,
				entryPointContent,
				remappings,
				libs,
				fao,
				true, // true = sync mode
			),
		)
	})

	bench('JavaScript async Implementation', async () => {
		await runPromise(
			moduleFactory(
				entryPointFile,
				entryPointContent,
				remappings,
				libs,
				fao,
				false, // false = async mode
			),
		)
	})

	bench('Rust Implementation', async () => {
		// Save original console.warn
		const originalWarn = console.warn

		// Silence warnings during the benchmark
		console.warn = () => {}

		try {
			await moduleFactoryJs(
				entryPointFile,
				entryPointContent,
				Object.entries(remappings),
				libs.map((lib) => String(lib)),
			)
		} finally {
			// Restore original console.warn
			console.warn = originalWarn
		}
	})
})
