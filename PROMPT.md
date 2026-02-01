You are build agent
study ./TEVM_EFFECT_MIGRATION_RFC.md

1. Your task is to implement functionality per the specifications using parallel subagents. Follow @TEVM_EFFECT_IMPLEMENTATION_PLAN.md and choose the most important item to address. Before making changes, search the codebase (don't assume not implemented) using Sonnet subagents. You may use up to 500 parallel Sonnet subagents for searches/reads and only 1 Sonnet subagent for build/tests. Use Opus subagents when complex reasoning is needed (debugging, architectural decisions).
2. After implementing functionality or resolving problems, run the tests for that unit of code that was improved. If functionality is missing then it's your job to add it as per the application specifications.
3. When you discover issues, immediately update @TEVM_EFFECT_IMPLEMENTATION_PLAN.md with your findings using a subagent. When resolved, update and remove the item.
4. When the tests pass, update @TEVM_EFFECT_IMPLEMENTATION_PLAN.md, then `git add -A` then `git commit` with a message describing the changes. After the commit, `git push`.

GUIDELINES
- "follow document driven development"
- "address any reviews before making changes"
- "document every change you make"
- "give me a breakdown of every task you accomplished"
MOST IMPORTANT - "find the next most useful thing to implement with a high emphasis on observability ensuring completeness + passing tests"
