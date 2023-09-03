import { Logger } from '../factories'
import { bundler } from '@evmts/bundler'
import { ResolvedConfig } from '@evmts/config'
import { readFileSync } from 'fs'
import { Node } from 'solidity-ast/node'
import { SolcInput } from 'solidity-ast/solc'
import { findAll } from 'solidity-ast/utils'
import typescript from 'typescript/lib/tsserverlibrary'

function findNode(
	rootNode: typescript.Node,
	position: number,
): typescript.Node | null {
	let foundNode: typescript.Node | null = null

	function visit(node: typescript.Node) {
		if (position >= node.getStart() && position <= node.getEnd()) {
			foundNode = node
			node.forEachChild(visit)
		}
	}

	rootNode.forEachChild(visit)
	return foundNode
}
function convertSolcAstToTsDefinitionInfo(
	astNode: Node,
	fileName: string,
	containerName: string,
	solcInput: SolcInput,
	ts: typeof typescript,
): typescript.DefinitionInfo {
	const [start, length] = astNode.src.split(':').map(Number)

	let kind = ts.ScriptElementKind.unknown
	let name = ''
	if (astNode.nodeType === 'VariableDeclaration') {
		kind = ts.ScriptElementKind.variableElement
		name = astNode.name
	} else if (astNode.nodeType === 'FunctionDefinition') {
		kind = ts.ScriptElementKind.functionElement
		name = astNode.name
	}

	const inputLength = solcInput.sources[fileName].content?.length as number
	const actualLength = readFileSync(fileName, 'utf8').length
	const offset = inputLength - actualLength

	// Create and return the TypeScript DefinitionInfo object
	return {
		fileName,
		textSpan: ts.createTextSpan(start - offset, length),
		kind,
		name,
		containerKind: ts.ScriptElementKind.classElement,
		containerName,
	}
}

function findContractDefinitionFileName(
	node: typescript.Node,
	languageService: typescript.LanguageService,
	fileName: string,
	ts: typeof typescript,
): string | null {
	let current = node

	while (current) {
		if (!ts.isPropertyAccessExpression(current)) {
			current = current.parent
			continue
		}
		const parent = current.expression
		console.log('found parent')
		if (!ts.isCallExpression(parent)) {
			current = current.parent
			continue
		}

		const grandParent = parent.expression
		console.log('found grandparent')
		if (!ts.isPropertyAccessExpression(grandParent)) {
			current = current.parent
			continue
		}

		console.log('checking read write events...')
		if (!['read', 'write', 'events'].includes(grandParent.name.getText())) {
			current = current.parent
			continue
		}
		const contractNode = grandParent.expression
		const contractDefinition = languageService.getDefinitionAtPosition(
			fileName,
			contractNode.getStart(),
		)
		// TODO grab the absolute path to the .sol file if it exists
		// currently we found the symbol e.g. MyContract in `import { MyContract } from './MyContract.sol'`
		// we need to now
		// 1. find the import statement	to grab the filepath from it
		// 2. turn it into an absolute path
		// 3. return the aboslute path
		if (!contractDefinition || contractDefinition.length === 0) {
			current = current.parent
			continue
		}

		console.log('found source file', contractDefinition[0].fileName)
		return contractDefinition[0].fileName
	}

	return null
}

// TODO make me to a normal decorator
// is a woneoff decorator becuase this decorates the language service not the Host
// We will want to generalize the decorator before moving this elsewhere
/**
 * Decorate `LangaugeServerHost.getScriptKind` to return TS type for `.sol` files
 * This lets the ts-server expect `.sol` files to resolve to `.d.ts` files in `resolveModuleNameLiterals`
 */
export const getDefinitionServiceDecorator = (
	service: typescript.LanguageService,
	config: ResolvedConfig,
	logger: Logger,
	ts: typeof typescript,
): typescript.LanguageService => {
	const getDefinitionAtPosition: typeof service.getDefinitionAtPosition = (
		fileName,
		position,
	) => {
		const definition = service.getDefinitionAtPosition(fileName, position)
		const sourceFile = service.getProgram()?.getSourceFile(fileName)
		const node = sourceFile && findNode(sourceFile, position)
		console.log('found node', node)
		const evmtsContractPath =
			node && findContractDefinitionFileName(node, service, fileName, ts)
		console.log('contract path', evmtsContractPath)
		if (!evmtsContractPath) {
			return definition
		}
		const plugin = bundler(config, logger as any)
		const includedAst = true
		const { asts, solcInput } = plugin.resolveDtsSync(
			evmtsContractPath,
			process.cwd(),
			includedAst,
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
