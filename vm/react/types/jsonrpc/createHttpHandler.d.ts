/// <reference types="node" resolution-mode="require"/>
/// <reference types="bun-types" />
import type { Tevm } from '../Tevm.js';
import type { IncomingMessage, ServerResponse } from 'http';
/**
 * Creates an http request handler for tevm requests
 */
export declare function createHttpHandler(tevm: Tevm): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
//# sourceMappingURL=createHttpHandler.d.ts.map