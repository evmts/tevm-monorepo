/**
 * ./types.ts
 * @typedef {import('./types.js').Artifacts} Artifacts
 * @typedef {import('./types.js').CompiledContracts} CompiledContracts
 * @typedef {import('./types.js').FileAccessObject} FileAccessObject
 * @typedef {import('./types.js').Logger} Logger
 * @typedef {import('./types.js').ModuleInfo} ModuleInfo
 */
/**
 * ./solcTypes.ts
 * @typedef {import('./solcTypes.js').SolcOutput} SolcOutput
 * @typedef {import('./solcTypes.js').SolcLanguage} SolcLanguage
 * @typedef {import('./solcTypes.js').SolcSettings} SolcSettings
 * @typedef {import('./solcTypes.js').SolcEVMOutput} SolcEVMOutput
 * @typedef {import('./solcTypes.js').SolcOptimizer} SolcOptimizer
 * @typedef {import('./solcTypes.js').SolcRemapping} SolcRemapping
 * @typedef {import('./solcTypes.js').SolcErrorEntry} SolcErrorEntry
 * @typedef {import('./solcTypes.js').SolcYulDetails} SolcYulDetails
 * @typedef {import('./solcTypes.js').SolcEwasmOutput} SolcEwasmOutput
 * @typedef {import('./solcTypes.js').SolcInputSource} SolcInputSource
 * @typedef {import('./solcTypes.js').SolcSourceEntry} SolcSourceEntry
 * @typedef {import('./solcTypes.js').SolcGasEstimates} SolcGasEstimates
 * @typedef {import('./solcTypes.js').SolcInputSources} SolcInputSources
 * @typedef {import('./solcTypes.js').SolcModelChecker} SolcModelChecker
 * @typedef {import('./solcTypes.js').SolcDebugSettings} SolcDebugSettings
 * @typedef {import('./solcTypes.js').SolcBytecodeOutput} SolcBytecodeOutput
 * @typedef {import('./solcTypes.js').SolcContractOutput} SolcContractOutput
 * @typedef {import('./solcTypes.js').SolcSourceLocation} SolcSourceLocation
 * @typedef {import('./solcTypes.js').SolcOutputSelection} SolcOutputSelection
 * @typedef {import('./solcTypes.js').SolcInputDescription} SolcInputDescription
 * @typedef {import('./solcTypes.js').SolcMetadataSettings} SolcMetadataSettings
 * @typedef {import('./solcTypes.js').SolcOptimizerDetails} SolcOptimizerDetails
 * @typedef {import('./solcTypes.js').SolcFunctionDebugData} SolcFunctionDebugData
 * @typedef {import('./solcTypes.js').SolcModelCheckerContracts} SolcModelCheckerContracts
 * @typedef {import('./solcTypes.js').SolcDeployedBytecodeOutput} SolcDeployedBytecodeOutput
 * @typedef {import('./solcTypes.js').SolcSecondarySourceLocation} SolcSecondarySourceLocation
 * @typedef {import('./solcTypes.js').SolcInputSourcesDestructibleSettings} SolcInputSourcesDestructibleSettings
 */
export { resolveArtifacts } from './resolveArtifacts.js'
export { resolveArtifactsSync } from './resolveArtifactsSync.js'
export { solcCompile } from './solc.js'
