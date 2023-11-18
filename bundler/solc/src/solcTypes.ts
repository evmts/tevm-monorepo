// generated from docs at https://docs.soliditylang.org/en/v0.8.20/using-the-compiler.html
import type { Abi } from 'abitype'
// @ts-ignore
import solc from 'solc'

type HexNumber = `0x${string}`

type SolcAst = any

// Required: Source code language. Currently supported are "Solidity", "Yul" and "SolidityAST" (experimental).
export type SolcLanguage = 'Solidity' | 'Yul' | 'SolidityAST'

// The keys here are the "global" names of the source files,
// imports can use other files via remappings (see below).
export type SolcInputSource = {
	// Optional: keccak256 hash of the source file
	// It is used to verify the retrieved content if imported via URLs.
	keccak256?: HexNumber
	// If language is set to "SolidityAST", an AST needs to be supplied under the "ast" key.
	// Note that importing ASTs is experimental and in particular that:
	// - importing invalid ASTs can produce undefined results and
	// - no proper error reporting is available on invalid ASTs.
	// Furthermore, note that the AST import only consumes the fields of the AST as
	// produced by the compiler in "stopAfter": "parsing" mode and then re-performs
	// analysis, so any analysis-based annotations of the AST are ignored upon import.
	// formatted as the json ast requested with the ``ast`` output selection.
	ast?: SolcAst
} & (
	| {
			// Required (unless "content" is used, see below): URL(s) to the source file.
			// URL(s) should be imported in this order and the result checked against the
			// keccak256 hash (if available). If the hash doesn't match or none of the
			// URL(s) result in success, an error should be raised.
			// Using the commandline interface only filesystem paths are supported.
			// With the JavaScript interface the URL will be passed to the user-supplied
			// read callback, so any URL supported by the callback can be used.
			// @example
			// [
			//  "bzzr://56ab...",
			//  "ipfs://Qma...",
			//  "/tmp/path/to/file.sol"
			//  // If files are used, their directories should be added to the command line via
			//  // `--allow-paths <path>`.
			//]
			urls: string[]
	  }
	| {
			content: string
	  }
)

export type SolcRemapping = Array<`${string}=${string}`>

// Tuning options for the Yul optimizer.
export type SolcYulDetails = {
	// Improve allocation of stack slots for variables, can free up stack slots early.
	// Activated by default if the Yul optimizer is activated.
	stackAllocation?: boolean
	// Select optimization steps to be applied. It is also possible to modify both the
	// optimization sequence and the clean-up sequence. Instructions for each sequence
	// are separated with the ":" delimiter and the values are provided in the form of
	// optimization-sequence:clean-up-sequence. For more information see
	// "The Optimizer > Selecting Optimizations".
	// This field is optional, and if not provided, the default sequences for both
	// optimization and clean-up are used. If only one of the options is provivded
	// the other will not be run.
	// If only the delimiter ":" is provided then neither the optimization nor the clean-up
	// sequence will be run.
	// If set to an empty value, only the default clean-up sequence is used and
	// no optimization steps are applied.
	optimizerSteps: string
}

// Switch optimizer components on or off in detail.
// The "enabled" switch above provides two defaults which can be
// tweaked here. If "details" is given, "enabled" can be omitted.
export type SolcOptimizerDetails = {
	// The peephole optimizer is always on if no details are given,
	// use details to switch it off.
	peephole: boolean
	// The inliner is always on if no details are given,
	// use details to switch it off.
	inliner: boolean
	// The unused jumpdest remover is always on if no details are given,
	// use details to switch it off.
	jumpdestRemover: boolean
	// Sometimes re-orders literals in commutative operations.
	orderLiterals: boolean
	// Removes duplicate code blocks
	deduplicate: boolean
	// Common subexpression elimination, this is the most complicated step but
	// can also provide the largest gain.
	cse: boolean
	// Optimize representation of literal numbers and strings in code.
	constantOptimizer: boolean
	// The new Yul optimizer. Mostly operates on the code of ABI coder v2
	// and inline assembly.
	// It is activated together with the global optimizer setting
	// and can be deactivated here.
	// Before Solidity 0.6.0 it had to be activated through this switch.
	yul: boolean
	yulDetails: SolcYulDetails
}

// Optional: Optimizer settings
export type SolcOptimizer = {
	// Disabled by default.
	// NOTE: enabled=false still leaves some optimizations on. See comments below.
	// WARNING: Before version 0.8.6 omitting the 'enabled' key was not equivalent to setting
	// it to false and would actually disable all the optimizations.
	enabled?: boolean
	// Optimize for how many times you intend to run the code.
	// Lower values will optimize more for initial deployment cost, higher
	// values will optimize more for high-frequency usage.
	runs: number
	details: SolcOptimizerDetails
}

const fileLevelOption = '' as const

export type SolcOutputSelection = {
	[fileName: string]: {
		[fileLevelOption]?: Array<'ast'>
	} & {
		[contractName: Exclude<string, typeof fileLevelOption>]: Array<
			| 'abi'
			// TODO this option is only for fileLevelOptions, but it's not clear how to type that
			| 'ast'
			| 'devdoc'
			| 'evm.assembly'
			| 'evm.bytecode'
			| 'evm.bytecode.functionDebugData'
			| 'evm.bytecode.generatedSources'
			| 'evm.bytecode.linkReferences'
			| 'evm.bytecode.object'
			| 'evm.bytecode.opcodes'
			| 'evm.bytecode.sourceMap'
			| 'evm.deployedBytecode'
			| 'evm.deployedBytecode.immutableReferences'
			| 'evm.deployedBytecode.sourceMap'
			| 'evm.deployedBytecode.opcodes'
			| 'evm.deployedBytecode.object'
			| 'evm.gasEstimates'
			| 'evm.methodIdentifiers'
			| 'evm.legacyAssembly'
			| 'evm.methodIdentifiers'
			| 'evm.storageLayout'
			| 'ewasm.wasm'
			| 'ewasm.wast'
			| 'ir'
			| 'irOptimized'
			| 'metadata'
			| 'storageLayout'
			| 'userdoc'
			| '*'
		>
	}
}

// Chose which contracts should be analyzed as the deployed one.
export type SolcModelCheckerContracts = {
	[fileName: `${string}.sol`]: string[]
}

export type SolcModelChecker = {
	contracts: SolcModelCheckerContracts
	// Choose how division and modulo operations should be encoded.
	// When using `false` they are replaced by multiplication with slack
	// variables. This is the default.
	// Using `true` here is recommended if you are using the CHC engine
	// and not using Spacer as the Horn solver (using Eldarica, for example).
	// See the Formal Verification section for a more detailed explanation of this option.
	divModNoSlacks?: boolean
	// Choose which model checker engine to use: all (default), bmc, chc, none.
	engine?: 'all' | 'bmc' | 'chc' | 'none'
	// Choose whether external calls should be considered trusted in case the
	// code of the called function is available at compile-time.
	// For details see the SMTChecker section.
	extCalls: 'trusted' | 'untrusted'
	// Choose which types of invariants should be reported to the user: contract, reentrancy.
	invariants: Array<'contract' | 'reentrancy'>
	// Choose whether to output all proved targets. The default is `false`.
	showProved?: boolean
	// Choose whether to output all unproved targets. The default is `false`.
	showUnproved?: boolean
	// Choose whether to output all unsupported language features. The default is `false`.
	showUnsupported?: boolean
	// Choose which solvers should be used, if available.
	// See the Formal Verification section for the solvers description.
	solvers: Array<'cvc4' | 'smtlib2' | 'z3'>
	// Choose which targets should be checked: constantCondition,
	// underflow, overflow, divByZero, balance, assert, popEmptyArray, outOfBounds.
	// If the option is not given all targets are checked by default,
	// except underflow/overflow for Solidity >=0.8.7.
	// See the Formal Verification section for the targets description.
	targets?: Array<'underflow' | 'overflow' | 'assert'>
	// Timeout for each SMT query in milliseconds.
	// If this option is not given, the SMTChecker will use a deterministic
	// resource limit by default.
	// A given timeout of 0 means no resource/time restrictions for any query.
	timeout?: boolean
}

export type SolcDebugSettings = {
	// How to treat revert (and require) reason strings. Settings are
	// "default", "strip", "debug" and "verboseDebug".
	// "default" does not inject compiler-generated revert strings and keeps user-supplied ones.
	// "strip" removes all revert strings (if possible, i.e. if literals are used) keeping side-effects
	// "debug" injects strings for compiler-generated internal reverts, implemented for ABI encoders V1 and V2 for now.
	// "verboseDebug" even appends further information to user-supplied revert strings (not yet implemented)
	revertStrings?: 'default' | 'strip' | 'debug' | 'verboseDebug'
	// Optional: How much extra debug information to include in comments in the produced EVM
	// assembly and Yul code. Available components are:
	// - `location`: Annotations of the form `@src <index>:<start>:<end>` indicating the
	//    location of the corresponding element in the original Solidity file, where:
	//     - `<index>` is the file index matching the `@use-src` annotation,
	//     - `<start>` is the index of the first byte at that location,
	//     - `<end>` is the index of the first byte after that location.
	// - `snippet`: A single-line code snippet from the location indicated by `@src`.
	//     The snippet is quoted and follows the corresponding `@src` annotation.
	// - `*`: Wildcard value that can be used to request everything.
	debugInfo?: Array<'location' | 'snippet' | '*'>
}

export type SolcMetadataSettings = {
	// The CBOR metadata is appended at the end of the bytecode by default.
	// Setting this to false omits the metadata from the runtime and deploy time code.
	appendCBOR?: boolean
	// Use only literal content and not URLs (false by default)
	useLiteralContent?: boolean
	// Use the given hash method for the metadata hash that is appended to the bytecode.
	// The metadata hash can be removed from the bytecode via option "none".
	// The other options are "ipfs" and "bzzr1".
	// If the option is omitted, "ipfs" is used by default.
	bytecodeHash?: 'ipfs' | 'bzzr1' | 'none'
}

// Optional: A list of remappings to apply to the source code.
export type SolcSettings = {
	// Optional: Stop compilation after the given stage. Currently only "parsing" is valid here
	stopAfter?: 'parsing'
	// Optional: Sorted list of remappings
	remappings?: SolcRemapping
	optimizer?: SolcOptimizer
	// Version of the EVM to compile for.
	// Affects type checking and code generation. Can be homestead,
	// tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul, berlin, london or paris
	evmVersion?:
		| 'byzantium'
		| 'constantinople'
		| 'petersburg'
		| 'istanbul'
		| 'berlin'
		| 'london'
		| 'paris'
	// Optional: Change compilation pipeline to go through the Yul intermediate representation.
	// This is false by default.
	viaIR?: boolean
	// Optional: Debugging settings
	debug?: SolcDebugSettings
	// Metadata settings (optional)
	metadata?: SolcMetadataSettings
	// Addresses of the libraries. If not all libraries are given here,
	// it can result in unlinked objects whose output data is different.
	// The top level key is the the name of the source file where the library is used.
	// If remappings are used, this source file should match the global path
	// after remappings were applied.
	// If this key is an empty string, that refers to a global level.
	libraries?: Record<string, Record<string, string>>
	// The following can be used to select desired outputs based
	// on file and contract names.
	// If this field is omitted, then the compiler loads and does type checking,
	// but will not generate any outputs apart from errors.
	// The first level key is the file name and the second level key is the contract name.
	// An empty contract name is used for outputs that are not tied to a contract
	// but to the whole source file like the AST.
	// A star as contract name refers to all contracts in the file.
	// Similarly, a star as a file name matches all files.
	// To select all outputs the compiler can possibly generate, use
	// "outputSelection: { "*": { "*": [ "*" ], "": [ "*" ] } }"
	// but note that this might slow down the compilation process needlessly.
	//
	// The available output types are as follows:
	//
	// File level (needs empty string as contract name):
	//   ast - AST of all source files
	//
	// Contract level (needs the contract name or "*"):
	//   abi - ABI
	//   devdoc - Developer documentation (natspec)
	//   userdoc - User documentation (natspec)
	//   metadata - Metadata
	//   ir - Yul intermediate representation of the code before optimization
	//   irOptimized - Intermediate representation after optimization
	//   storageLayout - Slots, offsets and types of the contract's state variables.
	//   evm.assembly - New assembly format
	//   evm.legacyAssembly - Old-style assembly format in JSON
	//   evm.bytecode.functionDebugData - Debugging information at function level
	//   evm.bytecode.object - Bytecode object
	//   evm.bytecode.opcodes - Opcodes list
	//   evm.bytecode.sourceMap - Source mapping (useful for debugging)
	//   evm.bytecode.linkReferences - Link references (if unlinked object)
	//   evm.bytecode.generatedSources - Sources generated by the compiler
	//   evm.deployedBytecode* - Deployed bytecode (has all the options that evm.bytecode has)
	//   evm.deployedBytecode.immutableReferences - Map from AST ids to bytecode ranges that reference immutables
	//   evm.methodIdentifiers - The list of function hashes
	//   evm.gasEstimates - Function gas estimates
	//   ewasm.wast - Ewasm in WebAssembly S-expressions format
	//   ewasm.wasm - Ewasm in WebAssembly binary format
	//
	// Note that using a using `evm`, `evm.bytecode`, `ewasm`, etc. will select every
	// target part of that output. Additionally, `*` can be used as a wildcard to request everything.
	//
	outputSelection: SolcOutputSelection
	// The modelChecker object is experimental and subject to changes.
	modelChecker?: SolcModelChecker
}

export type SolcInputSourcesDestructibleSettings = {
	// Optional: keccak256 hash of the source file
	keccak256?: HexNumber
	// Required (unless "urls" is used): literal contents of the source file
	content: string
}

export type SolcInputSources = {
	[globalName: string]: SolcInputSource & {
		destructible?: SolcInputSourcesDestructibleSettings
	}
}

export type SolcInputDescription = {
	language: SolcLanguage
	// Required: A dictionary of source files. The key of each entry is either a file name or a global identifier followed by ":" and a file name.
	sources: SolcInputSources
	settings?: SolcSettings
}

export type SolcOutput = {
	// Optional: not present if no errors/warnings/infos were encountered
	errors?: SolcErrorEntry[]

	// This contains the file-level outputs.
	// It can be limited/filtered by the outputSelection settings.
	sources: {
		[sourceFile: string]: SolcSourceEntry
	}

	// This contains the contract-level outputs.
	// It can be limited/filtered by the outputSelection settings.
	contracts: {
		// rome-ignore lint/suspicious/noRedeclare: not sure why this is triggering
		[sourceFile: string]: {
			[contractName: string]: SolcContractOutput
		}
	}
}

export type SolcErrorEntry = {
	// Optional: Location within the source file.
	sourceLocation?: SolcSourceLocation

	// Optional: Further locations (e.g. places of conflicting declarations)
	secondarySourceLocations?: SolcSecondarySourceLocation[]

	// Mandatory: Error type, such as "TypeError", "InternalCompilerError", "Exception", etc.
	type: string

	// Mandatory: Component where the error originated, such as "general", "ewasm", etc.
	component: string

	// Mandatory ("error", "warning" or "info", but please note that this may be extended in the future)
	severity: 'error' | 'warning' | 'info'

	// Optional: unique code for the cause of the error
	errorCode?: string

	// Mandatory
	message: string

	// Optional: the message formatted with source location
	formattedMessage?: string
}

export type SolcSourceLocation = {
	file: string
	start: number
	end: number
}

export type SolcSecondarySourceLocation = SolcSourceLocation & {
	message: string
}

export type SolcSourceEntry = {
	// Identifier of the source (used in source maps)
	id: number

	// The AST object
	ast: any
}

export type SolcContractOutput = {
	// The Ethereum Contract ABI. If empty, it is represented as an empty array.
	abi: Abi

	// See the Metadata Output documentation (serialised JSON string)
	metadata: string

	// User documentation (natspec)
	userdoc: {
		methods?: Record<string, { notice: string }>
		kind: 'user'
		notice?: string
		version: number
	}

	// Developer documentation (natspec)
	devdoc: any

	// Intermediate representation (string)
	ir: string

	// See the Storage Layout documentation.
	storageLayout: {
		storage: any[]
		types: any
	}

	// EVM-related outputs
	evm: SolcEVMOutput

	// Ewasm related outputs
	ewasm: SolcEwasmOutput
}

export type SolcEVMOutput = {
	// Assembly (string)
	assembly: string

	// Old-style assembly (object)
	legacyAssembly: any

	// Bytecode and related details.
	bytecode: SolcBytecodeOutput

	// Bytecode and related details.
	deployedBytecode: SolcBytecodeOutput

	// The list of function hashes
	methodIdentifiers: {
		[functionSignature: string]: string
	}

	// Function gas estimates
	gasEstimates: SolcGasEstimates
}

export type SolcBytecodeOutput = {
	// Debugging data at the level of functions.
	functionDebugData: {
		[functionName: string]: SolcFunctionDebugData
	}
	// The bytecode as a hex string.
	object: string

	// Opcodes list (string)
	opcodes: string

	// The source mapping as a string. See the source mapping definition.
	sourceMap: string

	// Array of sources generated by the compiler. Currently only
	// contains a single Yul file.
	generatedSources: SolcGeneratedSource[]

	// If given, this is an unlinked object.
	linkReferences: {
		[fileName: string]: {
			[libraryName: string]: Array<{ start: number; length: number }>
		}
	}
} & Omit<SolcDeployedBytecodeOutput, 'immutableReferences'>

export type SolcDeployedBytecodeOutput = {
	// ... Same as BytecodeOutput above ...
	immutableReferences: {
		[astID: string]: Array<{ start: number; length: number }>
	}
}

export type SolcFunctionDebugData = {
	entryPoint?: number
	id?: number | null
	parameterSlots?: number
	returnSlots?: number
}

export type SolcGeneratedSource = {
	// Yul AST
	ast: any

	// Source file in its text form (may contain comments)
	contents: string

	// Source file ID, used for source references, same "namespace" as the Solidity source files
	id: number
	language: string
	name: string
}

export type SolcGasEstimates = {
	creation: {
		codeDepositCost: string
		executionCost: string
		totalCost: string
	}
	external: {
		[functionSignature: string]: string
	}
	internal: {
		// rome-ignore lint/suspicious/noRedeclare: not sure why this is triggering
		[functionSignature: string]: string
	}
}

export type SolcEwasmOutput = {
	// S-expressions format
	wast: string
	// Binary format (hex string)
	wasm: string
}
