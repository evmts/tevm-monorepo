import * as path from 'path';
import { createRequire } from 'node:module';
const isomorphicRequire = createRequire(import.meta.url);


const formatPath = (contractPath: string) => {
  return contractPath.replace(/\\/g, '/');
}

export const sourceDocumentFactory = (absolutePath: string, code: string) => {
  const unformattedCode: string = code;
  const imports: Array<string> = [];

  function getAllLibraryImports(code: string): string[] {
    const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm;
    const imports: string[] = [];
    let foundImport = importRegEx.exec(code);
    while (foundImport != null) {
      const importPath = foundImport[1];

      if (!importPath) {
        throw new Error('expected import path to exist')
      }

      if (!isImportLocal(importPath)) {
        imports.push(importPath);
      }

      foundImport = importRegEx.exec(code);
    }
    return imports;
  }

  function isImportLocal(importPath: string) {
    return importPath.startsWith('.');
  }

  /**
 * Resolve import statement to absolute file path
 *
 * @param {string} importPath import statement in *.sol contract
 */
  function resolveImportPath(importPath: string): string {
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

  function getAllImportFromPackages() {
    const importsFromPackages = new Array<string>();
    imports.forEach(importElement => {
      if (!isImportLocal(importElement)) {
        importsFromPackages.push(importElement);
      }
    });
    return importsFromPackages;
  }

  function replaceDependencyPath(importPath: string, depImportAbsolutePath: string) {
    const importRegEx = /(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)/gm;
    code = code.replace(importRegEx, (match, p1, p2, p3) => {
      if (p2 === importPath) {
        return p1 + depImportAbsolutePath + p3;
      } else {
        return match;
      }
    });
  }

  function resolveImports() {
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
  }

  return {
    resolveImports,
    replaceDependencyPath,
    getAllImportFromPackages,
    getAllLibraryImports,
    resolveImportPath,
    isImportLocal,
    unformattedCode,
    imports,
    code
  }
}

