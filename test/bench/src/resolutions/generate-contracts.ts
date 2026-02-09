import fs, { promises as fsPromises } from 'node:fs'
import path, { join } from 'node:path'
import { type FileAccessObject } from '@tevm/resolutions'
import * as resolutionsRs from '@tevm/resolutions-rs'

// First, log the entire module to see what's being exported
console.log('Resolutions-RS Exports:', Object.keys(resolutionsRs))

// Extract the moduleFactoryJs function
const { moduleFactoryJs: _moduleFactoryJs } = resolutionsRs

// Paths to our test fixtures
const FIXTURE_DIR = path.join(__dirname)
const CONTRACTS_DIR = path.join(FIXTURE_DIR, 'contracts')
const INTERFACES_DIR = path.join(FIXTURE_DIR, 'interfaces')
const LIBRARIES_DIR = path.join(FIXTURE_DIR, 'libraries')

// Create a proper file access object that can resolve imports correctly
const _fao: FileAccessObject = {
	// This is the key function for resolving imports
	readFile: fsPromises.readFile,
	readFileSync: fs.readFileSync,
	existsSync: fs.existsSync,
	async exists(filePath) {
		try {
			await fsPromises.access(filePath)
			return true
		} catch (_error) {
			return false
		}
	},
}

// Define remappings to help resolve imports
const _remappings = {
	// Map import paths to actual file locations
	'../interfaces/': `${INTERFACES_DIR}/`,
	'../libraries/': `${LIBRARIES_DIR}/`,
	'./': `${CONTRACTS_DIR}/`,
}

// Generate 4 levels deep with 5 imports each (5^4 = 625 contracts total)
const DEPTH = 4
const WIDTH = 4

// Initialize these variables at declaration
const tempDir = join(__dirname)
// We'll directly use the returned value from generateContractAt function
// Initialize FileAccessObject for deep graph
const _deepGraphFao: FileAccessObject = {
	readFile: fsPromises.readFile,
	readFileSync: fs.readFileSync,
	existsSync: fs.existsSync,
	async exists(filePath) {
		try {
			await fsPromises.access(filePath)
			return true
		} catch (_error) {
			return false
		}
	},
}
// Initialize remappings for the deep graph
const _deepGraphRemappings: Record<string, string> = {
	'@lib1/': `${path.join(tempDir, 'lib1')}/`,
	'@lib2/': `${path.join(tempDir, 'lib2')}/`,
	'@lib3/': `${path.join(tempDir, 'lib3')}/`,
	'@lib4/': `${path.join(tempDir, 'lib4')}/`,
	'./': `${path.join(tempDir, 'contracts')}/`,
}

// Generate a complex contract template that resembles real Solidity code
const generateContractTemplate = (name: string, imports: string[] = []): string => {
	const importStatements = imports.map((imp) => `import "${imp}";`).join('\n')

	// Create a contract with typical Solidity patterns, events, modifiers, functions, etc.
	return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

${importStatements}

/**
 * @title ${name}
 * @dev This is a complex contract with typical patterns found in production code
 * @author TEVM Benchmark Generator
 * @notice This contract is generated for benchmarking import resolution
 */
contract ${name} {
    // ============ Events ============
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event NewOwner(address indexed previousOwner, address indexed newOwner);
    
    // ============ Storage ============
    uint256 private constant MAX_UINT256 = type(uint256).max;
    bytes32 private constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _tokenCount;
    
    address private _owner;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    bool private _paused;
    
    // ============ Modifiers ============
    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }
    
    // ============ Constructor ============
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
        _owner = msg.sender;
        
        // Generate some random initial state
        _totalSupply = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, address(this)))) % 1000000 * 10**18;
        _balances[msg.sender] = _totalSupply;
        
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit NewOwner(address(0), msg.sender);
    }
    
    // ============ Public Functions ============
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public whenNotPaused returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public whenNotPaused returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
    
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, _allowances[owner][spender] + addedValue);
        return true;
    }
    
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _allowances[owner][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }
        return true;
    }
    
    // ============ Owner Functions ============
    function pause() public onlyOwner {
        _paused = true;
    }
    
    function unpause() public onlyOwner {
        _paused = false;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "ERC20: mint to the zero address");
        
        _totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function burn(uint256 amount) public {
        address account = msg.sender;
        require(account != address(0), "ERC20: burn from the zero address");
        
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;
        
        emit Transfer(account, address(0), amount);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        address oldOwner = _owner;
        _owner = newOwner;
        emit NewOwner(oldOwner, newOwner);
    }
    
    // ============ Internal Functions ============
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        
        emit Transfer(from, to, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        uint256 currentAllowance = _allowances[owner][spender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }
    
    // Some complex computation to simulate real contract code
    function complexComputation(uint256 a, uint256 b) public pure returns (uint256) {
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        
        uint256 result = 0;
        for (uint256 i = 0; i < 10; i++) {
            result += c / (i + 1);
        }
        
        return result;
    }
}
`
}

// Generate a leaf node contract with no imports but lots of complexity
const generateLeafContract = (name: string): string => {
	return generateContractTemplate(name, [])
}

// Create the temp directory
await fsPromises.mkdir(tempDir, { recursive: true })

// Create the library paths
const libPaths = [
	path.join(tempDir, 'lib1'),
	path.join(tempDir, 'lib2'),
	path.join(tempDir, 'lib3'),
	path.join(tempDir, 'lib4'),
]

for (const libPath of libPaths) {
	await fsPromises.mkdir(libPath, { recursive: true })
}

// Create the contracts directory
const contractsDir = path.join(tempDir, 'contracts')
await fsPromises.mkdir(contractsDir, { recursive: true })

console.log(`Created temp directory at: ${tempDir}`)

// File system access object and remappings already initialized above

// Generate the super deep import graph
const generateContractAt = async (depth: number, index: number, _parentPath = ''): Promise<string> => {
	const contractName = `Contract_D${depth}_I${index}`
	const contractDir = path.join(tempDir, 'contracts', `level${depth}`)
	await fsPromises.mkdir(contractDir, { recursive: true })

	const contractPath = path.join(contractDir, `${contractName}.sol`)

	if (depth === DEPTH) {
		// Leaf node - no imports but complex contract
		const contractContent = generateLeafContract(contractName)
		await fsPromises.writeFile(contractPath, contractContent)
		return contractPath
	}

	// Generate child imports
	const imports: string[] = []

	for (let i = 0; i < WIDTH; i++) {
		// Different import patterns based on the index
		let importPath: string

		if (i === 0) {
			// Use remapping for lib1
			const libDir = path.join(tempDir, 'lib1', `level${depth + 1}`)
			await fsPromises.mkdir(libDir, { recursive: true })

			const childName = `Lib1_D${depth + 1}_I${i}`
			const childPath = path.join(libDir, `${childName}.sol`)

			// Create the contract in the lib1 directory
			if (depth + 1 === DEPTH) {
				await fsPromises.writeFile(childPath, generateLeafContract(childName))
			} else {
				// This will be filled in the recursive call
				await fsPromises.writeFile(childPath, '// Placeholder')
			}

			importPath = `@lib1/level${depth + 1}/${childName}.sol`

			// If not a leaf, we need to continue generating the import chain
			if (depth + 1 < DEPTH) {
				await generateContractAt(depth + 1, i, childPath)

				// Now update the file with proper imports
				const childImports: string[] = []
				for (let j = 0; j < WIDTH; j++) {
					const nextDepth = depth + 2
					if (nextDepth <= DEPTH) {
						const nextChildName = `Contract_D${nextDepth}_I${j}`
						childImports.push(`./level${nextDepth}/${nextChildName}.sol`)
					}
				}

				const updatedContent = generateContractTemplate(childName, childImports)
				await fsPromises.writeFile(childPath, updatedContent)
			}
		} else if (i === 1) {
			// Use lib4 which is the last in the lib paths
			const libDir = path.join(tempDir, 'lib4', `level${depth + 1}`)
			await fsPromises.mkdir(libDir, { recursive: true })

			const childName = `Lib4_D${depth + 1}_I${i}`
			const childPath = path.join(libDir, `${childName}.sol`)

			// Create the contract in the lib4 directory
			if (depth + 1 === DEPTH) {
				await fsPromises.writeFile(childPath, generateLeafContract(childName))
			} else {
				// This will be filled in the recursive call
				await fsPromises.writeFile(childPath, '// Placeholder')
			}

			importPath = `@lib4/level${depth + 1}/${childName}.sol`

			// If not a leaf, we need to continue generating the import chain
			if (depth + 1 < DEPTH) {
				await generateContractAt(depth + 1, i, childPath)

				// Now update the file with proper imports
				const childImports: string[] = []
				for (let j = 0; j < WIDTH; j++) {
					const nextDepth = depth + 2
					if (nextDepth <= DEPTH) {
						const nextChildName = `Contract_D${nextDepth}_I${j}`
						childImports.push(`./level${nextDepth}/${nextChildName}.sol`)
					}
				}

				const updatedContent = generateContractTemplate(childName, childImports)
				await fsPromises.writeFile(childPath, updatedContent)
			}
		} else {
			// Standard relative import
			const childPath = await generateContractAt(depth + 1, i)
			const childName = path.basename(childPath, '.sol')
			importPath = `./level${depth + 1}/${childName}.sol`
		}

		imports.push(importPath)
	}

	// Create the contract with imports
	const contractContent = generateContractTemplate(contractName, imports)
	await fsPromises.writeFile(contractPath, contractContent)

	return contractPath
}

// Start generation from the root contract
const generatedEntryContractPath = await generateContractAt(0, 0)
console.log(`Generated entry contract at: ${generatedEntryContractPath}`)

const totalContracts = Array(DEPTH + 1)
	.fill(0)
	.map((_, i) => WIDTH ** i)
	.reduce((sum, current) => sum + current, 0)

console.log(`Generated approximately ${totalContracts} contracts in the import graph`)
