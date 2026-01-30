#!/bin/bash

# Run claude in a loop, alternating between prompt.md and review.md
# Even iterations (0, 2, 4...): prompt.md
# Odd iterations (1, 3, 5...): review.md

iteration=0

while true; do
    if (( iteration % 2 == 0 )); then
        prompt_file="prompt.md"
    else
        prompt_file="review.md"
    fi

    echo "=== Iteration $iteration: Using $prompt_file ==="

    claude --dangerously-skip-permissions -p < "$prompt_file"

    ((iteration++))
done
