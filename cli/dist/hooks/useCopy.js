import { wait } from '../utils/wait.js';
import { useMutation } from '@tanstack/react-query';
import fs from 'fs-extra';
export const useCopy = (from, to, onSuccess, withWait = 0) => {
    return useMutation({
        onSuccess,
        mutationFn: async () => {
            fs.copySync(from, to);
            // slowing down how this resolves makes the ux better and more clear
            await wait(withWait);
        },
    });
};
