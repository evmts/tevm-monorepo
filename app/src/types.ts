export interface EvmState {
  pc: number; // program counter
  opcode: string; // e.g. "PUSH1", "ADD"
  gasLeft: number; // remaining gas
  depth: number; // call depth
  stack: string[]; // hex values, top last
  memory: string; // full 0x… hex dump
  storage: Record<string, string>;
  logs: string[]; // JSON-encoded events
  returnData: string; // hex buffer
}

export interface SampleContract {
  name: string;
  description: string;
  bytecode: string;
}