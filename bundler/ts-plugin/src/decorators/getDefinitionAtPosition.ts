import { Logger } from '../factories/logger.js'
import { findNode } from '../utils/index.js'
import {
	convertSolcAstToTsDefinitionInfo,
	findContractDefinitionFileNameFromEvmtsNode,
} from '../utils/index.js'
import { Cache, FileAccessObject, bundler } from '@evmts/base'
import { ResolvedCompilerConfig } from '@evmts/config'
import { Node } from 'solidity-ast/node.js'
import { findAll } from 'solidity-ast/utils.js'
import typescript from 'typescript/lib/tsserverlibrary.js'

// TODO make me to a normal decorator
// is a woneoff decorator becuase this decorates the language service not the Host
// We will want to generalize the decorator before moving this elsewhere
/**
 * Decorate `LangaugeServerHost.getScriptKind` to return TS type for `.sol` files
 * This lets the ts-server expect `.sol` files to resolve to `.d.ts` files in `resolveModuleNameLiterals`
 */
export const getDefinitionServiceDecorator = (
	service: typescript.LanguageService,
	config: ResolvedCompilerConfig,
	logger: Logger,
	ts: typeof typescript,
	fao: FileAccessObject,
	solcCache?: Cache,
): typescript.LanguageService => {
	const getDefinitionAtPosition: typeof service.getDefinitionAtPosition = (
		fileName,
		position,
	) => {
		const definition = service.getDefinitionAtPosition(fileName, position)
		const sourceFile = service.getProgram()?.getSourceFile(fileName)
		const node = sourceFile && findNode(sourceFile, position)
		const evmtsContractPath =
			node &&
			findContractDefinitionFileNameFromEvmtsNode(node, service, fileName, ts)
		if (!evmtsContractPath) {
			return definition
		}
		const plugin = bundler(config, logger as any, fao, solcCache)
		const includedAst = true
		const { asts, solcInput } = plugin.resolveDtsSync(
			evmtsContractPath,
			process.cwd(),
			includedAst,
			false,
		)
		if (!asts) {
			logger.error(
				`@evmts/ts-plugin: getDefinitionAtPositionDecorator was unable to resolve asts for ${evmtsContractPath}`,
			)
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
			logger.error(
				`@evmts/ts-plugin: unable to find definitions ${evmtsContractPath}`,
			)
			return definition
		}
		const contractName =
			evmtsContractPath.split('/').pop()?.split('.')[0] ?? 'EvmtsContract'
		return [
			...definitions.map(({ fileName, node }) =>
				convertSolcAstToTsDefinitionInfo(
					node,
					fileName,
					contractName,
					solcInput,
					ts,
				),
			),
			...(definition ?? []),
		]
	}

	const getDefinitionAndBoundSpan: typeof service.getDefinitionAndBoundSpan = (
		fileName,
		position,
	) => {
		const definitions = getDefinitionAtPosition(fileName, position)
		if (!definitions) {
			return service.getDefinitionAndBoundSpan(fileName, position)
		}
		if (
			!definitions.some((definition) => definition.fileName.endsWith('.sol'))
		) {
			return service.getDefinitionAndBoundSpan(fileName, position)
		}
		// Logic to determine the appropriate text span for highlighting.
		const sourceFile = service.getProgram()?.getSourceFile(fileName)
		const node = sourceFile && findNode(sourceFile, position)
		const textSpan = node
			? ts.createTextSpanFromBounds(node.getStart(), node.getEnd())
			: undefined

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
