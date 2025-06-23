# Claude Command: Integrate Test Matcher

This command initiates an interactive workflow to integrate a new or existing test matcher from `@tevm/test-matchers` into the `@tevm/actions` package's test suite.

## Usage

To start the integration process, type:
```
/integrate-test-matcher
```

## The Workflow

This command operates in three stages.

### Stage 1: Discover and Select

First, I will analyze the `@tevm/test-matchers` package to identify all available matchers and their capabilities. I will then present you with a list.

**AI Action:**
1.  Read the directory structure of `extensions/test-matchers/src/matchers/`.
2.  For each category, parse the `index.ts` file to find exported matchers.
3.  Read the JSDoc comments for each matcher to create a summary.
4.  Present the list of matchers to the user.

---
**(Example Interaction)**

*AI presents the list:*

> Here are the available matchers from `@tevm/test-matchers`:
>
> *   **Value Matchers:**
>     *   `toBeAddress(opts?)`: Asserts a value is a valid Ethereum address.
>     *   `toBeHex(opts?)`: Asserts a value is a valid hex string.
>     *   `toEqualAddress(expected)`: Compares two addresses for case-insensitive equality.
>     *   `toEqualHex(expected, opts?)`: Compares two hex strings with normalization.
> *   **Event Matchers:**
>     *   `toEmit(contract, eventName)`: Asserts an event was emitted.
>         *   Chainable with: `.withEventArgs(...)`, `.withEventNamedArgs(...)`
> *   **Error Matchers:**
>     *   `toBeReverted(client?)`: Asserts a transaction reverted for any reason.
>     *   `toBeRevertedWithString(client, message)`: Asserts a revert with a specific string message.
>     *   `toBeRevertedWithError(client, contract, errorName)`: Asserts a revert with a specific custom error.
>         *   Chainable with: `.withErrorArgs(...)`, `.withErrorNamedArgs(...)`
>
> **Please specify which matcher (and its chainable companions) you would like to integrate into the `@tevm/actions` test files.**

---
*User responds, e.g., "Please integrate `toBeRevertedWithError` and `withErrorNamedArgs`."*

---

### Stage 2: Generate a Specific Refactoring Plan

Once you select a matcher, I will generate a new, highly specific prompt for myself. This is done by taking a generic refactoring template and populating it with the details of the selected matcher.

**AI Action:**
1.  Retrieve the generic refactoring prompt template (see below at *Internal: Generic Refactoring Prompt Template*).
2.  Analyze the source and spec files for the selected matcher (e.g., `toBeRevertedWithError.ts` and `toBeRevertedWithError.spec.ts`) to find:
    *   A detailed description of its purpose.
    *   Its function signature and parameters.
    *   Examples of code it is designed to replace ("before" patterns).
    *   Examples of how it should be used ("after" patterns).
3.  Inject these details into the generic template to create a specific, actionable plan.
4.  Present this generated plan to you for confirmation before proceeding.

---
**(Example Interaction)**

*AI presents the generated plan:*

> Excellent. I have generated the following plan to guide the refactoring process.
>
> <plan>
> **Your Goal:** Refactor the test files within the `@tevm/actions` package to use the new `toBeRevertedWithError` matcher from `@tevm/test-matchers`. The objective is to replace existing, often generic, test assertions with this more specific and expressive matcher.
>
> **Your Guiding Principles:**
> 1.  **Enhance Specificity**
> 2.  **Improve Readability**
> 3.  **Do No Harm**
>
> ---
>
> ### **Step 1: Understand Your Tool (The `toBeRevertedWithError` Matcher)**
>
> *   **`toBeRevertedWithError(client, contract, errorName)`**: Asserts a transaction reverted with a specific custom error from a given contract. This replaces complex `try/catch` blocks that manually inspect error data.
> *   **`.withErrorNamedArgs({ ... })`**: Chains off `toBeRevertedWithError` to assert that the custom error was thrown with specific named arguments. This is highly readable and less brittle than checking ordered arguments.
>
> ---
>
> ### **Step 2: Your Workflow**
>
> I will proceed methodically through the `packages/actions/src` directory, analyzing each `.spec.ts` file for refactoring opportunities.
>
> ---
>
> ### **Step 3: What to Look For**
>
> #### **GOOD: Patterns to Actively Seek and Refactor**
>
> *   **Refactor complex `try/catch` blocks that check for custom errors.**
>     *   **Before:**
>         ```typescript
>         try {
>           await tevm.contract(...)
>           fail('should have reverted')
>         } catch (e) {
>           expect(e.message).toContain('InvalidAddressError') // Brittle string check
>           // Potentially more complex data decoding here
>         }
>         ```
>     *   **After:**
>         ```typescript
>         await expect(tevm.contract(...)).toBeRevertedWithError(client, contract, 'InvalidAddressError')
>         ```
> *   **Refactor `try/catch` blocks that check for custom error arguments.**
>     *   **Before:**
>         ```typescript
>         try {
>           //...
>         } catch (e) {
>           const decodedError = decodeErrorData(e.data)
>           expect(decodedError.name).toBe('InvalidAddressError')
>           expect(decodedError.args.providedAddress).toEqualAddress(someAddress)
>         }
>         ```
>     *   **After:**
>         ```typescript
>         await expect(tevm.contract(...))
>           .toBeRevertedWithError(client, contract, 'InvalidAddressError')
>           .withErrorNamedArgs({ providedAddress: someAddress })
>         ```
>
> #### **Critical Instructions for Safe Refactoring**
>
> *   Preserve Hardcoded Values with Absolute Precision.
> *   Use the Correct Matcher, Do Not Invent Values.
>
> #### **BAD: Patterns to Leave Untouched**
>
> *   DO NOT replace snapshot tests.
> *   DO NOT replace direct, simple object comparisons.
> *   DO NOT invent or guess values.
> *   DO NOT add new tests or assertions.
> </plan>
>
> I will now use this plan to start the refactoring. Is this okay?

---
*User confirms.*
---

### Stage 3: Execute the Refactoring

With your approval, I will execute the generated plan.

**AI Action:**
1.  List all `*.spec.ts` files within `packages/actions/src/`.
2.  Read the first file.
3.  Apply the refactoring rules from the generated plan.
4.  After updating a file, move to the next file, continuing until all files are processed.

---

## Internal: Generic Refactoring Prompt Template

This is the template used in Stage 2 to generate a specific plan. I will populate the `{{...}}` placeholders based on the user's selected matcher.

<template>
**Your Goal:** Refactor the test files within the `tevm/actions` package to use the `{{matcherName}}` matcher from `@tevm/test-matchers`. The objective is to replace existing, often generic, test assertions with this more specific and expressive matcher.

**Your Guiding Principles:**

1.  **Enhance Specificity:** Replace generic checks with specific matchers.
2.  **Improve Readability:** Use the new matcher to create more fluent, human-readable tests.
3.  **Do No Harm:** Do not add or remove tests or change the fundamental assertion being made.

---

### **Step 1: Understand Your Tool (The `{{matcherName}}` Matcher)**

*   **`{{matcherSignature}}`**: {{matcherDescription}}
{{#if isChainable}}
*   **`{{chainableMatcherSignature}}`**: {{chainableMatcherDescription}}
{{/if}}

---

### **Step 2: Your Workflow**

I will proceed methodically through the `packages/actions/src` directory, analyzing each `.spec.ts` file for refactoring opportunities.

---

### **Step 3: What to Look For**

#### **GOOD: Patterns to Actively Seek and Refactor**

*   **{{patternDescription}}**
    *   **Before:**
        ```typescript
        {{beforeExample}}
        ```
    *   **After:**
        ```typescript
        {{afterExample}}
        ```

#### **Critical Instructions for Safe Refactoring**

*   **Preserve Hardcoded Values with Absolute Precision:** When you encounter long, hardcoded hex strings, addresses, or other values in the tests, you **must copy and paste them exactly as they are.**
*   **Use the Correct Matcher, Do Not Invent Values:** You should **never** invent a value to use with a generic assertion.

#### **BAD: Patterns to Leave Untouched**

*   **DO NOT replace snapshot tests.** (`toMatchSnapshot`, `toMatchInlineSnapshot`)
*   **DO NOT replace direct, simple object comparisons.**
*   **DO NOT invent or guess values.**
*   **DO NOT add new tests or `expect` assertions.**
*   **DO NOT replace simple primitive checks** where a specialized matcher adds no clear value (e.g., `expect(x).toBe(42n)`).
</template>