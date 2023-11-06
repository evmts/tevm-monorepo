import typescript from 'typescript/lib/tsserverlibrary.js'

/**
 * Find the typescript node at the given position in the AST
 */
export function findNode(
	rootNode: typescript.Node,
	position: number,
): typescript.Node | null {
	if (position < 0) {
		throw new Error('Position must be non-negative')
	}
	if (Number.isInteger(position) === false) {
		throw new Error('Position must be an integer')
	}
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
