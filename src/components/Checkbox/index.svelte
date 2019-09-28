<script>
  import Checkmark from './Checkmark'

  export let checked = false
</script>

<label>
  <input type="checkbox" {checked} />
  <span class="box">
    <Checkmark />
  </span>
</label>

<style>
  label {
    display: inline-block;
    line-height: 1;
    /* larger tap target */
    margin: -0.3em;
    padding: 0.3em;
  }
  input {
    display: none;
  }
  .box {
    height: 1em;
    width: 1em;
    display: inline-block;
    border: 2px solid var(--blue);
    border-radius: 4px;
    color: var(--blue);
  }
  .box :global(svg) {
    visibility: hidden;
    font-size: 11px;
    position: relative;
    top: -3px;
  }
  input:checked + .box :global(svg) {
    visibility: visible;
  }
</style>
