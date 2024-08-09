/**
 * A mapping of use case to framworks
 */
export declare const frameworksByUseCase: {
    readonly all: {
        readonly type: "multiple-choice";
        readonly prompt: "Pick a template";
        readonly stateKey: "framework";
        readonly choices: {
            readonly simple: {
                readonly value: "simple";
                readonly label: "simple - Bare bones EVMts project";
            };
            readonly bun: {
                readonly value: "bun";
                readonly label: "bun: Fast-growing Node.js alternative emphasizing peformance";
            };
            readonly cli: {
                readonly value: "server";
                readonly label: "cli: Ethereum CLI application using clack";
            };
            readonly mud: {
                readonly value: "mud";
                readonly label: "mud(recommended) - Ethereum framework for ambitious applications";
            };
            readonly pwa: {
                readonly value: "pwa";
                readonly label: "pwa - Simple React+Vite PWA";
            };
            readonly next: {
                readonly value: "next";
                readonly label: "next - The most popular react framework";
            };
            readonly remix: {
                readonly value: "remix";
                readonly label: "remix - React framework emphasizing tighter integration with the web platform";
            };
            readonly server: {
                readonly value: "server";
                readonly label: "server: A fastify Node.js server";
            };
        };
    };
    readonly simple: {
        readonly stateKey: "framework";
        readonly type: "multiple-choice";
        readonly prompt: "Pick a template (hit arrow left to go back)";
        readonly choices: {
            readonly simple: {
                readonly value: "simple";
                readonly label: "simple - Bare bones EVMts project";
            };
            readonly bun: {
                readonly value: "bun";
                readonly label: "bun: Fast-growing Node.js alternative emphasizing peformance";
            };
        };
    };
    readonly server: {
        readonly stateKey: "framework";
        readonly type: "multiple-choice";
        readonly prompt: "Pick a server template (hit arrow left to go back)";
        readonly choices: {
            readonly server: {
                readonly value: "server";
                readonly label: "server: A fastify Node.js server";
            };
        };
    };
    readonly ui: {
        readonly stateKey: "framework";
        readonly type: "multiple-choice";
        readonly prompt: "Pick a UI template (hit arrow left to go back)";
        readonly choices: {
            readonly pwa: {
                readonly value: "pwa";
                readonly label: "pwa - Simple React+Vite PWA";
            };
            readonly mud: {
                readonly value: "mud";
                readonly label: "mud(recommended) - Ethereum framework for ambitious applications";
            };
            readonly next: {
                readonly value: "next";
                readonly label: "next - The most popular react framework";
            };
            readonly remix: {
                readonly value: "remix";
                readonly label: "remix - React framework emphasizing tighter integration with the web platform";
            };
        };
    };
};
//# sourceMappingURL=frameworksByUseCase.d.ts.map