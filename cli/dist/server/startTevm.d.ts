import { options as optionsSchema } from './options.js';
import { z } from 'zod';
export declare const startTevm: (options: z.infer<typeof optionsSchema>) => Promise<{
    transport: {
        config: import("viem").TransportConfig<string>;
        request: import("@tevm/decorators").EIP1193RequestFn;
        value: {
            tevm: import("@tevm/base-client").BaseClient & {
                request: import("@tevm/decorators").EIP1193RequestFn;
            };
        };
    };
    server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
}>;
//# sourceMappingURL=startTevm.d.ts.map