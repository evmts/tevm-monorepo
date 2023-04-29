import type typescript from "typescript/lib/tsserverlibrary";
import { Logger } from "./createLogger";
import fs from "fs";
import path from "path";
import { isSolidity } from "./isSolidity";
import { isRelativeSolidity } from "./isRelativeSolidity";

export class TsPlugin implements Partial<typescript.LanguageServiceHost> {
	constructor(
		private readonly createInfo: typescript.server.PluginCreateInfo,
		private readonly ts: typeof typescript,
		private readonly logger: Logger,
	) {}

	public readonly create = () => {
		return new Proxy(this.createInfo.languageServiceHost, {
			get(target, key: keyof typescript.LanguageServiceHost) {
				return (this as typeof target)[key] ?? target[key];
			},
		});
	};

	public readonly getScriptKind: typescript.LanguageServiceHost["getScriptKind"] =
		(fileName) => {
			if (!this.createInfo.languageServiceHost.getScriptKind) {
				return this.ts.ScriptKind.Unknown;
			}
			if (isSolidity(fileName)) {
				return this.ts.ScriptKind.TS;
			}
			return this.createInfo.languageServiceHost.getScriptKind(fileName);
		};

	/**
	 * This appears to return a .d.ts file for a .sol file
	 * @see https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/index.ts#LL128C2-L141C7
	 */
	public readonly getScriptSnapshot: typescript.LanguageServiceHost["getScriptSnapshot"] =
		(fileName) => {
			if (isSolidity(fileName) && fs.existsSync(fileName)) {
				console.log("TODO", fileName);
			}
			return this.createInfo.languageServiceHost.getScriptSnapshot(fileName);
		};

	public readonly resolveModuleNameLiterals: typescript.LanguageServiceHost["resolveModuleNameLiterals"] =
		(moduleNames, containingFile, ...rest) => {
			const _resolveModuleNameLiterals =
				this.createInfo.languageServiceHost.resolveModuleNameLiterals?.bind(
					this.createInfo.languageServiceHost,
				);

			const resolvedModules = _resolveModuleNameLiterals?.(
				moduleNames,
				containingFile,
				...rest,
			);

			const createModuleResolver =
				(containingFile: string) =>
				(moduleName: string): typescript.ResolvedModuleFull | undefined => {
					if (isRelativeSolidity(moduleName)) {
						return {
							extension: this.ts.Extension.Dts,
							isExternalLibraryImport: false,
							resolvedFileName: path.resolve(
								path.dirname(containingFile),
								moduleName,
							),
						};
					} else if (
						isSolidity(moduleName) &&
						this.createInfo.languageServiceHost
							.getResolvedModuleWithFailedLookupLocationsFromCache
					) {
						// TODO: Move this section to a separate file and add basic tests.
						// Attempts to locate the module using TypeScript's previous search paths. These include "baseUrl" and "paths".
						const failedModule =
							this.createInfo.languageServiceHost.getResolvedModuleWithFailedLookupLocationsFromCache(
								moduleName,
								containingFile,
							);
						const baseUrl =
							this.createInfo.project.getCompilerOptions().baseUrl;
						const match = "/index.ts";

						// An array of paths TypeScript searched for the module. All include .ts, .tsx, .d.ts, or .json extensions.
						// NOTE: TypeScript doesn't expose this in their interfaces, which is why the type is unknown.
						// https://github.com/microsoft/TypeScript/issues/28770
						const failedLocations: readonly string[] = (
							failedModule as unknown as {
								failedLookupLocations: readonly string[];
							}
						).failedLookupLocations;
						// Filter to only one extension type, and remove that extension. This leaves us with the actual file name.
						// Example: "usr/person/project/src/dir/File.module.css/index.d.ts" > "usr/person/project/src/dir/File.module.css"
						const normalizedLocations = failedLocations.reduce<string[]>(
							(locations, location) => {
								if (
									(baseUrl ? location.includes(baseUrl) : true) &&
									location.endsWith(match)
								) {
									return [...locations, location.replace(match, "")];
								}
								return locations;
							},
							[],
						);

						// Find the imported CSS module, if it exists.
						const cssModulePath = normalizedLocations.find((location) =>
							fs.existsSync(location),
						);

						if (cssModulePath) {
							return {
								extension: this.ts.Extension.Dts,
								isExternalLibraryImport: false,
								resolvedFileName: path.resolve(cssModulePath),
							};
						}
					}
				};

			const moduleResolver = createModuleResolver(containingFile);

			return moduleNames.map(({ text: moduleName }, index) => {
				if (!resolvedModules) {
					throw new Error('Expected "resolvedModules" to be defined.');
				}
				try {
					const resolvedModule = moduleResolver(moduleName);
					if (resolvedModule) return { resolvedModule };
				} catch (e) {
					this.logger.error(e as string);
					return resolvedModules[index];
				}
				return resolvedModules[index];
			});
		};
}
