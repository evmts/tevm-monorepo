import { bundler } from '@evmts/bundler'
import { loadConfig } from '@evmts/config'
import type { Node } from 'solidity-ast/node'
import { findAll, srcDecoder } from 'solidity-ast/utils'
import typescript from 'typescript/lib/tsserverlibrary'
import {
	getScriptKindDecorator,
	getScriptSnapshotDecorator,
	resolveModuleNameLiteralsDecorator,
} from './decorators'
import { createLogger, decorate } from './factories'
import { isSolidity } from './utils'

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
				function getEvmtsContractFilePath(
					node: typescript.Node,
				): string | undefined {
					// If we find a CallExpression, e.g., `read().balanceOf`, check it
					if (typescript.isCallExpression(node)) {
						const expression = node.expression

						// If the expression is a PropertyAccessExpression, e.g., `read().balanceOf`
						if (typescript.isPropertyAccessExpression(expression)) {
							const object = expression.expression // `read()`
							const property = expression.name // `balanceOf`

							// If the object is another CallExpression, e.g., `read()`
							if (typescript.isCallExpression(object)) {
								const objectExpression = object.expression // `read`

								if (typescript.isPropertyAccessExpression(objectExpression)) {
									const evmts = objectExpression.expression // `EvmtsContract`
									const contractDefinition =
										createInfo.languageService.getDefinitionAtPosition(
											fileName,
											evmts.getStart(),
										)
									const definition = contractDefinition?.find((definition) => {
										definition.fileName.endsWith('.sol')
									})
									return definition?.fileName
								}
							}
						}
					}
					return undefined
				}

				function findNode(
					rootNode: typescript.Node,
					position: number,
				): typescript.Node | null {
					let foundNode: typescript.Node | null = null

					function visit(node: typescript.Node) {
						if (position >= node.getStart() && position <= node.getEnd()) {
							foundNode = node
							typescript.forEachChild(node, visit) // continue searching in this subtree
						}
					}

					typescript.forEachChild(rootNode, visit)
					return foundNode
				}
				const definition = createInfo.languageService.getDefinitionAtPosition(
					fileName,
					position,
				)
				const sourceFile = createInfo.languageService
					.getProgram()
					?.getSourceFile(fileName)
				const node = sourceFile && findNode(sourceFile, position)
				const positionType =
					node &&
					createInfo.languageService
						.getProgram()
						?.getTypeChecker()
						.getTypeAtLocation(node)
				const evmtsContractPath = node && getEvmtsContractFilePath(node)
				if (!evmtsContractPath) {
					return definition
				}
				const plugin = bundler(config, logger as any)
				const includedAst = true
				const { asts, solcInput, solcOutput } = plugin.resolveDtsSync(
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
				const decodeSrc = srcDecoder(solcInput, solcOutput)

				let defNode
				for (const functionDef of findAll(
					'FunctionDefinition',
					asts[evmtsContractPath],
				)) {
					if (functionDef.name === node?.getText()) {
						defNode = functionDef
					}
				}
				for (const functionDef of findAll(
					'EventDefinition',
					asts[evmtsContractPath],
				)) {
					if (functionDef.name === node?.getText()) {
						defNode = functionDef
					}
				}
				if (!defNode) {
					logger.error(
						`@evmts/ts-plugin: getDefinitionAtPositionDecorator was unable to resolve asts for ${evmtsContractPath}`,
					)
					return definition
				}
				const contractName =
					evmtsContractPath.split('/').pop()?.split('.')[0] ?? 'EvmtsContract'
				return [
					convertSolcAstToTsDefinitionInfo(
						defNode,
						evmtsContractPath,
						contractName,
					),
					...(definition ?? []),
				]
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
): typescript.DefinitionInfo {
	// Parse the 'src' field into start position, length, and source index
	const [start, length] = astNode.src.split(':').map(Number)

	// Determine the 'kind' and 'name' based on the AST node type and its properties
	let kind = typescript.ScriptElementKind.unknown
	let name = ''
	if (astNode.nodeType === 'VariableDeclaration') {
		kind = typescript.ScriptElementKind.variableElement
		name = astNode.name
	} else if (astNode.nodeType === 'FunctionDefinition') {
		kind = typescript.ScriptElementKind.functionElement
		name = astNode.name
	}
	// ... add more cases for other node types

	// Create and return the TypeScript DefinitionInfo object
	return {
		fileName,
		textSpan: typescript.createTextSpan(start, length),
		kind,
		name,
		containerKind: typescript.ScriptElementKind.classElement,
		containerName,
	}
}
