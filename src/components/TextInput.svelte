<script>
  import { fly } from 'svelte/transition'

  export let value = ''
  export let label = ''
  export let fullWidth = false
  export let readonly = false
  export let autofocus = false
  export let type = 'text'
  export let required = false
  export let displayErrors = false
  export let prefix = undefined

  const maybeAutofocus = el => autofocus && el.focus()
  const handleFocus = e => setTimeout(() => e.target.scrollIntoView(), 100)
</script>

<label class:displayErrors>
  {#if type === 'text'}
    <input
      type="text"
      bind:value
      placeholder={label}
      class:fullWidth
      {readonly}
      {required}
      use:maybeAutofocus />
  {:else if type === 'email'}
    <input
      type="email"
      bind:value
      placeholder={label}
      class:fullWidth
      {readonly}
      {required}
      use:maybeAutofocus />
  {:else if type === 'tel'}
    <input
      type="tel"
      autocomplete="tel"
      pattern="[0-9+-.\s]{'{5,20}'}"
      bind:value
      placeholder={label}
      class:fullWidth
      {readonly}
      {required}
      use:maybeAutofocus />
  {:else if type === 'url'}
    <input
      class="url"
      type="text"
      bind:value
      placeholder={label}
      class:fullWidth
      {readonly}
      {required}
      autocorrect="off"
      autocapitalize="none"
      use:maybeAutofocus
      on:focus={handleFocus} />
    {#if !readonly}
      <span class="vanity-input">
        <span class="rtl-text" class:has-text={!!value}>
          <span class="ltr-text">
            <span class="prefix">{prefix}</span>
            {value}
          </span>
        </span>
      </span>
    {/if}
  {/if}

  {#if value || type === 'url'}
    <span class="label" transition:fly|local={{ y: 20, duration: 400 }}>
      {label}
    </span>
  {/if}
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
    line-height: 1;
    height: 12px;
    position: absolute;
    top: 0;
    left: 0;
  }
  input {
    background-color: transparent;
    padding: 4px 0;
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid var(--gray);
  }
  input.url:not([readonly]) {
    opacity: 0;
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
  label.displayErrors input:invalid,
  label.displayErrors input:invalid + .vanity-input {
    border-bottom: 1px solid var(--red);
  }
  label.displayErrors input:invalid + .label {
    color: var(--red);
  }
  .vanity-input {
    position: absolute;
    left: 0;
    bottom: 0;
    padding-bottom: 4px;
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid var(--gray);
    white-space: nowrap;
    cursor: text;
  }
  .vanity-input .rtl-text {
    display: inline-block;
    max-width: 100%;
  }
  .vanity-input .rtl-text.has-text {
    /* fix for strange rtl rendering when no text */
    direction: rtl;
  }
  .vanity-input .ltr-text {
    direction: ltr;
  }
  .vanity-input .prefix {
    opacity: 0.75;
    font-size: 80%;
    margin-right: -0.3em;
  }
</style>
