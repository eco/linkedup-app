<script>
  import { Button } from '../components'

  export let actionText
  export let ActionIcon
  export let onAction
</script>

<div class="page">
  <div>
    <slot />
  </div>
  <div class="action">
    <Button fullWidth onClick={onAction}>
      {#if ActionIcon}
        <span class="action-icon">
          <ActionIcon />
        </span>
      {/if}
      {actionText}
    </Button>
  </div>
</div>

<style>
  .page {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .action {
    margin-top: auto;
  }
  .action-icon {
    margin-right: 10px;
    position: relative;
    top: -1px;
  }
</style>
