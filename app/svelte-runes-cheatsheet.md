# Svelte 5 Runes Cheatsheet

## What are Runes?

Runes are special Svelte 5 compiler directives that control reactivity. They are marked with a `$` prefix and are used to explicitly define reactive state and behaviors.

## Key Runes

### 1. `$state()` - Reactive State

Create reactive variables that trigger updates when changed.

```svelte
<script>
  // ✅ CORRECT: Use let with $state()
  let count = $state(0);
  
  function increment() {
    // Directly mutate the state
    count++;
  }
  
  // ❌ INCORRECT: Don't use const with $state (can't reassign)
  const badCount = $state(0); // Will cause errors when trying to modify
</script>

<button on:click={increment}>Count: {count}</button>
```

### 2. `$derived()` - Computed Values

Create values that automatically update when their dependencies change.

```svelte
<script>
  // State variables
  let count = $state(0);
  
  // ✅ CORRECT: Derived value updates when dependencies change
  let doubled = $derived(count * 2);
  let isEven = $derived(count % 2 === 0);
  
  // ❌ INCORRECT: Don't use reactive statements
  $: oldDoubled = count * 2; // Old Svelte 4 style, don't use with runes
</script>

<p>Count: {count}, Doubled: {doubled}</p>
<p>The number is {isEven ? 'even' : 'odd'}</p>
```

### 3. `$effect()` - Side Effects

Run code when dependencies change, similar to useEffect in React.

```svelte
<script>
  let count = $state(0);
  let logs = $state([]);
  
  // ✅ CORRECT: Effect runs when dependencies change
  $effect(() => {
    logs = [...logs, `Count changed to ${count}`];
    
    // Can return a cleanup function (runs before the next effect)
    return () => {
      console.log('Cleaning up previous effect');
    };
  });
  
  // ❌ INCORRECT: Don't use reactive statements for side effects
  $: {
    // Old Svelte style, avoid with runes
    console.log(`Count is now ${count}`);
  }
</script>
```

### 4. `$props()` - Component Props

Declare props that a component accepts.

```svelte
<script>
  // ✅ CORRECT: Declare props with $props()
  let { name, count = 0 } = $props();
  
  // ❌ INCORRECT: Don't use export let with runes
  export let oldName; // Old Svelte style, don't mix with runes
</script>

<h1>Hello {name}!</h1>
<p>Count: {count}</p>
```

## Core Principles

1. **Use `let` with runes, not `const`**
   - Runes create variables that may need to be reassigned
   - Using `const` will cause errors when the state needs to change

2. **Don't mix old reactivity with runes**
   - Avoid using `$:` reactive declarations with runes
   - Don't use `export let` for props when using `$props()`

3. **State mutations are direct**
   - With runes, you directly mutate state variables
   - No need for special setters or state update functions

4. **Runes can't be imported, assigned, or passed as arguments**
   - Runes are compiler directives, not regular functions
   - They only work at the top level of a component script

## Migration from Svelte 4

| Svelte 4 | Svelte 5 Runes |
|----------|----------------|
| `export let name` | `let { name } = $props()` |
| `let count = 0` (with reactivity) | `let count = $state(0)` |
| `$: doubled = count * 2` | `let doubled = $derived(count * 2)` |
| `$: { console.log(count); }` | `$effect(() => { console.log(count); })` |

## What NOT to Do

- ❌ Don't use `$: reactive = value` statements with runes
- ❌ Don't use `export let prop` with runes, use `$props()` instead
- ❌ Don't use `const` with `$state()` or other rune variables that need to change
- ❌ Don't try to import or export runes, they're built into Svelte
- ❌ Don't use runes inside functions, loops, or conditions (only at component top level)
- ❌ Don't mix old reactivity (`$:`) with new runes in the same component

## Best Practices

- ✅ Use descriptive names for state variables
- ✅ Organize related state together
- ✅ Use `$derived()` for computed values instead of calculating in the template
- ✅ Keep effects focused on a single responsibility
- ✅ Provide cleanup functions from effects when needed
- ✅ Prefer `let` for all variables that will be used with runes