import { readFileSync } from 'fs'
import { Node } from 'solidity-ast/node.js'
import { SolcInput } from 'solidity-ast/solc.js'
import typescript from 'typescript/lib/tsserverlibrary.js'

/**
 * Adapter from solc to typescript
 * When given basic solc information it will turn it into a TypeScript DefinitionInfo object
 */
export function convertSolcAstToTsDefinitionInfo(
	astNode: Node,
	fileName: string,
	containerName: string,
	solcInput: SolcInput,
	ts: typeof typescript,
): typescript.DefinitionInfo {
	const [start, length] = astNode.src.split(':').map(Number)

	let kind = ts.ScriptElementKind.unknown
	let name = 'unknown'
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
