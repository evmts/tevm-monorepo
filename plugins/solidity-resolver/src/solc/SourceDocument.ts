import * as path from 'path';
import { createRequire } from 'node:module';
const isomorphicRequire = createRequire(import.meta.url);


function formatPath(contractPath: string) {
  return contractPath.replace(/\\/g, '/');
}

export class SourceDocument {
  public code: string;
  public unformattedCode: string;
  // TODO: Import needs to be a class including if is local, absolutePath, module etc
  public imports: Array<string>;
  public absolutePath: string;

  public static getAllLibraryImports(code: string): string[] {
    const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm;
    const imports: string[] = [];
    let foundImport = importRegEx.exec(code);
    while (foundImport != null) {
      const importPath = foundImport[1];

      if (!importPath) {
        throw new Error('expected import path to exist')
      }

      if (!this.isImportLocal(importPath)) {
        imports.push(importPath);
      }

      foundImport = importRegEx.exec(code);
    }
    return imports;
  }

  public static isImportLocal(importPath: string) {
    return importPath.startsWith('.');
  }

  constructor(absoulePath: string, code: string) {
    this.absolutePath = formatPath(absoulePath);
    this.code = code;
    this.unformattedCode = code;
    this.imports = new Array<string>();
  }

  /**
 * Resolve import statement to absolute file path
 *
 * @param {string} importPath import statement in *.sol contract
 */
  public resolveImportPath(importPath: string): string {
    // Foundry remappings
    const remapping = 'TODO' as any // this.project.findImportRemapping(importPath);
    if (remapping !== undefined && remapping != null) {
      return formatPath(remapping.resolveImport(importPath));
    }
    // Local import "./LocalContract.sol"
    if (this.isImportLocal(importPath)) {
      return formatPath(path.resolve(path.dirname(this.absolutePath), importPath));
    } /*else if (this.project !== undefined && this.project !== null) {*/
    // try resolving with node resolution
    try {
      return isomorphicRequire.resolve(importPath)
    } catch (e) {
      console.error(`Could not resolve import ${importPath} from ${this.absolutePath}`, e)
      return importPath
    }
  }

  public getAllImportFromPackages() {
    const importsFromPackages = new Array<string>();
    this.imports.forEach(importElement => {
      if (!this.isImportLocal(importElement)) {
        importsFromPackages.push(importElement);
      }
    });
    return importsFromPackages;
  }

  public isImportLocal(importPath: string) {
    return SourceDocument.isImportLocal(importPath);
  }

  public replaceDependencyPath(importPath: string, depImportAbsolutePath: string) {
    const importRegEx = /(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)/gm;
    this.code = this.code.replace(importRegEx, (match, p1, p2, p3) => {
      if (p2 === importPath) {
        return p1 + depImportAbsolutePath + p3;
      } else {
        return match;
      }
    });
  }

  public resolveImports() {
    const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm;
    let foundImport = importRegEx.exec(this.code);
    while (foundImport != null) {
      const importPath = foundImport[1];

      if (!importPath) {
        throw new Error('expected import path to exist')
      }

      if (this.isImportLocal(importPath)) {
        const importFullPath = formatPath(path.resolve(path.dirname(this.absolutePath), importPath));
        this.imports.push(importFullPath);
      } else {
        this.imports.push(importPath);
      }

      foundImport = importRegEx.exec(this.code);
    }
  }
}
