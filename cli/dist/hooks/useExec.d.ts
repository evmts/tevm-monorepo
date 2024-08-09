export declare const useExec: (command: string, cwd: string, args: any, onSuccess: () => void, withWait?: number) => {
    data: string;
    stdout: string;
    stderr: string;
    error: string;
    exitCode: number | undefined;
    mutate: import("react").DispatchWithoutAction;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
};
//# sourceMappingURL=useExec.d.ts.map