import { describe, expect, it } from 'vitest'
import { createShadowContract } from './createShadowContract.js'

describe('createShadowContract', () => {
	describe('basic functionality', () => {
		it('should create shadow contract with basic inputs', () => {
			const shadowBody = 'function getBalance() public view returns (uint256) { return 100; }'
			const sourceContractPath = '/contracts/ERC20.sol'
			const sourceContractName = 'ERC20'

			const result = createShadowContract(shadowBody, sourceContractPath, sourceContractName)

			expect(result).toBeDefined()
			expect(Object.keys(result)).toHaveLength(1)
			// Note: path.extname returns '.sol' (with dot), so we get double dots
			expect(Object.keys(result)[0]).toBe('/contracts/__TevmShadow_ERC20__.sol')
		})

		it('should generate correct shadow contract path with naming pattern', () => {
			const result = createShadowContract('function test() {}', '/path/to/MyContract.sol', 'MyContract')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('__TevmShadow_MyContract__')
			expect(shadowPath).toContain('/path/to/')
		})

		it('should generate correct contract code structure', () => {
			const shadowBody = 'function getValue() public pure returns (uint256) { return 42; }'
			const result = createShadowContract(shadowBody, '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			expect(code).toContain('// GENERATED: Shadow contract for generating AST')
			expect(code).toContain('import { Token } from')
			expect(code).toContain('contract __TevmShadow_Token__ is Token {')
			expect(code).toContain(shadowBody)
			expect(code).toContain('}')
		})

		it('should use correct import path format', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			// Import uses relative path with file extension
			expect(code).toMatch(/import \{ Token \} from "\.\/Token\.sol"/)
		})
	})

	describe('shadow body variations', () => {
		it('should handle empty shadow body', () => {
			const result = createShadowContract('', '/contracts/Empty.sol', 'Empty')

			const code = Object.values(result)[0]
			expect(code).toContain('contract __TevmShadow_Empty__ is Empty {')
			expect(code).toContain('  \n')
			expect(code).toContain('}')
		})

		it('should handle single method shadow body', () => {
			const shadowBody = 'function test() public {}'
			const result = createShadowContract(shadowBody, '/contracts/Test.sol', 'Test')

			const code = Object.values(result)[0]
			expect(code).toContain('  function test() public {}')
		})

		it('should handle multiple methods shadow body', () => {
			const shadowBody = `
				function method1() public {}
				function method2() private view returns (uint256) {}
				modifier onlyOwner() { _; }
			`
			const result = createShadowContract(shadowBody, '/contracts/Multi.sol', 'Multi')

			const code = Object.values(result)[0]
			expect(code).toContain('function method1() public {}')
			expect(code).toContain('function method2() private view returns (uint256) {}')
			expect(code).toContain('modifier onlyOwner() { _; }')
		})

		it('should handle complex shadow body with state variables', () => {
			const shadowBody = `
				uint256 private shadowValue;
				mapping(address => uint256) public balances;

				function setShadowValue(uint256 _value) public {
					shadowValue = _value;
				}
			`
			const result = createShadowContract(shadowBody, '/contracts/Complex.sol', 'Complex')

			const code = Object.values(result)[0]
			expect(code).toContain('uint256 private shadowValue')
			expect(code).toContain('mapping(address => uint256) public balances')
			expect(code).toContain('function setShadowValue(uint256 _value) public')
		})

		it('should handle shadow body with comments and special characters', () => {
			const shadowBody = `
				// This is a shadow method
				/* Multi-line comment */
				string constant MESSAGE = "Hello, World!";
			`
			const result = createShadowContract(shadowBody, '/contracts/Comment.sol', 'Comment')

			const code = Object.values(result)[0]
			expect(code).toContain('// This is a shadow method')
			expect(code).toContain('/* Multi-line comment */')
			expect(code).toContain('string constant MESSAGE = "Hello, World!"')
		})

		it('should preserve shadow body whitespace and newlines', () => {
			const shadowBody = `
				function test1() {}

				function test2() {}
			`
			const result = createShadowContract(shadowBody, '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			expect(code).toContain('function test1() {}')
			expect(code).toContain('function test2() {}')
		})
	})

	describe('file extension handling', () => {
		it('should handle .sol extension', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('__TevmShadow_Token__')
			expect(shadowPath).toContain('.sol')

			const code = Object.values(result)[0]
			expect(code).toContain('Token.sol')
		})

		it('should handle .solidity extension', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.solidity', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('__TevmShadow_Token__')
			expect(shadowPath).toContain('.solidity')

			const code = Object.values(result)[0]
			expect(code).toContain('Token.solidity')
		})

		it('should handle files without standard extension', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.txt', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('__TevmShadow_Token__')
			expect(shadowPath).toContain('.txt')
		})

		it('should handle files with no extension', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('__TevmShadow_Token__')
			// No extension means path.extname returns empty string
			expect(shadowPath).toBe('/contracts/__TevmShadow_Token__')
		})

		it('should handle files with multiple dots in filename', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.v1.sol', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('__TevmShadow_Token__')
			// path.extname only gets the last extension
			expect(shadowPath).toContain('.sol')

			const code = Object.values(result)[0]
			expect(code).toContain('Token.v1.sol')
		})
	})

	describe('path handling', () => {
		it('should handle absolute paths', () => {
			const result = createShadowContract('function test() {}', '/home/user/projects/contracts/ERC20.sol', 'ERC20')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('/home/user/projects/contracts/')
			expect(shadowPath).toContain('__TevmShadow_ERC20__')
		})

		it('should handle relative paths', () => {
			const result = createShadowContract('function test() {}', './contracts/Token.sol', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('contracts')
			expect(shadowPath).toContain('__TevmShadow_Token__')
		})

		it('should handle nested directory paths', () => {
			const result = createShadowContract(
				'function test() {}',
				'/contracts/tokens/erc20/StandardToken.sol',
				'StandardToken',
			)

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('/contracts/tokens/erc20/')
			expect(shadowPath).toContain('__TevmShadow_StandardToken__')

			const code = Object.values(result)[0]
			expect(code).toContain('import { StandardToken }')
			expect(code).toContain('StandardToken.sol')
		})

		it('should handle paths with spaces', () => {
			const result = createShadowContract('function test() {}', '/contracts/my tokens/Token.sol', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('/contracts/my tokens/')
			expect(shadowPath).toContain('__TevmShadow_Token__')
		})

		it('should handle paths with special characters', () => {
			const result = createShadowContract('function test() {}', '/contracts/@openzeppelin/ERC20.sol', 'ERC20')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('/contracts/@openzeppelin/')
			expect(shadowPath).toContain('__TevmShadow_ERC20__')
		})

		it('should handle root directory path', () => {
			const result = createShadowContract('function test() {}', '/Token.sol', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('/__TevmShadow_Token__')
		})

		it('should handle current directory path', () => {
			const result = createShadowContract('function test() {}', './Token.sol', 'Token')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('__TevmShadow_Token__')
		})

		it('should preserve directory structure in shadow path', () => {
			const result = createShadowContract('function test() {}', '/deep/nested/path/Contract.sol', 'Contract')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('/deep/nested/path/')

			const code = Object.values(result)[0]
			// Import is relative, so only includes filename
			expect(code).toContain('./Contract')
		})
	})

	describe('contract naming', () => {
		it('should use __TevmShadow_ prefix and __ suffix', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			expect(code).toContain('contract __TevmShadow_Token__ is Token')
		})

		it('should handle contract names with numbers', () => {
			const result = createShadowContract('function test() {}', '/contracts/ERC20.sol', 'ERC20')

			const code = Object.values(result)[0]
			expect(code).toContain('contract __TevmShadow_ERC20__ is ERC20')
		})

		it('should handle contract names with underscores', () => {
			const result = createShadowContract('function test() {}', '/contracts/My_Token.sol', 'My_Token')

			const code = Object.values(result)[0]
			expect(code).toContain('contract __TevmShadow_My_Token__ is My_Token')
		})

		it('should handle long contract names', () => {
			const longName = 'VeryLongContractNameWithManyCharacters'
			const result = createShadowContract('function test() {}', `/contracts/${longName}.sol`, longName)

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain(`__TevmShadow_${longName}__`)

			const code = Object.values(result)[0]
			expect(code).toContain(`contract __TevmShadow_${longName}__ is ${longName}`)
		})

		it('should handle contract names with camelCase', () => {
			const result = createShadowContract('function test() {}', '/contracts/myToken.sol', 'myToken')

			const code = Object.values(result)[0]
			expect(code).toContain('contract __TevmShadow_myToken__ is myToken')
		})

		it('should handle contract name different from file name', () => {
			const result = createShadowContract('function test() {}', '/contracts/token-impl.sol', 'TokenImpl')

			const code = Object.values(result)[0]
			expect(code).toContain('import { TokenImpl }')
			expect(code).toContain('contract __TevmShadow_TokenImpl__ is TokenImpl')
			expect(code).toContain('token-impl.sol')
		})
	})

	describe('code generation format', () => {
		it('should include generated comment at the top', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			const lines = code?.trim().split('\n')
			expect(lines?.[0]).toBe('// GENERATED: Shadow contract for generating AST')
		})

		it('should have import statement after comment', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			const lines = code?.trim().split('\n')
			expect(lines?.[1]).toContain('import { Token }')
		})

		it('should have contract declaration with inheritance', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			expect(code).toMatch(/contract __TevmShadow_Token__ is Token \{/)
		})

		it('should indent shadow body with spaces', () => {
			const shadowBody = 'function test() {}'
			const result = createShadowContract(shadowBody, '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			expect(code).toContain('  function test() {}')
		})

		it('should have closing brace at end', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			const lines = code?.trim().split('\n')
			expect(lines?.[lines.length - 1]).toBe('}')
		})

		it('should use relative import with dot-slash prefix', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			expect(code).toContain('from "./')
		})
	})

	describe('return value structure', () => {
		it('should return object with single key-value pair', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			expect(typeof result).toBe('object')
			expect(Object.keys(result)).toHaveLength(1)
		})

		it('should use shadow contract path as key', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const key = Object.keys(result)[0]
			expect(key).toContain('/contracts/')
			expect(key).toContain('__TevmShadow_Token__')
		})

		it('should use generated contract code as value', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const value = Object.values(result)[0]
			expect(typeof value).toBe('string')
			expect(value).toContain('contract __TevmShadow_Token__')
		})

		it('should return valid Solidity-like code structure', () => {
			const result = createShadowContract('function test() {}', '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			// Check basic Solidity structure
			expect(code).toContain('import')
			expect(code).toContain('contract')
			expect(code).toContain(' is ')
			expect(code).toMatch(/\{[\s\S]*\}/)
		})
	})

	describe('integration scenarios', () => {
		it('should handle ERC20 shadow method injection', () => {
			const shadowBody = `
				function getBalance(address account) public view returns (uint256) {
					return balanceOf(account);
				}
			`
			const result = createShadowContract(shadowBody, '/contracts/ERC20.sol', 'ERC20')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('__TevmShadow_ERC20__')

			const code = Object.values(result)[0]
			expect(code).toContain('import { ERC20 }')
			expect(code).toContain('contract __TevmShadow_ERC20__ is ERC20')
			expect(code).toContain('function getBalance(address account) public view returns (uint256)')
			expect(code).toContain('return balanceOf(account)')
		})

		it('should handle NFT metadata shadow method', () => {
			const shadowBody = `
				function getTokenMetadata(uint256 tokenId) public view returns (string memory) {
					return tokenURI(tokenId);
				}
			`
			const result = createShadowContract(shadowBody, '/contracts/NFT.sol', 'NFT')

			const code = Object.values(result)[0]
			expect(code).toContain('import { NFT }')
			expect(code).toContain('contract __TevmShadow_NFT__ is NFT')
			expect(code).toContain('function getTokenMetadata(uint256 tokenId)')
			expect(code).toContain('return tokenURI(tokenId)')
		})

		it('should handle complex shadow with multiple elements', () => {
			const shadowBody = `
				mapping(bytes32 => bool) private flags;
				event FlagSet(bytes32 key, bool value);

				function setFlag(bytes32 key, bool value) public {
					flags[key] = value;
					emit FlagSet(key, value);
				}

				function getFlag(bytes32 key) public view returns (bool) {
					return flags[key];
				}
			`
			const result = createShadowContract(shadowBody, '/contracts/utils/Flags.sol', 'Flags')

			const shadowPath = Object.keys(result)[0]
			expect(shadowPath).toContain('/contracts/utils/')
			expect(shadowPath).toContain('__TevmShadow_Flags__')

			const code = Object.values(result)[0]
			expect(code).toContain('import { Flags }')
			expect(code).toContain('mapping(bytes32 => bool) private flags')
			expect(code).toContain('event FlagSet')
			expect(code).toContain('function setFlag')
			expect(code).toContain('function getFlag')
		})

		it('should handle shadow with constructor override', () => {
			const shadowBody = `
				constructor() {
					// Shadow constructor logic
				}
			`
			const result = createShadowContract(shadowBody, '/contracts/Token.sol', 'Token')

			const code = Object.values(result)[0]
			expect(code).toContain('constructor()')
			expect(code).toContain('// Shadow constructor logic')
		})

		it('should handle shadow with modifiers and events', () => {
			const shadowBody = `
				event ValueUpdated(uint256 newValue);

				modifier onlyShadow() {
					require(msg.sender != address(0), "Invalid sender");
					_;
				}

				function updateValue(uint256 value) public onlyShadow {
					emit ValueUpdated(value);
				}
			`
			const result = createShadowContract(shadowBody, '/contracts/Contract.sol', 'Contract')

			const code = Object.values(result)[0]
			expect(code).toContain('event ValueUpdated')
			expect(code).toContain('modifier onlyShadow()')
			expect(code).toContain('function updateValue')
		})
	})
})
