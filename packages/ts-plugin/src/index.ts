import type typescript from "typescript/lib/tsserverlibrary";
import { createLogger } from "./createLogger";
import fs from "fs";
import path from "path";

function init(modules: {
	typescript: typeof typescript;
}) {
	const ts = modules.typescript;

	function create(createInfo: typescript.server.PluginCreateInfo) {
		const logger = createLogger(createInfo);
		const directory = createInfo.project.getCurrentDirectory();

		const languageServiceHost = {} as Partial<typescript.LanguageServiceHost>;

		const languageServiceHostProxy = new Proxy(createInfo.languageServiceHost, {
			get(target, key: keyof typescript.LanguageServiceHost) {
				return languageServiceHost[key] ?? target[key];
			},
		});

		const isSolidity = (fileName: string) => fileName.endsWith(".sol");
		const isRelativeSolidity = (fileName: string) =>
			fileName.startsWith(".") && isSolidity(fileName);

		languageServiceHost.getScriptKind = (fileName) => {
			if (!createInfo.languageServiceHost.getScriptKind) {
				return ts.ScriptKind.Unknown;
			}
			if (isSolidity(fileName)) {
				return ts.ScriptKind.TS;
			}
			return createInfo.languageServiceHost.getScriptKind(fileName);
		};

		/**
		 * This appears to return a .d.ts file for a .sol file
		 * @see https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/index.ts#LL128C2-L141C7
		 */
		languageServiceHost.getScriptSnapshot = (fileName) => {
			if (isSolidity(fileName) && fs.existsSync(fileName)) {
				console.log("TODO", fileName);
			}
			return createInfo.languageServiceHost.getScriptSnapshot(fileName);
		};

		languageServiceHost.resolveModuleNameLiterals = (
			moduleNames,
			containingFile,
			...rest
		) => {
			const _resolveModuleNameLiterals =
				createInfo.languageServiceHost.resolveModuleNameLiterals?.bind(
					createInfo.languageServiceHost,
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
							extension: ts.Extension.Dts,
							isExternalLibraryImport: false,
							resolvedFileName: path.resolve(
								path.dirname(containingFile),
								moduleName,
							),
						};
					} else if (
						isSolidity(moduleName) &&
						languageServiceHost.getResolvedModuleWithFailedLookupLocationsFromCache
					) {
						// TODO: Move this section to a separate file and add basic tests.
						// Attempts to locate the module using TypeScript's previous search paths. These include "baseUrl" and "paths".
						const failedModule =
							languageServiceHost.getResolvedModuleWithFailedLookupLocationsFromCache(
								moduleName,
								containingFile,
							);
						const baseUrl = createInfo.project.getCompilerOptions().baseUrl;
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
								extension: ts.Extension.Dts,
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
					logger(e as string);
					return resolvedModules[index];
				}
				return resolvedModules[index];
			});
		};
	}

	return { create };
}

export = init;
