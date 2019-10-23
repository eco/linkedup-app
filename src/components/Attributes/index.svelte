<script>
  import TextInput from '../TextInput'
  import Checkbox from '../Checkbox'
  import ButtonLink from '../ButtonLink'
  import DeleteIcon from './DeleteIcon.svelte'
  import Modal from '../Modal'
  import platforms from './platforms'
  import * as socialIcons from './socials'

  export let name = ''
  export let attributes = []
  export let share = []
  export let editable = false

  const shareFlags = Object.fromEntries(share.map(s => [s, true]))
  let fieldsVisible = false

  $: {
    share = Object.entries(shareFlags)
      .filter(entry => entry[1])
      .map(entry => entry[0])
  }
  $: selectedFields = attributes.slice(1).map(a => a.label)
  $: allSelected = selectedFields.length === platforms.length

  const showFields = () => (fieldsVisible = true)
  const hideFields = () => (fieldsVisible = false)

  const addField = field => {
    hideFields()
    shareFlags[field] = true
    attributes = [
      ...attributes,
      {
        label: field,
        value: '',
      },
    ]
  }

  const removeField = field => {
    attributes = attributes.filter(a => a.label !== field)
  }
</script>

<table>
  <tr>
    <th>
      <TextInput
        fullWidth
        label="Name"
        bind:value={name}
        readonly={!editable} />
    </th>
    <th class="share-input">
      <span class="label">Share?</span>
    </th>
  </tr>
  {#each attributes as attr, i (attr.label)}
    <tr>
      <td>
        {#if editable && i !== 0}
          <span class="delete" on:click={() => removeField(attr.label)}>
            <DeleteIcon />
          </span>
        {/if}
        <TextInput
          fullWidth
          label={attr.label}
          bind:value={attr.value}
          readonly={!editable} />
      </td>
      <td class="share-input">
        <Checkbox bind:checked={shareFlags[attr.label]} />
      </td>
    </tr>
  {/each}
</table>

{#if editable && !allSelected}
  <ButtonLink on:click={showFields}>+ Add field</ButtonLink>
{/if}

{#if editable && fieldsVisible}
  <Modal title="Add Field" on:close={hideFields}>
    <ul class="fields">
      {#each platforms as field}
        <li
          class="field"
          class:selected={selectedFields.includes(field)}
          on:click={() => addField(field)}>
          <span class="icon">
            <svelte:component this={socialIcons[field]} />
          </span>
          {field}
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
    padding-left: 1em;
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
    pointer-events: none;
    opacity: 0.3;
  }
  .field .icon {
    float: left;
    width: 2em;
    margin: -3px 0.6em 0 0;
    text-align: center;
  }
</style>
