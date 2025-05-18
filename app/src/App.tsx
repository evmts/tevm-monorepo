import {
  createSignal,
  createEffect,
  Show,
  onCleanup,
  onMount,
} from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { EvmState } from "./types";
import { Header } from "./components/Header";
import { BytecodeLoader } from "./components/BytecodeLoader";
import { ControlsToolbar } from "./components/ControlsToolbar";
import { StateSummary } from "./components/StateSummary";
import { StackPanel } from "./components/panels/StackPanel";
import { MemoryPanel } from "./components/panels/MemoryPanel";
import { StoragePanel } from "./components/panels/StoragePanel";
import { LogsPanel } from "./components/panels/LogsPanel";
import { ErrorAlert } from "./components/ErrorAlert";
import { CopyToast } from "./components/CopyToast";

export default function App() {
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
  const [activePanel, setActivePanel] = createSignal<"all" | "stack" | "memory" | "storage" | "logs">("all");

  // Check system preference for dark mode
  onMount(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Listen for changes in system preference
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    onCleanup(() => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    });
  });

  // Effect to update dark mode class
  createEffect(() => {
    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  // Tauri invoke functions
  async function loadBytecodeHandler() {
    try {
      setError("");
      await invoke<void>("loadBytecode", { bytecodeHex: bytecode() });
      await resetEvmHandler();
    } catch (err) {
      setError(`Failed to load bytecode: ${err}`);
    }
  }

  async function resetEvmHandler() {
    try {
      setError("");
      setIsRunning(false);
      await invoke<void>("resetEvm");
      const freshState = await invoke<EvmState>("getEvmState");
      setState(freshState);
    } catch (err) {
      setError(`Failed to reset EVM: ${err}`);
    }
  }

  async function stepEvmHandler() {
    try {
      setError("");
      setIsUpdating(true);
      const newState = await invoke<EvmState>("stepEvm");
      setState(newState);
      setTimeout(() => setIsUpdating(false), 50);
    } catch (err) {
      setError(`Failed to step: ${err}`);
      setIsUpdating(false);
    }
  }

  async function toggleRunPauseHandler() {
    try {
      setError("");
      setIsRunning(!isRunning());
      const newState = await invoke<EvmState>("toggleRunPause");
      setState(newState);
    } catch (err) {
      setError(`Failed to toggle run/pause: ${err}`);
      setIsRunning(false);
    }
  }

  async function refreshStateHandler() {
    try {
      const freshState = await invoke<EvmState>("getEvmState");
      setState(freshState);
    } catch (err) {
      setError(`Failed to get state: ${err}`);
    }
  }

  // Auto-refresh state when running
  createEffect(() => {
    if (!isRunning()) return;

    const interval = setInterval(refreshStateHandler, 100);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  // Keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle shortcuts when not typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (e.key === "r" || e.key === "R") {
      resetEvmHandler();
    } else if (e.key === "s" || e.key === "S") {
      stepEvmHandler();
    } else if (e.key === " ") {
      e.preventDefault();
      toggleRunPauseHandler();
    } else if (e.key === "d" && e.ctrlKey) {
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

  // Copy to clipboard helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  // Sample contracts
  const sampleContracts = [
    {
      name: "Counter Contract",
      description: "Simple counter with get, increment, and set functions",
      bytecode:
        "0x608060405234801561001057600080fd5b5060f78061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632e64cec114604157806343d726d61460545780636057361d146058575b600080fd5b60476072565b604051605291906085565b60405180910390f35b605660a0565b005b606a60663660046098565b60ab565b005b60008054905090565b6000808055905090565b600080549055565b60008135905060928160b5565b92915050565b60006020828403121560a957600080fd5b5051919050565b6000819050919050565b60bb8160b5565b811460c557600080fd5b5056fea2646970667358221220223a78f5a4128297c82b9a0c68aaa7697e9df75f8b9856bbd05ed0cacfc7c64764736f6c63430008090033",
    },
    {
      name: "Simple Storage",
      description: "Store and retrieve a value",
      bytecode:
        "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea264697066735822122044f0132d3ce474198482cc3f79c22d7ed4cece5e1dcbb2c7cb533a23ca9d9d5364736f6c63430008120033",
    },
    {
      name: "ERC20 Token",
      description: "Basic ERC20 token implementation",
      bytecode:
        "0x60806040523480156200001157600080fd5b506040516200153938038062001539833981810160405281019062000037919062000342565b818181600390805190602001906200005192919062000199565b5080600490805190602001906200006a92919062000199565b5050506200008f3362000083600a62000104602090811b901c565b6200011760201b60201c565b5050620004a4565b6000806000838501905084811015620000fe576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f536166654d6174683a206d756c206f766572666c6f770000000000000000000081525060200191505060405180910390fd5b8091505092915050565b600081600a0a90509190505565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415620001ba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f45524332303a206d696e7420746f20746865207a65726f20616464726573730081525060200191505060405180910390fd5b620001d6816002546200027d60201b620008011790919060201c565b6002819055506200023e816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546200027d60201b620008011790919060201c565b6000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050565b6000808284019050838110156200027357fe5b8091505092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620002dc57805160ff19168380011785556200030d565b828001600101855582156200030d579182015b828111156200030c578251825591602001919060010190620002ef565b5b5090506200031c919062000320565b5090565b5b808211156200033b57600081600090555060010162000321565b5090565b600080604083850312156200035657600080fd5b600082015167ffffffffffffffff8111156200037157600080fd5b6200037f8582860162000447565b925050602082015167ffffffffffffffff8111156200039d57600080fd5b620003ab8582860162000447565b9150509250929050565b600062000402826200039c565b620004048185620003a7565b93506200041681856020860162000417565b80840191505092915050565b6000620004308262000396565b620004328185620003a7565b93506200044481856020860162000417565b9150819050919050565b600061ffff82169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600074ffffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b83811015620004b85780820151818401526020810190506200049b565b83811115620004c8576000848401525b50505050565b6110658062000c4483390190565b61108f80620004b48339019056fe608060405234801561001057600080fd5b506040516110653803806110658339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506110d7806100946000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063313ce56711610066578063313ce5671461022557806370a082311461024957806395d89b41146102a1578063a9059cbb14610324578063dd62ed3e1461038a57610093565b806306fdde0314610098578063095ea7b31461011b57806318160ddd1461018157806323b872dd1461019f575b600080fd5b6100a0610402565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100e05780820151818401526020810190506100c5565b50505050905090810190601f16801561010d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101676004803603604081101561013157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506104a0565b604051808215151515815260200191505060405180910390f35b610189610588565b6040518082815260200191505060405180910390f35b61020b600480360360608110156101b557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610592565b604051808215151515815260200191505060405180910390f35b61022d61092a565b604051808260ff1660ff16815260200191505060405180910390f35b61028b6004803603602081101561025f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061093d565b6040518082815260200191505060405180910390f35b6102a9610986565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102e95780820151818401526020810190506102ce565b50505050905090810190601f1680156103165780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6103706004803603604081101561033a57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610a24565b604051808215151515815260200191505060405180910390f35b6103ec600480360360408110156103a057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c8f565b6040518082815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104985780601f1061046d57610100808354040283529160200191610498565b820191906000526020600020905b81548152906001019060200180831161047b57829003601f168201915b505050505081565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561052d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806110826022913960400191505060405180910390fd5b81600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b6000600254905090565b60006105e382600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610d1690919063ffffffff16565b600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610670848484610db0565b3373ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a3600190509392505050565b600360009054906101000a900460ff1681565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561097b57600254905061098156fe",
    },
  ];

  return (
    <div class="min-h-screen transition-colors duration-300">
      <div class="min-h-screen">
        <Header
          isDarkMode={isDarkMode()}
          setIsDarkMode={setIsDarkMode}
          showSample={showSample()}
          setShowSample={setShowSample}
          setBytecode={setBytecode}
          sampleContracts={sampleContracts}
        />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <ErrorAlert error={error()} setError={setError} />

          <BytecodeLoader
            bytecode={bytecode()}
            setBytecode={setBytecode}
            loadBytecodeHandler={loadBytecodeHandler}
          />

          <ControlsToolbar
            resetEvmHandler={resetEvmHandler}
            stepEvmHandler={stepEvmHandler}
            toggleRunPauseHandler={toggleRunPauseHandler}
            isRunning={isRunning()}
          />

          <StateSummary
            state={state()}
            isUpdating={isUpdating()}
          />

          <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Show when={activePanel() === "all" || activePanel() === "stack"}>
              <StackPanel
                stack={state().stack}
                copyToClipboard={copyToClipboard}
              />
            </Show>

            <Show when={activePanel() === "all" || activePanel() === "memory"}>
              <MemoryPanel
                memory={state().memory}
                copyToClipboard={copyToClipboard}
              />
            </Show>

            <Show when={activePanel() === "all" || activePanel() === "storage"}>
              <StoragePanel
                storage={state().storage}
                copyToClipboard={copyToClipboard}
              />
            </Show>

            <Show when={activePanel() === "all" || activePanel() === "logs"}>
              <LogsPanel
                logs={state().logs}
                returnData={state().returnData}
                copyToClipboard={copyToClipboard}
              />
            </Show>
          </div>
        </div>

        <CopyToast copied={copied()} />
      </div>
    </div>
  );
}
