import type { Abi } from 'abitype';
type HexNumber = `0x${string}`;
type SolcAst = any;
export type SolcLanguage = 'Solidity' | 'Yul' | 'SolidityAST';
export type SolcInputSource = {
    keccak256?: HexNumber;
    ast?: SolcAst;
} & ({
    urls: string[];
} | {
    content: string;
});
export type SolcRemapping = Array<`${string}=${string}`>;
export type SolcYulDetails = {
    stackAllocation?: boolean;
    optimizerSteps: string;
};
export type SolcOptimizerDetails = {
    peephole: boolean;
    inliner: boolean;
    jumpdestRemover: boolean;
    orderLiterals: boolean;
    deduplicate: boolean;
    cse: boolean;
    constantOptimizer: boolean;
    yul: boolean;
    yulDetails: SolcYulDetails;
};
export type SolcOptimizer = {
    enabled?: boolean;
    runs: number;
    details: SolcOptimizerDetails;
};
declare const fileLevelOption: "";
export type SolcOutputSelection = {
    [fileName: string]: {
        [fileLevelOption]?: Array<'ast'>;
    } & {
        [contractName: Exclude<string, typeof fileLevelOption>]: Array<'abi' | 'ast' | 'devdoc' | 'evm.assembly' | 'evm.bytecode' | 'evm.bytecode.functionDebugData' | 'evm.bytecode.generatedSources' | 'evm.bytecode.linkReferences' | 'evm.bytecode.object' | 'evm.bytecode.opcodes' | 'evm.bytecode.sourceMap' | 'evm.deployedBytecode' | 'evm.deployedBytecode.immutableReferences' | 'evm.deployedBytecode.sourceMap' | 'evm.deployedBytecode.opcodes' | 'evm.deployedBytecode.object' | 'evm.gasEstimates' | 'evm.methodIdentifiers' | 'evm.legacyAssembly' | 'evm.methodIdentifiers' | 'evm.storageLayout' | 'ewasm.wasm' | 'ewasm.wast' | 'ir' | 'irOptimized' | 'metadata' | 'storageLayout' | 'userdoc' | '*'>;
    };
};
export type SolcModelCheckerContracts = {
    [fileName: `${string}.sol`]: string[];
};
export type SolcModelChecker = {
    contracts: SolcModelCheckerContracts;
    divModNoSlacks?: boolean;
    engine?: 'all' | 'bmc' | 'chc' | 'none';
    extCalls: 'trusted' | 'untrusted';
    invariants: Array<'contract' | 'reentrancy'>;
    showProved?: boolean;
    showUnproved?: boolean;
    showUnsupported?: boolean;
    solvers: Array<'cvc4' | 'smtlib2' | 'z3'>;
    targets?: Array<'underflow' | 'overflow' | 'assert'>;
    timeout?: boolean;
};
export type SolcDebugSettings = {
    revertStrings?: 'default' | 'strip' | 'debug' | 'verboseDebug';
    debugInfo?: Array<'location' | 'snippet' | '*'>;
};
export type SolcMetadataSettings = {
    appendCBOR?: boolean;
    useLiteralContent?: boolean;
    bytecodeHash?: 'ipfs' | 'bzzr1' | 'none';
};
export type SolcSettings = {
    stopAfter?: 'parsing';
    remappings?: SolcRemapping;
    optimizer?: SolcOptimizer;
    evmVersion?: 'byzantium' | 'constantinople' | 'petersburg' | 'istanbul' | 'berlin' | 'london' | 'paris';
    viaIR?: boolean;
    debug?: SolcDebugSettings;
    metadata?: SolcMetadataSettings;
    libraries?: Record<string, Record<string, string>>;
    outputSelection: SolcOutputSelection;
    modelChecker?: SolcModelChecker;
};
export type SolcInputSourcesDestructibleSettings = {
    keccak256?: HexNumber;
    content: string;
};
export type SolcInputSources = {
    [globalName: string]: SolcInputSource & {
        destructible?: SolcInputSourcesDestructibleSettings;
    };
};
export type SolcInputDescription = {
    language: SolcLanguage;
    sources: SolcInputSources;
    settings?: SolcSettings;
};
export type SolcOutput = {
    errors?: SolcErrorEntry[];
    sources: {
        [sourceFile: string]: SolcSourceEntry;
    };
    contracts: {
        [sourceFile: string]: {
            [contractName: string]: SolcContractOutput;
        };
    };
};
export type SolcErrorEntry = {
    sourceLocation?: SolcSourceLocation;
    secondarySourceLocations?: SolcSecondarySourceLocation[];
    type: string;
    component: string;
    severity: 'error' | 'warning' | 'info';
    errorCode?: string;
    message: string;
    formattedMessage?: string;
};
export type SolcSourceLocation = {
    file: string;
    start: number;
    end: number;
};
export type SolcSecondarySourceLocation = SolcSourceLocation & {
    message: string;
};
export type SolcSourceEntry = {
    id: number;
    ast: any;
};
export type SolcContractOutput = {
    abi: Abi;
    metadata: string;
    userdoc: {
        methods?: Record<string, {
            notice: string;
        }>;
        kind: 'user';
        notice?: string;
        version: number;
    };
    devdoc: any;
    ir: string;
    storageLayout: {
        storage: any[];
        types: any;
    };
    evm: SolcEVMOutput;
    ewasm: SolcEwasmOutput;
};
export type SolcEVMOutput = {
    assembly: string;
    legacyAssembly: any;
    bytecode: SolcBytecodeOutput;
    methodIdentifiers: {
        [functionSignature: string]: string;
    };
    gasEstimates: SolcGasEstimates;
};
export type SolcBytecodeOutput = {
    functionDebugData: {
        [functionName: string]: SolcFunctionDebugData;
    };
    object: string;
    opcodes: string;
    sourceMap: string;
    generatedSources: SolcGeneratedSource[];
    linkReferences: {
        [fileName: string]: {
            [libraryName: string]: Array<{
                start: number;
                length: number;
            }>;
        };
    };
} & Omit<SolcDeployedBytecodeOutput, 'immutableReferences'>;
export type SolcDeployedBytecodeOutput = {
    immutableReferences: {
        [astID: string]: Array<{
            start: number;
            length: number;
        }>;
    };
};
export type SolcFunctionDebugData = {
    entryPoint?: number;
    id?: number | null;
    parameterSlots?: number;
    returnSlots?: number;
};
export type SolcGeneratedSource = {
    ast: any;
    contents: string;
    id: number;
    language: string;
    name: string;
};
export type SolcGasEstimates = {
    creation: {
        codeDepositCost: string;
        executionCost: string;
        totalCost: string;
    };
    external: {
        [functionSignature: string]: string;
    };
    internal: {
        [functionSignature: string]: string;
    };
};
export type SolcEwasmOutput = {
    wast: string;
    wasm: string;
};
export {};
