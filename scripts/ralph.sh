#!/bin/bash
# Ralph - Autonomous Voltaire/Guillotine Migration Agent
# Runs Claude Code in a loop to incrementally migrate tevm from viem/ethereumjs to voltaire/guillotine-mini

set -e

# Configuration
ITERATION=0
MAX_ITERATIONS=${MAX_ITERATIONS:-999999}  # Run forever by default
LOG_DIR="$HOME/tevm-monorepo/.claude/ralph-logs"
SLEEP_BETWEEN=${SLEEP_BETWEEN:-5}  # Seconds between iterations

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create log directory
mkdir -p "$LOG_DIR"

# The migration prompt
PROMPT='You are Ralph, an autonomous migration agent. Your mission is to incrementally migrate tevm to use @tevm/voltaire and guillotine-mini, removing viem and ethereumjs dependencies from core packages.

## Context
- **voltaire** (lib/voltaire): Ethereum primitives library with branded types (Address, Hex, Uint, Transaction, RLP, ABI, Keccak256, etc.)
- **guillotine-mini** (lib/guillotine-mini): Minimal spec-compliant EVM in Zig with WASM support

## Migration Goals
1. Replace viem imports with @tevm/voltaire equivalents
2. Replace ethereumjs imports with guillotine-mini where applicable
3. Focus on core packages: @tevm/actions, @tevm/vm, @tevm/evm, @tevm/state, @tevm/node
4. Maintain backward compatibility where possible
5. Keep tests passing

## Strategy for Each Iteration
1. **Assess**: Check current migration status - what viem/ethereumjs imports remain?
2. **Target**: Pick ONE small, focused migration task (one file or one import pattern)
3. **Implement**: Make the minimal change needed
4. **Test**: Run relevant tests to verify nothing broke
5. **Commit**: If successful, commit the change with a descriptive message

## Rules
- Make SMALL incremental changes - one file or one import pattern at a time
- Always run tests after changes
- If tests fail, revert and try a different approach
- Focus on low-hanging fruit first (simple type replacements)
- Document any blockers or missing voltaire features you discover
- Use `pnpm nx run-many --targets=build:dist,build:types` to build
- Use `vitest run <path>` to test specific files

## Current Session
Look at what was done in previous iterations (check .claude/ralph-logs/) and continue the migration.
If this is a fresh start, begin by:
1. Running `grep -r "from '\''viem'\''" packages/ --include="*.ts" --include="*.js" | head -50` to find viem imports
2. Picking ONE file to migrate
3. Making the change and testing

Remember: Small, incremental, tested changes. Quality over quantity.'

# Print banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║   ██████╗  █████╗ ██╗     ██████╗ ██╗  ██╗                   ║"
    echo "║   ██╔══██╗██╔══██╗██║     ██╔══██╗██║  ██║                   ║"
    echo "║   ██████╔╝███████║██║     ██████╔╝███████║                   ║"
    echo "║   ██╔══██╗██╔══██║██║     ██╔═══╝ ██╔══██║                   ║"
    echo "║   ██║  ██║██║  ██║███████╗██║     ██║  ██║                   ║"
    echo "║   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝                   ║"
    echo "║                                                               ║"
    echo "║   Voltaire/Guillotine Migration Agent                        ║"
    echo "║   Running autonomous migration loop...                        ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Log with timestamp
log() {
    local level=$1
    local msg=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    case $level in
        INFO)  echo -e "${GREEN}[$timestamp]${NC} $msg" ;;
        WARN)  echo -e "${YELLOW}[$timestamp]${NC} $msg" ;;
        ERROR) echo -e "${RED}[$timestamp]${NC} $msg" ;;
        *)     echo "[$timestamp] $msg" ;;
    esac
}

# Run a single iteration
run_iteration() {
    local iter=$1
    local log_file="$LOG_DIR/iteration-$(printf '%05d' $iter)-$(date '+%Y%m%d-%H%M%S').log"

    log INFO "Starting iteration $iter"
    log INFO "Log file: $log_file"

    # Run claude with the prompt
    # Using --dangerously-skip-permissions to allow autonomous operation
    # The prompt guides claude to make safe, incremental changes
    if claude --dangerously-skip-permissions -p "$PROMPT" 2>&1 | tee "$log_file"; then
        log INFO "Iteration $iter completed successfully"
        return 0
    else
        log WARN "Iteration $iter exited with non-zero status"
        return 1
    fi
}

# Cleanup on exit
cleanup() {
    log INFO "Received interrupt signal, shutting down gracefully..."
    exit 0
}

trap cleanup SIGINT SIGTERM

# Main loop
main() {
    print_banner

    log INFO "Starting Ralph - Voltaire/Guillotine Migration Agent"
    log INFO "Max iterations: $MAX_ITERATIONS"
    log INFO "Sleep between iterations: ${SLEEP_BETWEEN}s"
    log INFO "Log directory: $LOG_DIR"
    log INFO "Press Ctrl+C to stop"
    echo ""

    while [ $ITERATION -lt $MAX_ITERATIONS ]; do
        ITERATION=$((ITERATION + 1))

        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        log INFO "ITERATION $ITERATION / $MAX_ITERATIONS"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

        run_iteration $ITERATION

        if [ $ITERATION -lt $MAX_ITERATIONS ]; then
            log INFO "Sleeping ${SLEEP_BETWEEN}s before next iteration..."
            sleep $SLEEP_BETWEEN
        fi
    done

    log INFO "Completed all $MAX_ITERATIONS iterations"
}

# Run
main "$@"
