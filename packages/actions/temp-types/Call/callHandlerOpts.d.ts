export function callHandlerOpts(client: import("@tevm/node").TevmNode, params: import("./CallParams.js").CallParams): Promise<{
    data: Parameters<import("@tevm/evm").Evm["runCall"]>[0];
    errors?: never;
} | {
    data?: never;
    errors: Array<CallHandlerOptsError>;
}>;
export type CallHandlerOptsError = UnknownBlockError | UnknownBlockError | InvalidParamsError;
import { UnknownBlockError } from '@tevm/errors';
import { InvalidParamsError } from '@tevm/errors';
//# sourceMappingURL=callHandlerOpts.d.ts.map