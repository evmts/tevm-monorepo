import { Show } from "solid-js";

interface ErrorAlertProps {
  error: string;
  setError: (value: string) => void;
}

export const ErrorAlert = (props: ErrorAlertProps) => {
  return (
    <Show when={props.error}>
      <div class="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-800 dark:text-red-300 rounded-lg flex justify-between items-center shadow-sm">
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-3 text-red-500 dark:text-red-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{props.error}</span>
        </div>
        <button
          onClick={() => props.setError("")}
          class="text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full p-1 transition-colors"
          aria-label="Dismiss error"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </Show>
  );
};