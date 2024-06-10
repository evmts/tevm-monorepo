import type { AccountNotFoundError } from "@tevm/errors";
import type { ValidateGetAccountParamsError } from "../zod/validators/validateGetAccountParams.js";

export type TevmGetAccountError = AccountNotFoundError | ValidateGetAccountParamsError
