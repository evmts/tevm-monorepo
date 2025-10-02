/**
 * Result of converting AST to source code
 * - input: AST (raw from solc or universal from solc-typed-ast)
 * - output: map of file paths to regenerated Solidity source code
 *
 * @example
 * {
 *   "contracts/Main.sol": "import './Lib.sol';\ncontract Main {...}",
 *   "contracts/Lib.sol": "library Lib {...}"
 * }
 */
export interface ExtractContractsFromAstResult {
	[sourcePath: string]: string
}
