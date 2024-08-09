import { z } from 'zod';
export declare const options: z.ZodObject<{
    skipPrompts: z.ZodDefault<z.ZodBoolean>;
    walletConnectProjectId: z.ZodDefault<z.ZodString>;
    packageManager: z.ZodDefault<z.ZodEnum<["pnpm", "npm", "bun", "yarn"]>>;
    useCase: z.ZodDefault<z.ZodEnum<["simple", "ui", "server"]>>;
    framework: z.ZodDefault<z.ZodEnum<["simple", "mud", "server", "pwa", "next", "remix", "bun"]>>;
    noGit: z.ZodDefault<z.ZodBoolean>;
    noInstall: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
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
//# sourceMappingURL=options.d.ts.map