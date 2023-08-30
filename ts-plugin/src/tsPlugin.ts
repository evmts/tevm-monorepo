import { loadConfig } from '@evmts/config'
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
			const service = modules.typescript.createLanguageService(
				decorate(
					getScriptKindDecorator,
					resolveModuleNameLiteralsDecorator,
					getScriptSnapshotDecorator,
				)(
					createInfo,
					modules.typescript,
					logger,
					loadConfig(createInfo.project.getCurrentDirectory(), logger),
				),
			)
			// TODO move me to a decorator
			service.getDefinitionAtPosition = (fileName, position) => {
				function isEvmtsMethodCall(node: typescript.Node): boolean {
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
									const isEvmtsContract = contractDefinition?.some(
										(definition) => {
											definition.fileName.endsWith('.sol')
										},
									)
									if (isEvmtsContract) {
										return true
									}
								}
							}
						}
					}
					return false
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

				return definition
			}

			return service
		},
		getExternalFiles: (project) => {
			return project.getFileNames().filter(isSolidity)
		},
	}
}
