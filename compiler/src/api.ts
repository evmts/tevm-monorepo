// @ts-nocheck
// import { createCompiler } from '@tevm/compiler'
import { FunctionVisibility, StateVariableVisibility } from 'solc-typed-ast'
import { createCompiler } from './createCompiler.js'

/* ------------------------------------ — ----------------------------------- */

// Any option here can be set when creating the compiler and overriden on each method call
const compiler = createCompiler({
	loggingLevel: 'debug',
	optimizer: { enabled: true, runs: 200 },
})

await compiler.loadSolc('0.8.30')

/* ------------------------------- Basic usage ------------------------------ */
// Compile source code directly
const { compilationResult, errors, solcInput, solcOutput } = compiler.compileSource(
	`
    contract Counter { uint256 public count; function increment() public { count++; } }
  `,
	{
		compilationOutput: ['abi', 'ast', 'evm.bytecode', 'evm.deployedBytecode', 'storageLayout'], // these are the default outputs if not specified
	},
)
// Compile files
const filesResult = await compiler.compileFiles(['./contracts/Counter.sol'])
// or
const filesResultSync = compiler.compileFilesSync(['./contracts/Counter.sol'])

/* ----------------------------- Fetch contracts ---------------------------- */
// API is still TBD but likely it would return the same output format as compileSource or compileFiles
const contract = await compiler.fetchVerifiedSource('0x1234567890123456789012345678901234567890', {
	chainId: 1,
	// ... api keys and explorer links for Etherscan, Blockscout; default provider is Sourcify
})

/* --------------------------- Shadow compilation --------------------------- */
// See a few ways here to manipulate that contract using the compiler
// You could just use a fetched contract as source here
const counterContract = `
    contract Counter { uint256 private count; function increment() internal { count++; } }
  `
// 1. Quick easy way to access internal variables and functions (this works with compileFiles as well)
const result = compiler.compileSource(counterContract, {
	exposeInternalFunctions: true,
	exposeInternalVariables: true,
})
// ... will be compiled as `contract Counter { uint256 public count; function increment() public { count++; } }`

// 2. You can do the exact same thing as above (and much more!) by manipulating the AST yourself
const { solcOutput } = compiler.compileSource(counterContract, {
	compilationOutput: ['ast'],
})
// Grab convenient AST objects for each source file (a SourceUnit is one file)
// API is here: https://github.com/ConsenSysDiligence/solc-typed-ast/blob/56dd8fe42f6f0e8b67e1e76ecc8589ce65bdd32d/src/ast/implementation/meta/source_unit.ts#L26)
const sourceUnits = compiler.solcSourcesToAstNodes(solcOutput.sources)
const counterSourceUnit = sourceUnits[0] // we only have one source here
const counterContractNode = counterSourceUnit?.vContracts.find((contract) => contract.name === 'Counter')
counterContractNode?.vFunctions.forEach((functionNode) => {
	functionNode.visibility = FunctionVisibility.Public
})
counterContractNode?.vStateVariables.forEach((variableNode) => {
	variableNode.visibility = StateVariableVisibility.Public
})
// check the ContractDefinition API, you can do so much and even insert some AST directly into the contract
// https://github.com/ConsenSysDiligence/solc-typed-ast/blob/56dd8fe42f6f0e8b67e1e76ecc8589ce65bdd32d/src/ast/implementation/declaration/contract_definition.ts#L25
// If you would like to display the instrumented code in Solidity
const { sources: instrumentedSources } = compiler.extractContractsFromAstNodes(sourceUnits)
const instrumentedCounterContract = Object.values(instrumentedSources)[0]

// 3. Or just use shadow functions instead
const result = compiler.compileSourceWithShadow(
	counterContract,
	`
    function getCount() public view returns (uint256) {
      return count;
    }
    function incrementCount() public {
      increment();
    }
  `,
	{
		injectIntoContractName: 'Counter', // this is unnecessary in this case as there is only one contract to inject into
	},
)

// 4. You can also just override the increment function to make it public (or completely change its implementation)
const result = compiler.compileSourceWithShadow(
	counterContract,
	`
    function increment() public override {
      count++;
    }
  `,
	{
		shadowMergeStrategy: 'replace', // note that when using this strategy you need to mark the shadow function as override
	},
)

/* ------------------------------ Shadow usage ------------------------------ */
// This part of the API I've not done yet but usage would likely be something like:
const contractAddress = '0x1234567890123456789012345678901234567890'
const { sources } = await compiler.fetchVerifiedSource(contractAddress, { chainId: 1 })
const { contract } = compiler.compileSourcesWithShadow(sources, `shadow methods`)
const ShadowContract = contract.withAddress(contractAddress)

const client = createMemoryClient({ fork: { transport: http() } })
const res = await client.tevmContract(ShadowContract.read.someShadowFunction())
