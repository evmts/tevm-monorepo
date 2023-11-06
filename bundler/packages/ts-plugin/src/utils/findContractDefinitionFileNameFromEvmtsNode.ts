import typescript from 'typescript/lib/tsserverlibrary.js'

export function findContractDefinitionFileNameFromEvmtsNode(
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
		if (!ts.isCallExpression(parent)) {
			current = current.parent
			continue
		}

		const grandParent = parent.expression
		if (!ts.isPropertyAccessExpression(grandParent)) {
			current = current.parent
			continue
		}

		if (!['read', 'write', 'events'].includes(grandParent.name.getText())) {
			current = current.parent
			continue
		}
		const contractNode = grandParent.expression
		const contractDefinition = languageService.getDefinitionAtPosition(
			fileName,
			contractNode.getStart(),
		)

		if (!contractDefinition || contractDefinition.length === 0) {
			current = current.parent
			continue
		}

		const out = contractDefinition[0].fileName

		if (!out.endsWith('.sol')) {
			current = current.parent
			continue
		}

		return out
	}

	return null
}
