import { args } from './args.js';
import { options } from './options.js';
export declare const command: {
    args: import("zod").ZodTuple<[import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodString>>], null>;
    options: import("zod").ZodObject<{
        skipPrompts: import("zod").ZodDefault<import("zod").ZodBoolean>;
        walletConnectProjectId: import("zod").ZodDefault<import("zod").ZodString>;
        packageManager: import("zod").ZodDefault<import("zod").ZodEnum<["pnpm", "npm", "bun", "yarn"]>>;
        useCase: import("zod").ZodDefault<import("zod").ZodEnum<["simple", "ui", "server"]>>;
        framework: import("zod").ZodDefault<import("zod").ZodEnum<["simple", "mud", "server", "pwa", "next", "remix", "bun"]>>;
        noGit: import("zod").ZodDefault<import("zod").ZodBoolean>;
        noInstall: import("zod").ZodDefault<import("zod").ZodBoolean>;
    }, "strip", import("zod").ZodTypeAny, {
        walletConnectProjectId: string;
        useCase: "simple" | "ui" | "server";
        packageManager: "npm" | "pnpm" | "bun" | "yarn";
        framework: "simple" | "server" | "bun" | "mud" | "pwa" | "next" | "remix";
        skipPrompts: boolean;
        noGit: boolean;
        noInstall: boolean;
    }, {
        walletConnectProjectId?: string | undefined;
        useCase?: "simple" | "ui" | "server" | undefined;
        packageManager?: "npm" | "pnpm" | "bun" | "yarn" | undefined;
        framework?: "simple" | "server" | "bun" | "mud" | "pwa" | "next" | "remix" | undefined;
        skipPrompts?: boolean | undefined;
        noGit?: boolean | undefined;
        noInstall?: boolean | undefined;
    }>;
    Component: import("react").FC<{
        options: import("zod").TypeOf<typeof options>;
        args: import("zod").TypeOf<typeof args>;
    }>;
};
//# sourceMappingURL=index.d.ts.map