import { readFileSync } from 'fs'
import path from 'path'
import { bundler } from '@evmts/bundler'
import { loadConfig } from '@evmts/config'
import type { Node } from 'solidity-ast/node'
import { SolcInput } from 'solidity-ast/solc'
import { findAll, srcDecoder } from 'solidity-ast/utils'
import typescript from 'typescript/lib/tsserverlibrary'
import {
	getScriptKindDecorator,
	getScriptSnapshotDecorator,
	resolveModuleNameLiteralsDecorator,
} from './decorators'
import { createLogger, decorate } from './factories'
import { isSolidity } from './utils'

function resolveAbsolutePath(basePath: string, relativePath: string): string {
	return path.resolve(path.dirname(basePath), relativePath)
}

function findImportPathForSymbol(
	sourceFile: typescript.SourceFile,
	symbolName: string,
	ts: typeof typescript,
): string | null {
	for (const statement of sourceFile.statements) {
		if (ts.isImportDeclaration(statement)) {
			const importClause = statement.importClause
			if (importClause?.namedBindings) {
				const bindings = importClause.namedBindings
				if (ts.isNamedImports(bindings)) {
					for (const element of bindings.elements) {
						if (element.name.getText() === symbolName) {
							// Found the import statement for the symbol.
							const moduleSpecifier = statement.moduleSpecifier
							if (ts.isStringLiteral(moduleSpecifier)) {
								return resolveAbsolutePath(
									sourceFile.fileName,
									moduleSpecifier.text,
								)
							}
						}
					}
				}
			}
		}
	}
	return null
}

function findNode(
	rootNode: typescript.Node,
	position: number,
): typescript.Node | null {
	console.log(
		'finding node',
		rootNode.getStart(),
		rootNode.getEnd(),
		rootNode.getSourceFile(),
		position,
	)
	let foundNode: typescript.Node | null = null

	function visit(node: typescript.Node) {
		console.log('visiting node', node.getStart(), node.getEnd())
		if (position >= node.getStart() && position <= node.getEnd()) {
			foundNode = node
			node.forEachChild(visit)
		}
	}

	rootNode.forEachChild(visit)
	return foundNode
}
/**
 * [Typescript plugin factory](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)
 * @example
 * ```json
 * {
 *   "plugins": [{ "name": "evmts-ts-plugin"}]
 * }
 * @see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation
 */
export const tsPlugin: typescript.server.PluginModuleFactory = (modules) => {
	return {
		create: (createInfo) => {
			const logger = createLogger(createInfo)
			const config = loadConfig(
				createInfo.project.getCurrentDirectory(),
				logger,
			)
			const service = modules.typescript.createLanguageService(
				decorate(
					getScriptKindDecorator,
					resolveModuleNameLiteralsDecorator,
					getScriptSnapshotDecorator,
				)(createInfo, modules.typescript, logger, config),
			)

			// TODO move me to a decorator
			// TODO this is hack
			service.getDefinitionAtPosition = (fileName, position) => {
				logger.info('getting definition at position')
				logger.info(fileName)
				logger.info(String(position))

				function findContractDefinitionFileName(
					node: typescript.Node,
					languageService: typescript.LanguageService,
					fileName: string,
				): string | null {
					let current = node

					while (current) {
						if (modules.typescript.isPropertyAccessExpression(current)) {
							console.log('found property access expression')
							const parent = current.expression
							if (modules.typescript.isCallExpression(parent)) {
								console.log('found call expression')
								const grandParent = parent.expression
								if (
									modules.typescript.isPropertyAccessExpression(grandParent)
								) {
									console.log('checking is evmts', grandParent.name.getText())
									if (
										['read', 'write', 'events'].includes(
											grandParent.name.getText(),
										)
									) {
										console.log('found an evmts contract')
										const contractNode = grandParent.expression
										const contractDefinition =
											languageService.getDefinitionAtPosition(
												fileName,
												contractNode.getStart(),
											)
										console.log(
											'found definition',
											JSON.stringify(contractDefinition),
										)
										// TODO grab the absolute path to the .sol file if it exists
										// currently we found the symbol e.g. MyContract in `import { MyContract } from './MyContract.sol'`
										// we need to now
										// 1. find the import statement	to grab the filepath from it
										// 2. turn it into an absolute path
										// 3. return the aboslute path
										if (contractDefinition && contractDefinition.length > 0) {
											const sourceFile = languageService
												.getProgram()
												?.getSourceFile(contractDefinition[0].fileName)
											if (sourceFile) {
												const importPath = findImportPathForSymbol(
													sourceFile,
													contractNode.getText(),
													modules.typescript,
												)
												return importPath
											}
										}
									}
								}
							}
						}
						current = current.parent
					}

					return null
				}

				const definition = createInfo.languageService.getDefinitionAtPosition(
					fileName,
					position,
				)
				const sourceFile = createInfo.languageService
					.getProgram()
					?.getSourceFile(fileName)
				const node = sourceFile && findNode(sourceFile, position)
				logger.info('@evmts/ts-plugin: is node' + String(Boolean(node)))
				const positionType =
					node &&
					createInfo.languageService
						.getProgram()
						?.getTypeChecker()
						.getTypeAtLocation(node)
				const evmtsContractPath =
					node &&
					findContractDefinitionFileName(
						node,
						createInfo.languageService,
						fileName,
					)
				if (!evmtsContractPath) {
					logger.info('no evmts contract path')
					return definition
				}
				const plugin = bundler(config, logger as any)
				const includedAst = true
				const { asts, solcInput } = plugin.resolveDtsSync(
					evmtsContractPath,
					process.cwd(),
					includedAst,
				)
				console.log('wtf is happening?', asts)
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
					for (const functionDef of findAll('FunctionDefinition', ast)) {
						console.log('getting def node', functionDef.name, node?.getText())
						if (functionDef.name === node?.getText()) {
							definitions.push({
								node: functionDef,
								fileName,
							})
						}
					}
					for (const functionDef of findAll('EventDefinition', ast)) {
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
						`@evmts/ts-plugin: unable to find efinitions ${evmtsContractPath}`,
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
							modules.typescript,
						),
					),
					...(definition ?? []),
				]
			}

			service.getDefinitionAndBoundSpan = (fileName, position) => {
				const definitions = service.getDefinitionAtPosition(fileName, position)
				if (!definitions) {
					return createInfo.languageService.getDefinitionAndBoundSpan(
						fileName,
						position,
					)
				}
				if (
					!definitions.some((definition) =>
						definition.fileName.endsWith('.sol'),
					)
				) {
					return createInfo.languageService.getDefinitionAndBoundSpan(
						fileName,
						position,
					)
				}
				// Logic to determine the appropriate text span for highlighting.
				const sourceFile = createInfo.languageService
					.getProgram()
					?.getSourceFile(fileName)
				const node = sourceFile && findNode(sourceFile, position)
				const textSpan = node
					? modules.typescript.createTextSpanFromBounds(
							node.getStart(),
							node.getEnd(),
					  )
					: undefined

				return {
					definitions,
					textSpan: textSpan ?? modules.typescript.createTextSpan(0, 0), // Fallback to a zero-length span
				}
			}

			return service
		},
		getExternalFiles: (project) => {
			return project.getFileNames().filter(isSolidity)
		},
	}
}

function convertSolcAstToTsDefinitionInfo(
	astNode: Node,
	fileName: string,
	containerName: string,
	solcInput: SolcInput,
	ts: typeof typescript,
): typescript.DefinitionInfo {
	// Parse the 'src' field into start position, length, and source index
	console.log('src numbers', astNode.src)
	const [start, length] = astNode.src.split(':').map(Number)

	// Determine the 'kind' and 'name' based on the AST node type and its properties
	let kind = ts.ScriptElementKind.unknown
	let name = ''
	if (astNode.nodeType === 'VariableDeclaration') {
		kind = ts.ScriptElementKind.variableElement
		name = astNode.name
	} else if (astNode.nodeType === 'FunctionDefinition') {
		kind = ts.ScriptElementKind.functionElement
		name = astNode.name
	}
	// note the compiled contracts have different source than the real contracts
	// so we must account for this
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
