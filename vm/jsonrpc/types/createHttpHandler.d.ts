/// <reference types="node" resolution-mode="require"/>
/// <reference types="bun-types" />
import type { EVM } from '@ethereumjs/evm';
import type { IncomingMessage, ServerResponse } from 'http';
type CreatehttpHandlerParameters = {
    evm: EVM;
    forkUrl?: string;
};
/**
 * Creates an http request handler for tevm requests
 */
export declare function createHttpHandler({ evm, forkUrl }: CreatehttpHandlerParameters): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export {};
//# sourceMappingURL=createHttpHandler.d.ts.map