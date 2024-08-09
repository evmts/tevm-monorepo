import React from 'react';
import { z } from 'zod';
import { options as optionsSchema } from './options.js';
type ServerProps = {
    options: z.infer<typeof optionsSchema>;
};
export declare const Server: React.FC<ServerProps>;
export {};
//# sourceMappingURL=Server.d.ts.map