/**
 * Represents a module with its code and imported dependencies
 */
export interface ModuleInfo {
  /** The code content */
  code: string;
  /** Absolute file paths to modules that are statically imported by this module */
  imported_ids: string[];
  /** The absolute file path to this module */
  path: string;
}

/**
 * Resolves import paths from Solidity code
 * 
 * @param absolutePath - Absolute path to the module file
 * @param rawCode - Raw Solidity source code
 * @param remappings - Object mapping import prefixes to filesystem paths
 * @param libs - Array of library paths to search for imports
 * @returns Array of resolved import paths
 */
export function resolveImports(
  absolutePath: string,
  rawCode: string,
  remappings?: Record<string, string>,
  libs?: string[]
): Promise<string[]>;

/**
 * Resolves a single import path
 * 
 * @param importPath - The import path to resolve
 * @param parentDir - The parent directory to resolve from
 * @param remappings - Object mapping import prefixes to filesystem paths
 * @param libs - Array of library paths to search for imports
 * @returns Resolved absolute path
 */
export function resolveImportPath(
  importPath: string,
  parentDir: string,
  remappings?: Record<string, string>,
  libs?: string[]
): Promise<string>;

/**
 * Creates a module map for a source file and all its imports
 * 
 * @param absolutePath - Absolute path to the module file
 * @param rawCode - Raw Solidity source code
 * @param remappings - Object mapping import prefixes to filesystem paths
 * @param libs - Array of library paths to search for imports
 * @returns Map of absolute file paths to module information
 */
export function moduleFactory(
  absolutePath: string,
  rawCode: string,
  remappings?: Record<string, string>,
  libs?: string[]
): Promise<Record<string, ModuleInfo>>;

declare const _default: {
  resolveImports: typeof resolveImports;
  resolveImportPath: typeof resolveImportPath;
  moduleFactory: typeof moduleFactory;
};

export default _default;