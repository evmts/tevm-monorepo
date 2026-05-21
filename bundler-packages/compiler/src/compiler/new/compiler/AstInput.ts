import type { SolcAst } from '@tevm/solc'
import type { SourceUnit } from 'solc-typed-ast'

/**
 * Accepted AST input forms for `SolidityAST` compilation.
 *
 * - The raw `SolcAst` (`solidity-ast` JSON form, with `.nodes`) emitted by solc directly.
 * - A `SourceUnit` from `solc-typed-ast` (with `.vPragmaDirectives`), useful after AST manipulation.
 */
export type AstInput = SolcAst | SourceUnit
