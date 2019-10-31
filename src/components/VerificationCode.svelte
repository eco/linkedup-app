<script>
  export let length = 6
  export let code = ''
  export let label
</script>

<label>
  <p class="label">{label}</p>
  <input type="text" pattern="\d*" maxlength={length} bind:value={code} />
  <div class="container">
    {#each [0, 1, 2, 3, 4, 5] as digit}
      <span class="digit">{code[digit] || ''}</span>
    {/each}
  </div>
</label>

<style>
  .label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    height: 12px;
    margin-bottom: 2em;
  }
  .container {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  input {
    opacity: 0;
    position: absolute;
  }
  .digit {
    background-color: transparent;
    padding: 10px 0;
    border-bottom: 2px solid var(--gray);
    width: 40px;
    height: 1em;
    box-sizing: content-box;
    text-align: center;
    font-size: 2rem;
  }
</style>
