import { promises as fs } from 'node:fs'
import path from 'node:path'
// Example usage of @tevm/resolutions-rs
import { processModule, resolveImports } from '@tevm/resolutions-rs'

// Example Solidity code with imports
const code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Dep1.sol";
import "./utils/Util.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Example {
    function getAnswer() public pure returns (uint256) {
        return 42;
    }
}`

async function run() {
	try {
		// Create a temporary directory and files for testing
		const tempDir = path.join(process.cwd(), 'temp-test')
		await fs.mkdir(tempDir, { recursive: true })
		await fs.mkdir(path.join(tempDir, 'utils'), { recursive: true })

		// Create the Solidity files
		const mainFile = path.join(tempDir, 'Example.sol')
		const dep1File = path.join(tempDir, 'Dep1.sol')
		const utilFile = path.join(tempDir, 'utils', 'Util.sol')

		await fs.writeFile(mainFile, code)
		await fs.writeFile(dep1File, '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract Dep1 {}')
		await fs.writeFile(utilFile, '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\nlibrary Util {}')

		// Define remappings similar to Solidity's remappings
		const remappings = {
			'@openzeppelin/': path.join(process.cwd(), 'node_modules', '@openzeppelin'),
		}

		// Define library paths
		const libs = [path.join(process.cwd(), 'lib')]

		console.log('Resolving imports using Rust implementation...')
		console.time('resolveImports')

		// Resolve imports using the Rust implementation
		const imports = await resolveImports(mainFile, code, remappings, libs)

		console.timeEnd('resolveImports')
		console.log('Resolved imports:', imports)

		console.log('\nProcessing module using Rust implementation...')
		console.time('processModule')

		// Process the module
		const moduleInfo = await processModule(mainFile, code, remappings, libs)

		console.timeEnd('processModule')
		console.log('Module info:', moduleInfo)

		// Clean up
		await fs.rm(tempDir, { recursive: true, force: true })
	} catch (error) {
		console.error('Error:', error)
	}
}

run()
