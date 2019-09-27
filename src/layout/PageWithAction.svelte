<div class="page">
  <slot name="content" />
  <div class="action">
    <slot name="action" />
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
    padding-top: 1em;
  }
</style>
