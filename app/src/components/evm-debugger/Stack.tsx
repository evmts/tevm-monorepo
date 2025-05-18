import { Component, Show, Setter, For } from "solid-js";
import { EvmState } from "./types";
import { copyToClipboard } from "./utils";

interface StackProps {
  state: EvmState;
  copied: string;
  setCopied: Setter<string>;
}

const Stack: Component<StackProps> = (props) => {
  const handleCopy = (item: string, index: number) => {
    copyToClipboard(item);
    props.setCopied(`Stack[${props.state.stack.length - 1 - index}]`);
    setTimeout(() => props.setCopied(""), 2000);
  };

  return (
    <div class="bg-white dark:bg-[#252525] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h2 class="text-sm font-medium text-gray-900 dark:text-white">Stack ({props.state.stack.length})</h2>
        <div class="text-xs text-gray-500 dark:text-gray-400">Top of stack at bottom</div>
      </div>
      <div class="p-0 max-h-[300px] overflow-y-auto">
        <Show
          when={props.state.stack.length > 0}
          fallback={
            <div class="p-8 text-sm text-gray-500 dark:text-gray-400 italic flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M10 4v4" />
                <path d="M2 8h20" />
                <path d="M6 12h.01" />
                <path d="M10 12h.01" />
                <path d="M14 12h.01" />
                <path d="M18 12h.01" />
                <path d="M6 16h.01" />
                <path d="M10 16h.01" />
                <path d="M14 16h.01" />
                <path d="M18 16h.01" />
              </svg>
              Stack is empty
            </div>
          }
        >
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <For each={[...props.state.stack].reverse()}>
              {(item, index) => (
                <div class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2D2D2D] transition-colors flex justify-between group">
                  <div class="flex items-center">
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400 w-8">
                      {props.state.stack.length - 1 - index()}:
                    </span>
                    <span class="font-mono text-sm text-gray-900 dark:text-white ml-2">{item}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(item, index())}
                    class="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Copy to clipboard"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default Stack;