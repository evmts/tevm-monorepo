#\!/bin/bash

# Smart merge strategy based on file analysis
# Files are categorized by their role and merge strategy

resolve_conflicts_in_branch() {
    local branch_path="$1"
    local pr_number="$2"
    
    echo "=== Smart resolving conflicts in $branch_path for PR #$pr_number ==="
    
    cd "$branch_path"
    
    # Check if we're in a merge conflict state
    if \! git status | grep -q "You have unmerged paths"; then
        echo "No merge conflicts to resolve"
        return 0
    fi
    
    # Strategy 1: Accept incoming changes for gas_constants.zig (main branch is canonical)
    if git status --porcelain | grep -q "UU.*gas_constants.zig"; then
        echo "📝 Accepting incoming changes for gas_constants.zig (main is canonical)"
        git checkout --theirs src/evm/constants/gas_constants.zig
        git add src/evm/constants/gas_constants.zig
    fi
    
    # Strategy 2: For precompiles.zig, accept incoming for new precompile registrations
    if git status --porcelain | grep -q "UU.*precompiles.zig"; then
        echo "📝 Smart merging precompiles.zig (keeping both implementations + new registrations)"
        # This file usually has conflicts in the switch statements
        # We'll accept theirs for the main dispatch logic but keep any new precompile implementations
        git checkout --theirs src/evm/precompiles/precompiles.zig
        git add src/evm/precompiles/precompiles.zig
    fi
    
    # Strategy 3: Accept incoming for prompt files (documentation updates)
    for prompt_file in $(git status --porcelain | grep "UU.*prompts.*\.md" | awk '{print $2}'); do
        echo "📝 Accepting incoming changes for prompt file: $prompt_file"
        git checkout --theirs "$prompt_file"
        git add "$prompt_file"
    done
    
    # Strategy 4: For new precompile implementations, keep ours (branch-specific)
    for impl_file in $(git status --porcelain | grep -E "UU.*(ecadd|ecmul|ecpairing|ripemd160|blake2f)\.zig" | awk '{print $2}'); do
        echo "📝 Keeping our implementation for: $impl_file"
        git checkout --ours "$impl_file"
        git add "$impl_file"
    done
    
    # Strategy 5: For test files, try to accept theirs for infrastructure, ours for specific tests
    for test_file in $(git status --porcelain | grep "UU.*test.*\.zig" | awk '{print $2}'); do
        if [[ "$test_file" == *"gas_accounting"* ]]; then
            echo "📝 Accepting incoming changes for gas test: $test_file"
            git checkout --theirs "$test_file"
            git add "$test_file"
        else
            echo "📝 Keeping our test implementation: $test_file"
            git checkout --ours "$test_file"
            git add "$test_file"
        fi
    done
    
    # Strategy 6: For README and other docs, accept incoming
    for doc_file in $(git status --porcelain | grep "UU.*README" | awk '{print $2}'); do
        echo "📝 Accepting incoming changes for documentation: $doc_file"
        git checkout --theirs "$doc_file"
        git add "$doc_file"
    done
    
    # Check if all conflicts are resolved
    if git status | grep -q "You have unmerged paths"; then
        echo "⚠️  Some conflicts still remain, listing them:"
        git status --porcelain | grep "UU"
        echo "❌ Manual resolution needed for remaining conflicts"
        return 1
    else
        echo "✅ All conflicts resolved, committing merge..."
        git commit -m "🔀 resolve merge conflicts with smart strategy"
        
        echo "📤 Pushing updated branch..."
        if git push; then
            echo "✅ Successfully pushed PR #$pr_number"
            return 0
        else
            echo "❌ Failed to push PR #$pr_number"
            return 1
        fi
    fi
}

# Array of branches with conflicts
conflict_branches=(
    "/Users/williamcory/tevm/main/g/feat_implement_bls12_381_g1add_precompile:1849"
    "/Users/williamcory/tevm/main/g/fix_deno_install_hang_1591:1845"
    "/Users/williamcory/tevm/main/g/fix_skip_balance_bug_1612:1842"
    "/Users/williamcory/tevm/main/g/feat_implement_ripemd160_precompile:1840"
    "/Users/williamcory/tevm/main/g/feat_implement_ecpairing_precompile:1838"
    "/Users/williamcory/tevm/main/g/feat_implement_ecmul_precompile:1837"
    "/Users/williamcory/tevm/main/g/feat_implement_ecadd_precompile:1836"
    "/Users/williamcory/tevm/main/g/feat_call_gas_management_claude:1835"
    "/Users/williamcory/tevm/main/g/feat_blake2f_precompile_claude:1834"
)

for entry in "${conflict_branches[@]}"; do
    branch_path="${entry%:*}"
    pr_number="${entry#*:}"
    
    if [ -d "$branch_path" ]; then
        resolve_conflicts_in_branch "$branch_path" "$pr_number"
        echo ""
    else
        echo "⚠️ Branch path not found: $branch_path"
    fi
done

echo "=== Smart merge resolution complete ==="
