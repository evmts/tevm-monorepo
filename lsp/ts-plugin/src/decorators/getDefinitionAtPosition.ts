import { type FileAccessObject, bundler } from '@tevm/base-bundler'
import type { Cache } from '@tevm/bundler-cache'
import type { ResolvedCompilerConfig } from '@tevm/config'
// @ts-expect-error
import * as solc from 'solc'
import type { Node } from 'solidity-ast/node.js'
import type { SolcInput } from 'solidity-ast/solc.js'
import { findAll } from 'solidity-ast/utils.js'
import type typescript from 'typescript/lib/tsserverlibrary.js'
import type { Logger } from '../factories/logger.js'
import { findNode, isSolidity } from '../utils/index.js'
import { convertSolcAstToTsDefinitionInfo, findContractDefinitionFileNameFromTevmNode } from '../utils/index.js'

/**
 * Decorates the TypeScript LanguageService to provide "Go to Definition" support for Solidity contracts.
 *
 * This decorator extends the standard TypeScript language service by:
 * 1. Detecting when a user attempts to navigate to a definition in a Solidity contract
 * 2. Compiling the Solidity source using solc
 * 3. Parsing the AST to find matching function/event definitions
 * 4. Converting Solidity AST nodes to TypeScript definition information
 * 5. Returning these definitions alongside any TypeScript definitions
 *
 * This enables IDE features like "Go to Definition" to work seamlessly between TypeScript and Solidity.
 *
 * Note: Unlike other decorators in this codebase, this decorates the language service directly,
 * not the LanguageServiceHost. Future refactoring may generalize this approach.
 *
 * @param service - The TypeScript language service to decorate
 * @param config - Compiler configuration for Solidity files
 * @param logger - Logger instance for debugging information
 * @param ts - TypeScript library instance
 * @param fao - File access object for reading files
 * @param solcCache - Cache instance for solc compilations
 * @returns Decorated TypeScript language service with Solidity definition support
 */
export const getDefinitionServiceDecorator = (
	service: typescript.LanguageService,
	config: ResolvedCompilerConfig,
	logger: Logger,
	ts: typeof typescript,
	fao: FileAccessObject,
	solcCache: Cache,
): typescript.LanguageService => {
	const getDefinitionAtPosition: typeof service.getDefinitionAtPosition = (filePath, position) => {
		const { fileName, queryParams } = (() => {
			if (isSolidity(filePath.split('?')[0])) {
				const [fileName, queryString] = filePath.split('?')
				return { fileName, queryParams: new URLSearchParams(queryString ?? '') }
			}
			return { fileName: filePath, queryParams: new URLSearchParams('') }
		})()
		const definition = service.getDefinitionAtPosition(fileName, position)
		const sourceFile = service.getProgram()?.getSourceFile(fileName)
		const node = sourceFile && findNode(sourceFile, position)
		const ContractPath = node && findContractDefinitionFileNameFromTevmNode(node, service, fileName, ts)
		if (!ContractPath) {
			return definition
		}
		const plugin = bundler(config, logger as any, fao, solc, solcCache)
		const includeAst = queryParams.get('includeAst') === null ? true : queryParams.get('includeAst') === 'true'
		const includeBytecode = queryParams.get('includeBytecode') === null ? true : queryParams.get('includeBytecode') === 'true'
		const { asts, solcInput } = plugin.resolveDtsSync(ContractPath, process.cwd(), includeAst, includeBytecode)
		if (!asts) {
			logger.error(`@tevm/ts-plugin: getDefinitionAtPositionDecorator was unable to resolve asts for ${ContractPath}`)
			return definition
		}

		const definitions: Array<{
			node: Node
			fileName: string
		}> = []
		for (const [fileName, ast] of Object.entries(asts)) {
			for (const functionDef of findAll('EventDefinition', ast)) {
				if (functionDef.name === node?.getText()) {
					definitions.push({
						node: functionDef,
						fileName,
					})
				}
			}
			for (const functionDef of findAll('FunctionDefinition', ast)) {
				if (functionDef.name === node?.getText()) {
					definitions.push({
						node: functionDef,
						fileName,
					})
				}
			}
		}
		if (!definitions.length) {
			logger.error(`@tevm/ts-plugin: unable to find definitions ${ContractPath}`)
			return definition
		}
		const contractName = ContractPath.split('/').pop()?.split('.')[0] ?? 'Contract'
		// Skip definitions that would require solcInput if it is not available
		if (!solcInput) {
			logger.error(`@tevm/ts-plugin: solcInput is undefined for ${ContractPath}`)
			return definition
		}
		return [
			...definitions.map(({ fileName, node }) =>
				convertSolcAstToTsDefinitionInfo(node, fileName, contractName, { sources: solcInput.sources } as SolcInput, ts),
			),
			...(definition ?? []),
		]
	}

	const getDefinitionAndBoundSpan: typeof service.getDefinitionAndBoundSpan = (fileName, position) => {
		const definitions = getDefinitionAtPosition(fileName, position)
		if (!definitions) {
			return service.getDefinitionAndBoundSpan(fileName, position)
		}
		if (!definitions.some((definition) => definition.fileName.endsWith('.sol'))) {
			return service.getDefinitionAndBoundSpan(fileName, position)
		}
		// Logic to determine the appropriate text span for highlighting.
		const sourceFile = service.getProgram()?.getSourceFile(fileName)
		const node = sourceFile && findNode(sourceFile, position)
		const textSpan = node ? ts.createTextSpanFromBounds(node.getStart(), node.getEnd()) : undefined

		return {
			definitions,
			textSpan: textSpan ?? ts.createTextSpan(0, 0), // Fallback to a zero-length span
		}
	}

	return new Proxy(service, {
		get(target, key) {
			if (key === 'getDefinitionAtPosition') {
				return getDefinitionAtPosition
			}
			if (key === 'getDefinitionAndBoundSpan') {
				return getDefinitionAndBoundSpan
			}
			return target[key as keyof typeof target]
		},
	})
}
