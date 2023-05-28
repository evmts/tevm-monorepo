import * as path from 'path';
import { createRequire } from 'node:module';

/**
 * Copied from rollup (kinda)
 * @see https://rollupjs.org/plugin-development/#this-getmoduleinfo
 */
interface ModuleInfo {
  id: string; // the id of the module, for convenience
  rawCode: string | null; // the source code of the module, `null` if external or not yet available
  code: string | null; // the code after transformed to correctly resolve remappings and node_module imports
  importedIds: string[]; // the module ids statically imported by this module
  resolutions: ModuleInfo[]; // how statically imported ids were resolved, for use with this.load
}

const isomorphicRequire = createRequire(import.meta.url);


const formatPath = (contractPath: string) => {
  return contractPath.replace(/\\/g, '/');
}

function isImportLocal(importPath: string) {
  return importPath.startsWith('.');
}


/**
* Resolve import statement to absolute file path
*
* @param {string} importPath import statement in *.sol contract
*/
function resolveImportPath(absolutePath: string, importPath: string): string {
  // Foundry remappings
  const remapping = 'TODO' as any // project.findImportRemapping(importPath);
  if (remapping !== undefined && remapping != null) {
    return formatPath(remapping.resolveImport(importPath));
  }
  // Local import "./LocalContract.sol"
  if (isImportLocal(importPath)) {
    return formatPath(path.resolve(path.dirname(absolutePath), importPath));
  } /*else if (project !== undefined && project !== null) {*/
  // try resolving with node resolution
  try {
    return isomorphicRequire.resolve(importPath)
  } catch (e) {
    console.error(`Could not resolve import ${importPath} from ${absolutePath}`, e)
    return importPath
  }
}

function replaceDependencyPath(code: string, importPath: string, depImportAbsolutePath: string) {
  const importRegEx = /(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)/gm;
  return code.replace(importRegEx, (match, p1, p2, p3) => {
    if (p2 === importPath) {
      return p1 + depImportAbsolutePath + p3;
    } else {
      return match;
    }
  });
}

function resolveImports(absolutePath: string, code: string): string[] {
  const imports: string[] = []
  const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm;
  let foundImport = importRegEx.exec(code);
  while (foundImport != null) {
    const importPath = foundImport[1];

    if (!importPath) {
      throw new Error('expected import path to exist')
    }

    if (isImportLocal(importPath)) {
      const importFullPath = formatPath(path.resolve(path.dirname(absolutePath), importPath));
      imports.push(importFullPath);
    } else {
      imports.push(importPath);
    }

    foundImport = importRegEx.exec(code);
  }
  return imports
}

export const moduleFactory = (absolutePath: string, rawCode: string): ModuleInfo => {
  const importedIds = resolveImports(absolutePath, rawCode).map(code => resolveImportPath(absolutePath, code));
  const resolutions = importedIds.map((importedId) => {
    const depImportAbsolutePath = resolveImportPath(absolutePath, importedId);
    const depRawCode = isImportLocal(importedId) ? isomorphicRequire(depImportAbsolutePath) : null;
    return moduleFactory(depImportAbsolutePath, depRawCode);
  });
  const code = importedIds.reduce((code, importPath) => {
    const depImportAbsolutePath = resolveImportPath(absolutePath, importPath);
    return replaceDependencyPath(code, importPath, depImportAbsolutePath);
  }, rawCode);


  return {
    id: absolutePath,
    rawCode,
    code,
    importedIds,
    resolutions,
  }
}

