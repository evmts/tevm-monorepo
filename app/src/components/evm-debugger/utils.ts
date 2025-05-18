import { invoke } from "@tauri-apps/api/core";
import { EvmState } from "./types";

export async function loadBytecode(bytecodeHex: string): Promise<void> {
  try {
    await invoke<void>("loadBytecode", { bytecodeHex });
  } catch (err) {
    throw new Error(`Failed to load bytecode: ${err}`);
  }
}

export async function resetEvm(): Promise<EvmState> {
  try {
    await invoke<void>("resetEvm");
    return await getEvmState();
  } catch (err) {
    throw new Error(`Failed to reset EVM: ${err}`);
  }
}

export async function stepEvm(): Promise<EvmState> {
  try {
    return await invoke<EvmState>("stepEvm");
  } catch (err) {
    throw new Error(`Failed to step: ${err}`);
  }
}

export async function toggleRunPause(): Promise<EvmState> {
  try {
    return await invoke<EvmState>("toggleRunPause");
  } catch (err) {
    throw new Error(`Failed to toggle run/pause: ${err}`);
  }
}

export async function getEvmState(): Promise<EvmState> {
  try {
    return await invoke<EvmState>("getEvmState");
  } catch (err) {
    throw new Error(`Failed to get state: ${err}`);
  }
}

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
};