import type { SolcAst } from '@tevm/solc'
import type { SourceUnit } from 'solc-typed-ast'

/**
 * An accepted AST input type
 *
 * - SolcAst: returned in solc output for each source file
 * - SourceUnit: returned in solc-typed-ast from ASTReader; effectively the same type as SolcAst but as a class
 */
export type AstInput = SolcAst | SourceUnit
