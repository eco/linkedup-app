<script>
  import { fly } from 'svelte/transition'

  export let value = ''
  export let label = ''
  export let fullWidth = false
  export let readonly = false
</script>

<label>
  {#if value}
    <span class="label" in:fly|local={{ y: 20, duration: 400 }}>{label}</span>
  {/if}
  <input
    type="text"
    bind:value
    placeholder={label}
    class:fullWidth
    {readonly} />
</label>

<style>
  label {
    padding-top: 12px;
    display: block;
    position: relative;
  }
  .label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    display: block;
    line-height: 1;
    height: 12px;
    position: absolute;
    top: 0;
    left: 0;
  }
  input {
    padding: 4px 0;
    border: 0;
    border-bottom: 1px solid var(--gray);
  }
  input.fullWidth {
    width: 100%;
  }
  input:focus {
    outline: none;
  }
  input[readonly] {
    border-bottom: 0;
  }
</style>
