<script>
  export let placeholder = ''
</script>

<textarea {placeholder} />

<style>
  textarea {
    background-color: var(--pale-blue);
    border: 0;
    border-radius: 8px;
    width: 100%;
    padding: 8px;
  }
  textarea:focus {
    outline: none;
  }
</style>
