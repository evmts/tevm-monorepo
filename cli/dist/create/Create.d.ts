import type { args } from './args.js';
import { type options } from './options.js';
import React from 'react';
import { z } from 'zod';
type Props = {
    options: z.infer<typeof options>;
    args: z.infer<typeof args>;
};
export declare const App: React.FC<Props>;
export {};
//# sourceMappingURL=Create.d.ts.map