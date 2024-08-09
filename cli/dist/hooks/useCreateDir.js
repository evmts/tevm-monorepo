import { wait } from '../utils/wait.js';
import { useMutation } from '@tanstack/react-query';
import fs from 'fs-extra';
export const useCreateDir = (appPath, onSuccess, withWait = 0) => {
    return useMutation({
        onSuccess,
        mutationFn: async () => {
            if (await fs.exists(appPath)) {
                throw new Error(`Directory ${appPath} already exists`);
            }
            await fs.mkdir(appPath, { recursive: true });
            // slowing down this resolving makes the ux better
            await wait(withWait);
        },
    });
};
