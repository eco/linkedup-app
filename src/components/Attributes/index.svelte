<script>
  import config from '../../config'
  import TextInput from '../TextInput'
  import Checkbox from '../Checkbox'
  import ButtonLink from '../ButtonLink'
  import DeleteIcon from './DeleteIcon.svelte'
  import Modal from '../Modal'
  import * as socialIcons from './socials'

  const { platforms, platformByLabel } = config

  export let name = ''
  export let attributes = []
  export let share = []
  export let editable = false
  let form
  let formSubmitted = false

  export const reportValidity = () => {
    formSubmitted = true
    return form.reportValidity()
  }

  const shareFlags = Object.fromEntries(share.map(s => [s, true]))
  let fieldsVisible = false

  $: {
    share = Object.entries(shareFlags)
      .filter(entry => entry[1])
      .map(entry => entry[0])
  }
  $: selectedFields = attributes.map(a => a.label)
  $: allSelected = selectedFields.length === platforms.length

  const showFields = () => (fieldsVisible = true)
  const hideFields = () => (fieldsVisible = false)

  const addField = field => {
    hideFields()
    shareFlags[field.name] = true
    attributes = [
      ...attributes,
      {
        label: field.name,
        value: '',
      },
    ]
  }

  const removeField = label => {
    attributes = attributes.filter(a => a.label !== label)
  }
</script>

<form bind:this={form}>
  <table>
    <tr>
      <th>
        <TextInput
          fullWidth
          label="Name"
          bind:value={name}
          readonly={!editable}
          required
          displayErrors={formSubmitted} />
      </th>
      <th class="share-input">
        <span class="label">Share?</span>
      </th>
    </tr>
    {#each attributes as attr, i (attr.label)}
      <tr>
        <td>
          {#if editable && attr.label !== 'Email'}
            <span class="delete" on:click={() => removeField(attr.label)}>
              <DeleteIcon />
            </span>
          {/if}
          <TextInput
            fullWidth
            type={platformByLabel[attr.label].type}
            label={attr.label}
            bind:value={attr.value}
            readonly={!editable}
            autofocus={editable && attr.label !== 'Email'}
            required
            displayErrors={formSubmitted}
            prefix={platformByLabel[attr.label].prefix} />
        </td>
        <td class="share-input">
          <Checkbox bind:checked={shareFlags[attr.label]} />
        </td>
      </tr>
    {/each}
  </table>
</form>

{#if editable && !allSelected}
  <ButtonLink on:click={showFields}>+ Add field</ButtonLink>
{/if}

{#if editable && fieldsVisible}
  <Modal title="Add Field" on:close={hideFields}>
    <ul class="fields">
      {#each platforms as field, i (field.name)}
        <li
          class="field"
          class:selected={selectedFields.includes(field.name)}
          on:click={() => addField(field)}>
          <span class="icon">
            <svelte:component this={socialIcons[field.name]} />
          </span>
          {field.name}
        </li>
      {/each}
    </ul>
  </Modal>
{/if}

<style>
  table {
    width: 100%;
    margin: 1em 0;
    border-spacing: 0;
  }
  th {
    vertical-align: top;
    text-align: left;
    font-weight: inherit;
  }
  td {
    vertical-align: bottom;
    padding-top: 1em;
    position: relative;
  }
  .share-input {
    width: 50px;
    text-align: center;
  }
  .label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    display: block;
    line-height: 1;
  }
  .delete {
    font-size: 12px;
    position: absolute;
    line-height: 1;
    margin: -0.5em;
    padding: 0.5em;
    left: -20px;
    bottom: 14px;
  }
  .fields {
    margin-top: 2em;
    font-weight: normal;
  }
  .field {
    line-height: 3em;
  }
  .field.selected {
    display: none;
  }
  .field .icon {
    float: left;
    width: 2em;
    margin: -3px 0.6em 0 0;
    text-align: center;
  }
</style>
