#\!/bin/bash

# Array of branches that need updating (branch_name:pr_number)
branches=(
    "feat_implement_sstore_gas_refunds:1850"
    "feat_implement_bls12_381_g1add_precompile:1849"
    "comprehensive-test-coverage:1846"
    "fix_deno_install_hang_1591:1845"
    "fix_skip_balance_bug_1612:1842"
    "fix_mining_modes_types_1461:1841"
    "feat_implement_ripemd160_precompile:1840"
    "feat_implement_ecpairing_precompile:1838"
    "feat_implement_ecmul_precompile:1837"
    "feat_implement_ecadd_precompile:1836"
    "feat_call_gas_management_claude:1835"
    "feat/blake2f-precompile-claude:1834"
    "fix_skipbalance_mining_1612:1831"
    "feat_test_matchers_implementation:1830"
    "feat_implement_selfdestruct_opcode:1808"
)

for entry in "${branches[@]}"; do
    branch_name="${entry%:*}"
    pr_number="${entry#*:}"
    
    echo "=== Updating PR #$pr_number ($branch_name) ==="
    
    # Check if we have a worktree for this branch
    worktree_path=$(git worktree list | grep "\[$branch_name\]" | awk '{print $1}')
    
    if [ -n "$worktree_path" ]; then
        echo "Found worktree at: $worktree_path"
        cd "$worktree_path"
        
        # Pull from main with no-rebase and push
        echo "Pulling from main with --no-rebase..."
        if git pull origin main --no-rebase; then
            echo "✅ Successfully merged main"
            echo "Pushing updated branch..."
            if git push; then
                echo "✅ Successfully pushed PR #$pr_number"
            else
                echo "❌ Failed to push PR #$pr_number"
            fi
        else
            echo "❌ Failed to merge main into PR #$pr_number (conflicts may need manual resolution)"
        fi
        
        # Return to original directory
        cd "/Users/williamcory/tevm/main"
    else
        echo "⚠️ No worktree found for $branch_name, trying to checkout..."
        # Try to checkout the branch if it exists
        if git show-ref --verify --quiet refs/remotes/origin/$branch_name; then
            echo "Branch exists remotely, creating worktree..."
            mkdir -p "/Users/williamcory/tevm/main/g/$branch_name"
            if git worktree add "/Users/williamcory/tevm/main/g/$branch_name" origin/$branch_name; then
                cd "/Users/williamcory/tevm/main/g/$branch_name"
                if git pull origin main --no-rebase; then
                    echo "✅ Successfully merged main"
                    echo "Pushing updated branch..."
                    if git push; then
                        echo "✅ Successfully pushed PR #$pr_number"
                    else
                        echo "❌ Failed to push PR #$pr_number"
                    fi
                else
                    echo "❌ Failed to merge main into PR #$pr_number"
                fi
                cd "/Users/williamcory/tevm/main"
            else
                echo "❌ Failed to create worktree for $branch_name"
            fi
        else
            echo "❌ Branch $branch_name not found remotely"
        fi
    fi
    
    echo ""
done
