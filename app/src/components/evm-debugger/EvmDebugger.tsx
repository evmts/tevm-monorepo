import { createSignal, createEffect, onCleanup, onMount, Show } from "solid-js";
import { getEvmState } from "./utils";
import { EvmState } from "./types";

import Header from "./Header";
import ErrorAlert from "./ErrorAlert";
import BytecodeLoader from "./BytecodeLoader";
import Controls from "./Controls";
import StateSummary from "./StateSummary";
import Stack from "./Stack";
import Memory from "./Memory";
import Storage from "./Storage";
import LogsAndReturn from "./LogsAndReturn";
import CopyToast from "./CopyToast";

const EvmDebugger = () => {
  // State signals
  const [bytecode, setBytecode] = createSignal("0x");
  const [state, setState] = createSignal<EvmState>({
    pc: 0,
    opcode: "-",
    gasLeft: 0,
    depth: 0,
    stack: [],
    memory: "0x",
    storage: {},
    logs: [],
    returnData: "0x",
  });
  const [isRunning, setIsRunning] = createSignal(false);
  const [error, setError] = createSignal("");
  const [copied, setCopied] = createSignal("");
  const [isUpdating, setIsUpdating] = createSignal(false);
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [showSample, setShowSample] = createSignal(false);
  const [activePanel, setActivePanel] = createSignal("all");

  // Check system preference for dark mode
  onMount(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }

    // Listen for changes in system preference
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      setIsDarkMode(event.matches);
    });
  });

  // Auto-refresh state when running
  createEffect(() => {
    if (!isRunning()) return;

    const refreshState = async () => {
      try {
        const freshState = await getEvmState();
        setState(freshState);
      } catch (err) {
        setError(`Failed to get state: ${err}`);
      }
    };

    const interval = setInterval(refreshState, 100);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  // Keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle shortcuts when not typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === "r" || e.key === "R") {
      // Reset EVM
      const handleResetEvm = async () => {
        try {
          setError("");
          setIsRunning(false);
          // Reset EVM and update state
          // This would be handled by the Controls component, but we'll directly handle it here for keyboard shortcuts
        } catch (err) {
          setError(`${err}`);
        }
      };
      
      handleResetEvm();
    } else if (e.key === "s" || e.key === "S") {
      // Step EVM
      const handleStepEvm = async () => {
        try {
          setError("");
          setIsUpdating(true);
          // Step EVM and update state
          // This would be handled by the Controls component, but we'll directly handle it here for keyboard shortcuts
        } catch (err) {
          setError(`${err}`);
          setIsUpdating(false);
        }
      };
      
      handleStepEvm();
    } else if (e.key === " ") {
      // Toggle run/pause
      e.preventDefault();
      const handleToggleRunPause = async () => {
        try {
          setError("");
          setIsRunning(!isRunning());
          // Toggle run/pause and update state
          // This would be handled by the Controls component, but we'll directly handle it here for keyboard shortcuts
        } catch (err) {
          setError(`${err}`);
          setIsRunning(false);
        }
      };
      
      handleToggleRunPause();
    } else if (e.key === "d" && e.ctrlKey) {
      // Toggle dark mode
      e.preventDefault();
      setIsDarkMode(!isDarkMode());
    }
  };

  // Set up keyboard listeners
  createEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div class={`min-h-screen transition-colors duration-300 ${isDarkMode() ? "dark" : ""}`}>
      <div class="bg-white dark:bg-[#1E1E1E] min-h-screen text-gray-900 dark:text-gray-100">
        {/* Header */}
        <Header 
          showSample={showSample()} 
          setShowSample={setShowSample} 
          isDarkMode={isDarkMode()} 
          setIsDarkMode={setIsDarkMode}
          setBytecode={setBytecode}
          activePanel={activePanel()}
          setActivePanel={setActivePanel}
        />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Error Alert */}
          <ErrorAlert error={error()} setError={setError} />

          {/* Bytecode Loader */}
          <BytecodeLoader 
            bytecode={bytecode()} 
            setBytecode={setBytecode} 
            setError={setError}
            setIsRunning={setIsRunning}
            setState={setState}
          />

          {/* Controls Toolbar */}
          <Controls 
            isRunning={isRunning()} 
            setIsRunning={setIsRunning} 
            setError={setError}
            setState={setState}
            isUpdating={isUpdating()}
            setIsUpdating={setIsUpdating}
          />

          {/* State Summary Bar */}
          <StateSummary state={state()} isUpdating={isUpdating()} />

          {/* Main Content */}
          <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Stack Panel */}
            <Show when={activePanel() === "all" || activePanel() === "stack"}>
              <Stack state={state()} copied={copied()} setCopied={setCopied} />
            </Show>

            {/* Memory Panel */}
            <Show when={activePanel() === "all" || activePanel() === "memory"}>
              <Memory state={state()} copied={copied()} setCopied={setCopied} />
            </Show>

            {/* Storage Panel */}
            <Show when={activePanel() === "all" || activePanel() === "storage"}>
              <Storage state={state()} copied={copied()} setCopied={setCopied} />
            </Show>

            {/* Logs & Return Data Panel */}
            <Show when={activePanel() === "all" || activePanel() === "logs"}>
              <LogsAndReturn state={state()} copied={copied()} setCopied={setCopied} />
            </Show>
          </div>
        </div>

        {/* Copy Toast */}
        <CopyToast copied={copied()} />
      </div>
    </div>
  );
};

export default EvmDebugger;