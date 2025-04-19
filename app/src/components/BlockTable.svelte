<script lang="ts">
  export let block: any;
</script>

<table class="block-table">
  <thead>
    <tr>
      <th>Field</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    {#each Object.entries(block) as [key, value]}
      <tr>
        <td class="key">{key}</td>
        <td class="value">
          {#if Array.isArray(value)}
            {#if value.length === 0}
              <em>Empty Array</em>
            {:else if typeof value[0] === 'object'}
              <!-- Nested Table for an Array of Objects (e.g. withdrawals) -->
              <table class="nested-table">
                <thead>
                  <tr>
                    {#each Object.keys(value[0]) as nestedKey}
                      <th>{nestedKey}</th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each value as item}
                    <tr>
                      {#each Object.values(item) as cell}
                        <td>{cell}</td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            {:else}
              <!-- List for an Array of Primitives (e.g. transactions) -->
              <ul class="array-list">
                {#each value as item}
                  <li>{item}</li>
                {/each}
              </ul>
            {/if}
          {:else if typeof value === 'object' && value !== null}
            <!-- Handle any nested object -->
            <pre>{JSON.stringify(value, null, 2)}</pre>
          {:else}
            {value}
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .block-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-family: sans-serif;
    font-size: 14px;
  }

  .block-table th,
  .block-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .block-table th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  .block-table tr:nth-child(even) {
    background-color: #fafafa;
  }

  .block-table tr:hover {
    background-color: #f1f1f1;
  }

  .nested-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }

  .nested-table th,
  .nested-table td {
    border: 1px solid #ccc;
    padding: 6px;
    font-size: 12px;
  }

  .nested-table th {
    background-color: #eaeaea;
  }

  .array-list {
    list-style: disc;
    margin: 0;
    padding-left: 20px;
  }
</style> 