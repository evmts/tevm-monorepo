import { bundler } from './bundler'
import { resolveArtifacts, resolveArtifactsSync } from './solc'
import { Bundler } from './types'
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe(bundler.name, () => {
	let resolver: ReturnType<Bundler>
	let logger
	let config

	beforeEach(() => {
		logger = { ...console, error: vi.fn() }
		config = {
			compiler: 'compiler config',
			localContracts: { contracts: [{ name: 'TestContract', addresses: {} }] },
		}

		resolver = bundler(config as any, logger)
		vi.mock('./solc', () => {
			return {
				resolveArtifacts: vi.fn(),
				resolveArtifactsSync: vi.fn(),
			}
		})
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	const mockResolveArtifacts = resolveArtifacts as Mock
	describe('resolveDts', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce(undefined)
			const result = await resolver.resolveDts('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce(artifacts)
			const result = await resolver.resolveDts('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import type { EvmtsContract } from '@evmts/core'
				type _AbiTestContract = [] as const;
				type _ChainAddressMapTestContract = {\\"name\\":\\"TestContract\\",\\"addresses\\":{}} as const;
				type _NameTestContract = \\"TestContract\\";
				/**
				 * TestContract EvmtsContract
				 */
				export const TestContract: EvmtsContract<_NameTestContract, _ChainAddressMapTestContract, _AbiTestContract>;"
			`)
		})
	})

	const mockResolveArtifactsSync = resolveArtifactsSync as Mock
	describe('resolveDtsSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce(undefined)
			const result = resolver.resolveDtsSync('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce(artifacts)
			const result = resolver.resolveDtsSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import type { EvmtsContract } from '@evmts/core'
				export type _AbiTestContract = [] as const;
				export type _ChainAddressMapTestContract = {} as const;
				export type _NameTestContract = \\"TestContract\\";
				/**
				 * TestContract EvmtsContract
				 */
				export const TestContract: EvmtsContract<_NameTestContract, _ChainAddressMapTestContract, _AbiTestContract>;"
			`)
		})
	})

	describe('resolveTsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce(undefined)
			const result = resolver.resolveTsModuleSync('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			;(resolveArtifactsSync as Mock).mockReturnValueOnce(artifacts)
			const result = resolver.resolveTsModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}} as const
				export const TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveTsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce(undefined)
			const result = await resolver.resolveTsModule('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce(artifacts)
			const result = await resolver.resolveTsModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}} as const
				export const TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveCjsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce(undefined)
			const result = resolver.resolveCjsModuleSync('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper CommonJS module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce(artifacts)
			const result = resolver.resolveCjsModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"\\"use strict\\";
				var __defProp = Object.defineProperty;
				var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
				var __getOwnPropNames = Object.getOwnPropertyNames;
				var __hasOwnProp = Object.prototype.hasOwnProperty;
				var __export = (target, all) => {
				  for (var name in all)
				    __defProp(target, name, { get: all[name], enumerable: true });
				};
				var __copyProps = (to, from, except, desc) => {
				  if (from && typeof from === \\"object\\" || typeof from === \\"function\\") {
				    for (let key of __getOwnPropNames(from))
				      if (!__hasOwnProp.call(to, key) && key !== except)
				        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
				  }
				  return to;
				};
				var __toCommonJS = (mod) => __copyProps(__defProp({}, \\"__esModule\\", { value: true }), mod);

				// src/index.ts
				var src_exports = {};
				__export(src_exports, {
				  evmtsContractFactory: () => evmtsContractFactory
				});
				module.exports = __toCommonJS(src_exports);

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/regex.js
				function execTyped(regex, string) {
				  const match = regex.exec(string);
				  return match?.groups;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
				var tupleRegex = /^tuple(?<array>(\\\\[(\\\\d*)\\\\])*)$/;
				function formatAbiParameter(abiParameter) {
				  let type = abiParameter.type;
				  if (tupleRegex.test(abiParameter.type) && \\"components\\" in abiParameter) {
				    type = \\"(\\";
				    const length = abiParameter.components.length;
				    for (let i = 0; i < length; i++) {
				      const component = abiParameter.components[i];
				      type += formatAbiParameter(component);
				      if (i < length - 1)
				        type += \\", \\";
				    }
				    const result = execTyped(tupleRegex, abiParameter.type);
				    type += \`)\${result?.array ?? \\"\\"}\`;
				    return formatAbiParameter({
				      ...abiParameter,
				      type
				    });
				  }
				  if (\\"indexed\\" in abiParameter && abiParameter.indexed)
				    type = \`\${type} indexed\`;
				  if (abiParameter.name)
				    return \`\${type} \${abiParameter.name}\`;
				  return type;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
				function formatAbiParameters(abiParameters) {
				  let params = \\"\\";
				  const length = abiParameters.length;
				  for (let i = 0; i < length; i++) {
				    const abiParameter = abiParameters[i];
				    params += formatAbiParameter(abiParameter);
				    if (i !== length - 1)
				      params += \\", \\";
				  }
				  return params;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
				function formatAbiItem(abiItem) {
				  if (abiItem.type === \\"function\\")
				    return \`function \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\${abiItem.stateMutability && abiItem.stateMutability !== \\"nonpayable\\" ? \` \${abiItem.stateMutability}\` : \\"\\"}\${abiItem.outputs.length ? \` returns (\${formatAbiParameters(abiItem.outputs)})\` : \\"\\"}\`;
				  else if (abiItem.type === \\"event\\")
				    return \`event \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\`;
				  else if (abiItem.type === \\"error\\")
				    return \`error \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\`;
				  else if (abiItem.type === \\"constructor\\")
				    return \`constructor(\${formatAbiParameters(abiItem.inputs)})\${abiItem.stateMutability === \\"payable\\" ? \\" payable\\" : \\"\\"}\`;
				  else if (abiItem.type === \\"fallback\\")
				    return \\"fallback()\\";
				  return \\"receive() external payable\\";
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbi.js
				function formatAbi(abi) {
				  const signatures = [];
				  const length = abi.length;
				  for (let i = 0; i < length; i++) {
				    const abiItem = abi[i];
				    const signature = formatAbiItem(abiItem);
				    signatures.push(signature);
				  }
				  return signatures;
				}

				// src/event/eventFactory.ts
				var eventsFactory = ({
				  abi,
				  addresses
				}) => ({ chainId } = {}) => Object.fromEntries(
				  abi.filter((field) => {
				    return field.type === \\"event\\";
				  }).map((eventAbi) => {
				    const creator = (params) => {
				      return {
				        eventName: eventAbi.name,
				        abi: [eventAbi],
				        humanReadableAbi: formatAbi([eventAbi]),
				        address: chainId ? addresses[chainId] : Object.values(addresses)[0],
				        ...params
				      };
				    };
				    creator.address = chainId ? addresses[chainId] : Object.values(addresses)[0];
				    creator.abi = [eventAbi];
				    creator.eventName = eventAbi.name;
				    creator.humanReadableAbi = formatAbi([eventAbi]);
				    return [eventAbi.name, creator];
				  })
				);

				// src/read/readFactory.ts
				var readFactory = ({
				  addresses,
				  methods
				}) => ({ chainId } = {}) => Object.fromEntries(
				  methods.map((method) => {
				    const creator = (...args) => {
				      const methodAbi = methods.filter(
				        (m) => m.name === method?.name
				      );
				      const maybeArgs = args.length > 0 ? { args } : {};
				      return {
				        abi: methodAbi,
				        humanReadableAbi: formatAbi([method]),
				        functionName: method.name,
				        // TODO we are currently defaulting to the first address in the case of no chain id
				        // There has to be a better way like providing an explicit default property in the address config
				        address: addresses[chainId] ?? Object.values(addresses)[0] ?? void 0,
				        ...maybeArgs
				      };
				    };
				    creator.address = addresses[chainId] ?? void 0;
				    creator.abi = [method];
				    creator.humanReadableAbi = formatAbi([method]);
				    return [method.name, creator];
				  })
				);

				// src/write/writeFactory.ts
				var writeFactory = ({
				  addresses,
				  methods
				}) => ({ chainId } = {}) => Object.fromEntries(
				  methods.map((method) => {
				    const creator = (...args) => {
				      const methodAbi = methods.filter(
				        (m) => m.name === method?.name
				      );
				      const maybeArgs = args.length > 0 ? { args } : {};
				      return {
				        abi: methodAbi,
				        humanReadableAbi: formatAbi([method]),
				        functionName: method.name,
				        // TODO we are currently defaulting to the first address in the case of no chain id
				        // There has to be a better way like providing an explicit default property in the address config
				        address: addresses[chainId] ?? Object.values(addresses)[0] ?? void 0,
				        ...maybeArgs
				      };
				    };
				    creator.address = addresses[chainId] ?? void 0;
				    creator.abi = [method];
				    creator.humanReadableAbi = formatAbi([method]);
				    return [method.name, creator];
				  })
				);

				// src/evmtsContractFactory.ts
				var evmtsContractFactory = ({
				  abi,
				  name,
				  addresses,
				  bytecode
				}) => {
				  const methods = abi.filter((field) => {
				    return field.type === \\"function\\";
				  });
				  return {
				    name,
				    abi,
				    humanReadableAbi: formatAbi(abi),
				    addresses,
				    bytecode,
				    // TODO make this more internally typesafe
				    events: eventsFactory({ abi, addresses }),
				    // TODO make this more internally typesafe
				    write: writeFactory({ addresses, methods }),
				    // TODO make this more internally typesafe
				    read: readFactory({ addresses, methods })
				  };
				};
				// Annotate the CommonJS export names for ESM import in node:
				0 && (module.exports = {
				  evmtsContractFactory
				});
				//# sourceMappingURL=index.cjs.map
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				module.exports.TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveCjsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce(undefined)
			const result = await resolver.resolveCjsModule('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper CommonJS module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce(artifacts)
			const result = await resolver.resolveCjsModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"\\"use strict\\";
				var __defProp = Object.defineProperty;
				var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
				var __getOwnPropNames = Object.getOwnPropertyNames;
				var __hasOwnProp = Object.prototype.hasOwnProperty;
				var __export = (target, all) => {
				  for (var name in all)
				    __defProp(target, name, { get: all[name], enumerable: true });
				};
				var __copyProps = (to, from, except, desc) => {
				  if (from && typeof from === \\"object\\" || typeof from === \\"function\\") {
				    for (let key of __getOwnPropNames(from))
				      if (!__hasOwnProp.call(to, key) && key !== except)
				        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
				  }
				  return to;
				};
				var __toCommonJS = (mod) => __copyProps(__defProp({}, \\"__esModule\\", { value: true }), mod);

				// src/index.ts
				var src_exports = {};
				__export(src_exports, {
				  evmtsContractFactory: () => evmtsContractFactory
				});
				module.exports = __toCommonJS(src_exports);

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/regex.js
				function execTyped(regex, string) {
				  const match = regex.exec(string);
				  return match?.groups;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
				var tupleRegex = /^tuple(?<array>(\\\\[(\\\\d*)\\\\])*)$/;
				function formatAbiParameter(abiParameter) {
				  let type = abiParameter.type;
				  if (tupleRegex.test(abiParameter.type) && \\"components\\" in abiParameter) {
				    type = \\"(\\";
				    const length = abiParameter.components.length;
				    for (let i = 0; i < length; i++) {
				      const component = abiParameter.components[i];
				      type += formatAbiParameter(component);
				      if (i < length - 1)
				        type += \\", \\";
				    }
				    const result = execTyped(tupleRegex, abiParameter.type);
				    type += \`)\${result?.array ?? \\"\\"}\`;
				    return formatAbiParameter({
				      ...abiParameter,
				      type
				    });
				  }
				  if (\\"indexed\\" in abiParameter && abiParameter.indexed)
				    type = \`\${type} indexed\`;
				  if (abiParameter.name)
				    return \`\${type} \${abiParameter.name}\`;
				  return type;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
				function formatAbiParameters(abiParameters) {
				  let params = \\"\\";
				  const length = abiParameters.length;
				  for (let i = 0; i < length; i++) {
				    const abiParameter = abiParameters[i];
				    params += formatAbiParameter(abiParameter);
				    if (i !== length - 1)
				      params += \\", \\";
				  }
				  return params;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
				function formatAbiItem(abiItem) {
				  if (abiItem.type === \\"function\\")
				    return \`function \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\${abiItem.stateMutability && abiItem.stateMutability !== \\"nonpayable\\" ? \` \${abiItem.stateMutability}\` : \\"\\"}\${abiItem.outputs.length ? \` returns (\${formatAbiParameters(abiItem.outputs)})\` : \\"\\"}\`;
				  else if (abiItem.type === \\"event\\")
				    return \`event \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\`;
				  else if (abiItem.type === \\"error\\")
				    return \`error \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\`;
				  else if (abiItem.type === \\"constructor\\")
				    return \`constructor(\${formatAbiParameters(abiItem.inputs)})\${abiItem.stateMutability === \\"payable\\" ? \\" payable\\" : \\"\\"}\`;
				  else if (abiItem.type === \\"fallback\\")
				    return \\"fallback()\\";
				  return \\"receive() external payable\\";
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbi.js
				function formatAbi(abi) {
				  const signatures = [];
				  const length = abi.length;
				  for (let i = 0; i < length; i++) {
				    const abiItem = abi[i];
				    const signature = formatAbiItem(abiItem);
				    signatures.push(signature);
				  }
				  return signatures;
				}

				// src/event/eventFactory.ts
				var eventsFactory = ({
				  abi,
				  addresses
				}) => ({ chainId } = {}) => Object.fromEntries(
				  abi.filter((field) => {
				    return field.type === \\"event\\";
				  }).map((eventAbi) => {
				    const creator = (params) => {
				      return {
				        eventName: eventAbi.name,
				        abi: [eventAbi],
				        humanReadableAbi: formatAbi([eventAbi]),
				        address: chainId ? addresses[chainId] : Object.values(addresses)[0],
				        ...params
				      };
				    };
				    creator.address = chainId ? addresses[chainId] : Object.values(addresses)[0];
				    creator.abi = [eventAbi];
				    creator.eventName = eventAbi.name;
				    creator.humanReadableAbi = formatAbi([eventAbi]);
				    return [eventAbi.name, creator];
				  })
				);

				// src/read/readFactory.ts
				var readFactory = ({
				  addresses,
				  methods
				}) => ({ chainId } = {}) => Object.fromEntries(
				  methods.map((method) => {
				    const creator = (...args) => {
				      const methodAbi = methods.filter(
				        (m) => m.name === method?.name
				      );
				      const maybeArgs = args.length > 0 ? { args } : {};
				      return {
				        abi: methodAbi,
				        humanReadableAbi: formatAbi([method]),
				        functionName: method.name,
				        // TODO we are currently defaulting to the first address in the case of no chain id
				        // There has to be a better way like providing an explicit default property in the address config
				        address: addresses[chainId] ?? Object.values(addresses)[0] ?? void 0,
				        ...maybeArgs
				      };
				    };
				    creator.address = addresses[chainId] ?? void 0;
				    creator.abi = [method];
				    creator.humanReadableAbi = formatAbi([method]);
				    return [method.name, creator];
				  })
				);

				// src/write/writeFactory.ts
				var writeFactory = ({
				  addresses,
				  methods
				}) => ({ chainId } = {}) => Object.fromEntries(
				  methods.map((method) => {
				    const creator = (...args) => {
				      const methodAbi = methods.filter(
				        (m) => m.name === method?.name
				      );
				      const maybeArgs = args.length > 0 ? { args } : {};
				      return {
				        abi: methodAbi,
				        humanReadableAbi: formatAbi([method]),
				        functionName: method.name,
				        // TODO we are currently defaulting to the first address in the case of no chain id
				        // There has to be a better way like providing an explicit default property in the address config
				        address: addresses[chainId] ?? Object.values(addresses)[0] ?? void 0,
				        ...maybeArgs
				      };
				    };
				    creator.address = addresses[chainId] ?? void 0;
				    creator.abi = [method];
				    creator.humanReadableAbi = formatAbi([method]);
				    return [method.name, creator];
				  })
				);

				// src/evmtsContractFactory.ts
				var evmtsContractFactory = ({
				  abi,
				  name,
				  addresses,
				  bytecode
				}) => {
				  const methods = abi.filter((field) => {
				    return field.type === \\"function\\";
				  });
				  return {
				    name,
				    abi,
				    humanReadableAbi: formatAbi(abi),
				    addresses,
				    bytecode,
				    // TODO make this more internally typesafe
				    events: eventsFactory({ abi, addresses }),
				    // TODO make this more internally typesafe
				    write: writeFactory({ addresses, methods }),
				    // TODO make this more internally typesafe
				    read: readFactory({ addresses, methods })
				  };
				};
				// Annotate the CommonJS export names for ESM import in node:
				0 && (module.exports = {
				  evmtsContractFactory
				});
				//# sourceMappingURL=index.cjs.map
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				module.exports.TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveEsmModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce(undefined)
			const result = resolver.resolveEsmModuleSync('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper ESM module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifactsSync.mockReturnValueOnce(artifacts)
			const result = resolver.resolveEsmModuleSync('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"\\"use strict\\";
				var __defProp = Object.defineProperty;
				var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
				var __getOwnPropNames = Object.getOwnPropertyNames;
				var __hasOwnProp = Object.prototype.hasOwnProperty;
				var __export = (target, all) => {
				  for (var name in all)
				    __defProp(target, name, { get: all[name], enumerable: true });
				};
				var __copyProps = (to, from, except, desc) => {
				  if (from && typeof from === \\"object\\" || typeof from === \\"function\\") {
				    for (let key of __getOwnPropNames(from))
				      if (!__hasOwnProp.call(to, key) && key !== except)
				        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
				  }
				  return to;
				};
				var __toCommonJS = (mod) => __copyProps(__defProp({}, \\"__esModule\\", { value: true }), mod);

				// src/index.ts
				var src_exports = {};
				__export(src_exports, {
				  evmtsContractFactory: () => evmtsContractFactory
				});
				module.exports = __toCommonJS(src_exports);

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/regex.js
				function execTyped(regex, string) {
				  const match = regex.exec(string);
				  return match?.groups;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
				var tupleRegex = /^tuple(?<array>(\\\\[(\\\\d*)\\\\])*)$/;
				function formatAbiParameter(abiParameter) {
				  let type = abiParameter.type;
				  if (tupleRegex.test(abiParameter.type) && \\"components\\" in abiParameter) {
				    type = \\"(\\";
				    const length = abiParameter.components.length;
				    for (let i = 0; i < length; i++) {
				      const component = abiParameter.components[i];
				      type += formatAbiParameter(component);
				      if (i < length - 1)
				        type += \\", \\";
				    }
				    const result = execTyped(tupleRegex, abiParameter.type);
				    type += \`)\${result?.array ?? \\"\\"}\`;
				    return formatAbiParameter({
				      ...abiParameter,
				      type
				    });
				  }
				  if (\\"indexed\\" in abiParameter && abiParameter.indexed)
				    type = \`\${type} indexed\`;
				  if (abiParameter.name)
				    return \`\${type} \${abiParameter.name}\`;
				  return type;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
				function formatAbiParameters(abiParameters) {
				  let params = \\"\\";
				  const length = abiParameters.length;
				  for (let i = 0; i < length; i++) {
				    const abiParameter = abiParameters[i];
				    params += formatAbiParameter(abiParameter);
				    if (i !== length - 1)
				      params += \\", \\";
				  }
				  return params;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
				function formatAbiItem(abiItem) {
				  if (abiItem.type === \\"function\\")
				    return \`function \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\${abiItem.stateMutability && abiItem.stateMutability !== \\"nonpayable\\" ? \` \${abiItem.stateMutability}\` : \\"\\"}\${abiItem.outputs.length ? \` returns (\${formatAbiParameters(abiItem.outputs)})\` : \\"\\"}\`;
				  else if (abiItem.type === \\"event\\")
				    return \`event \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\`;
				  else if (abiItem.type === \\"error\\")
				    return \`error \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\`;
				  else if (abiItem.type === \\"constructor\\")
				    return \`constructor(\${formatAbiParameters(abiItem.inputs)})\${abiItem.stateMutability === \\"payable\\" ? \\" payable\\" : \\"\\"}\`;
				  else if (abiItem.type === \\"fallback\\")
				    return \\"fallback()\\";
				  return \\"receive() external payable\\";
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbi.js
				function formatAbi(abi) {
				  const signatures = [];
				  const length = abi.length;
				  for (let i = 0; i < length; i++) {
				    const abiItem = abi[i];
				    const signature = formatAbiItem(abiItem);
				    signatures.push(signature);
				  }
				  return signatures;
				}

				// src/event/eventFactory.ts
				var eventsFactory = ({
				  abi,
				  addresses
				}) => ({ chainId } = {}) => Object.fromEntries(
				  abi.filter((field) => {
				    return field.type === \\"event\\";
				  }).map((eventAbi) => {
				    const creator = (params) => {
				      return {
				        eventName: eventAbi.name,
				        abi: [eventAbi],
				        humanReadableAbi: formatAbi([eventAbi]),
				        address: chainId ? addresses[chainId] : Object.values(addresses)[0],
				        ...params
				      };
				    };
				    creator.address = chainId ? addresses[chainId] : Object.values(addresses)[0];
				    creator.abi = [eventAbi];
				    creator.eventName = eventAbi.name;
				    creator.humanReadableAbi = formatAbi([eventAbi]);
				    return [eventAbi.name, creator];
				  })
				);

				// src/read/readFactory.ts
				var readFactory = ({
				  addresses,
				  methods
				}) => ({ chainId } = {}) => Object.fromEntries(
				  methods.map((method) => {
				    const creator = (...args) => {
				      const methodAbi = methods.filter(
				        (m) => m.name === method?.name
				      );
				      const maybeArgs = args.length > 0 ? { args } : {};
				      return {
				        abi: methodAbi,
				        humanReadableAbi: formatAbi([method]),
				        functionName: method.name,
				        // TODO we are currently defaulting to the first address in the case of no chain id
				        // There has to be a better way like providing an explicit default property in the address config
				        address: addresses[chainId] ?? Object.values(addresses)[0] ?? void 0,
				        ...maybeArgs
				      };
				    };
				    creator.address = addresses[chainId] ?? void 0;
				    creator.abi = [method];
				    creator.humanReadableAbi = formatAbi([method]);
				    return [method.name, creator];
				  })
				);

				// src/write/writeFactory.ts
				var writeFactory = ({
				  addresses,
				  methods
				}) => ({ chainId } = {}) => Object.fromEntries(
				  methods.map((method) => {
				    const creator = (...args) => {
				      const methodAbi = methods.filter(
				        (m) => m.name === method?.name
				      );
				      const maybeArgs = args.length > 0 ? { args } : {};
				      return {
				        abi: methodAbi,
				        humanReadableAbi: formatAbi([method]),
				        functionName: method.name,
				        // TODO we are currently defaulting to the first address in the case of no chain id
				        // There has to be a better way like providing an explicit default property in the address config
				        address: addresses[chainId] ?? Object.values(addresses)[0] ?? void 0,
				        ...maybeArgs
				      };
				    };
				    creator.address = addresses[chainId] ?? void 0;
				    creator.abi = [method];
				    creator.humanReadableAbi = formatAbi([method]);
				    return [method.name, creator];
				  })
				);

				// src/evmtsContractFactory.ts
				var evmtsContractFactory = ({
				  abi,
				  name,
				  addresses,
				  bytecode
				}) => {
				  const methods = abi.filter((field) => {
				    return field.type === \\"function\\";
				  });
				  return {
				    name,
				    abi,
				    humanReadableAbi: formatAbi(abi),
				    addresses,
				    bytecode,
				    // TODO make this more internally typesafe
				    events: eventsFactory({ abi, addresses }),
				    // TODO make this more internally typesafe
				    write: writeFactory({ addresses, methods }),
				    // TODO make this more internally typesafe
				    read: readFactory({ addresses, methods })
				  };
				};
				// Annotate the CommonJS export names for ESM import in node:
				0 && (module.exports = {
				  evmtsContractFactory
				});
				//# sourceMappingURL=index.cjs.map
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				export const TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})

	describe('resolveEsmModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce(undefined)
			const result = await resolver.resolveEsmModule('module', 'basedir')
			expect(result).toBe('')
		})

		it('should generate proper ESM module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [], bytecode: '' },
			}
			mockResolveArtifacts.mockResolvedValueOnce(artifacts)
			const result = await resolver.resolveEsmModule('module', 'basedir')
			expect(result).toMatchInlineSnapshot(`
				"\\"use strict\\";
				var __defProp = Object.defineProperty;
				var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
				var __getOwnPropNames = Object.getOwnPropertyNames;
				var __hasOwnProp = Object.prototype.hasOwnProperty;
				var __export = (target, all) => {
				  for (var name in all)
				    __defProp(target, name, { get: all[name], enumerable: true });
				};
				var __copyProps = (to, from, except, desc) => {
				  if (from && typeof from === \\"object\\" || typeof from === \\"function\\") {
				    for (let key of __getOwnPropNames(from))
				      if (!__hasOwnProp.call(to, key) && key !== except)
				        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
				  }
				  return to;
				};
				var __toCommonJS = (mod) => __copyProps(__defProp({}, \\"__esModule\\", { value: true }), mod);

				// src/index.ts
				var src_exports = {};
				__export(src_exports, {
				  evmtsContractFactory: () => evmtsContractFactory
				});
				module.exports = __toCommonJS(src_exports);

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/regex.js
				function execTyped(regex, string) {
				  const match = regex.exec(string);
				  return match?.groups;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
				var tupleRegex = /^tuple(?<array>(\\\\[(\\\\d*)\\\\])*)$/;
				function formatAbiParameter(abiParameter) {
				  let type = abiParameter.type;
				  if (tupleRegex.test(abiParameter.type) && \\"components\\" in abiParameter) {
				    type = \\"(\\";
				    const length = abiParameter.components.length;
				    for (let i = 0; i < length; i++) {
				      const component = abiParameter.components[i];
				      type += formatAbiParameter(component);
				      if (i < length - 1)
				        type += \\", \\";
				    }
				    const result = execTyped(tupleRegex, abiParameter.type);
				    type += \`)\${result?.array ?? \\"\\"}\`;
				    return formatAbiParameter({
				      ...abiParameter,
				      type
				    });
				  }
				  if (\\"indexed\\" in abiParameter && abiParameter.indexed)
				    type = \`\${type} indexed\`;
				  if (abiParameter.name)
				    return \`\${type} \${abiParameter.name}\`;
				  return type;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
				function formatAbiParameters(abiParameters) {
				  let params = \\"\\";
				  const length = abiParameters.length;
				  for (let i = 0; i < length; i++) {
				    const abiParameter = abiParameters[i];
				    params += formatAbiParameter(abiParameter);
				    if (i !== length - 1)
				      params += \\", \\";
				  }
				  return params;
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
				function formatAbiItem(abiItem) {
				  if (abiItem.type === \\"function\\")
				    return \`function \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\${abiItem.stateMutability && abiItem.stateMutability !== \\"nonpayable\\" ? \` \${abiItem.stateMutability}\` : \\"\\"}\${abiItem.outputs.length ? \` returns (\${formatAbiParameters(abiItem.outputs)})\` : \\"\\"}\`;
				  else if (abiItem.type === \\"event\\")
				    return \`event \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\`;
				  else if (abiItem.type === \\"error\\")
				    return \`error \${abiItem.name}(\${formatAbiParameters(abiItem.inputs)})\`;
				  else if (abiItem.type === \\"constructor\\")
				    return \`constructor(\${formatAbiParameters(abiItem.inputs)})\${abiItem.stateMutability === \\"payable\\" ? \\" payable\\" : \\"\\"}\`;
				  else if (abiItem.type === \\"fallback\\")
				    return \\"fallback()\\";
				  return \\"receive() external payable\\";
				}

				// ../node_modules/.pnpm/abitype@0.9.2_typescript@5.1.6_zod@3.21.4/node_modules/abitype/dist/esm/human-readable/formatAbi.js
				function formatAbi(abi) {
				  const signatures = [];
				  const length = abi.length;
				  for (let i = 0; i < length; i++) {
				    const abiItem = abi[i];
				    const signature = formatAbiItem(abiItem);
				    signatures.push(signature);
				  }
				  return signatures;
				}

				// src/event/eventFactory.ts
				var eventsFactory = ({
				  abi,
				  addresses
				}) => ({ chainId } = {}) => Object.fromEntries(
				  abi.filter((field) => {
				    return field.type === \\"event\\";
				  }).map((eventAbi) => {
				    const creator = (params) => {
				      return {
				        eventName: eventAbi.name,
				        abi: [eventAbi],
				        humanReadableAbi: formatAbi([eventAbi]),
				        address: chainId ? addresses[chainId] : Object.values(addresses)[0],
				        ...params
				      };
				    };
				    creator.address = chainId ? addresses[chainId] : Object.values(addresses)[0];
				    creator.abi = [eventAbi];
				    creator.eventName = eventAbi.name;
				    creator.humanReadableAbi = formatAbi([eventAbi]);
				    return [eventAbi.name, creator];
				  })
				);

				// src/read/readFactory.ts
				var readFactory = ({
				  addresses,
				  methods
				}) => ({ chainId } = {}) => Object.fromEntries(
				  methods.map((method) => {
				    const creator = (...args) => {
				      const methodAbi = methods.filter(
				        (m) => m.name === method?.name
				      );
				      const maybeArgs = args.length > 0 ? { args } : {};
				      return {
				        abi: methodAbi,
				        humanReadableAbi: formatAbi([method]),
				        functionName: method.name,
				        // TODO we are currently defaulting to the first address in the case of no chain id
				        // There has to be a better way like providing an explicit default property in the address config
				        address: addresses[chainId] ?? Object.values(addresses)[0] ?? void 0,
				        ...maybeArgs
				      };
				    };
				    creator.address = addresses[chainId] ?? void 0;
				    creator.abi = [method];
				    creator.humanReadableAbi = formatAbi([method]);
				    return [method.name, creator];
				  })
				);

				// src/write/writeFactory.ts
				var writeFactory = ({
				  addresses,
				  methods
				}) => ({ chainId } = {}) => Object.fromEntries(
				  methods.map((method) => {
				    const creator = (...args) => {
				      const methodAbi = methods.filter(
				        (m) => m.name === method?.name
				      );
				      const maybeArgs = args.length > 0 ? { args } : {};
				      return {
				        abi: methodAbi,
				        humanReadableAbi: formatAbi([method]),
				        functionName: method.name,
				        // TODO we are currently defaulting to the first address in the case of no chain id
				        // There has to be a better way like providing an explicit default property in the address config
				        address: addresses[chainId] ?? Object.values(addresses)[0] ?? void 0,
				        ...maybeArgs
				      };
				    };
				    creator.address = addresses[chainId] ?? void 0;
				    creator.abi = [method];
				    creator.humanReadableAbi = formatAbi([method]);
				    return [method.name, creator];
				  })
				);

				// src/evmtsContractFactory.ts
				var evmtsContractFactory = ({
				  abi,
				  name,
				  addresses,
				  bytecode
				}) => {
				  const methods = abi.filter((field) => {
				    return field.type === \\"function\\";
				  });
				  return {
				    name,
				    abi,
				    humanReadableAbi: formatAbi(abi),
				    addresses,
				    bytecode,
				    // TODO make this more internally typesafe
				    events: eventsFactory({ abi, addresses }),
				    // TODO make this more internally typesafe
				    write: writeFactory({ addresses, methods }),
				    // TODO make this more internally typesafe
				    read: readFactory({ addresses, methods })
				  };
				};
				// Annotate the CommonJS export names for ESM import in node:
				0 && (module.exports = {
				  evmtsContractFactory
				});
				//# sourceMappingURL=index.cjs.map
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"bytecode\\":\\"\\",\\"addresses\\":{}}
				export const TestContract = evmtsContractFactory(_TestContract)"
			`)
		})
	})
})
