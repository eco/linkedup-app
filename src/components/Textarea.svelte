<script>
  export let value = ''
  export let placeholder = ''
</script>

<textarea {placeholder} bind:value />

<style>
  textarea {
    background-color: var(--pale-blue);
    border: 0;
    border-radius: 8px;
    width: 100%;
    padding: 8px;
    resize: vertical;
    min-height: 100px;
  }
  textarea:focus {
    outline: none;
  }
</style>
