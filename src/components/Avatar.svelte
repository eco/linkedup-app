<script>
  export let editable = false
</script>

<span class="avatar">
  <img
    src="https://source.unsplash.com/random/400x400"
    alt="Your profile photo" />
  {#if editable}
    <span class="edit">Choose avatar</span>
  {/if}
</span>

<style>
  .avatar {
    display: inline-block;
    width: 265px;
    height: 265px;
  }
  img {
    width: 100%;
    border-radius: 50%;
  }
  .edit {
    display: inline-block;
    margin-top: 1em;
    font-size: 12px;
    color: var(--blue);
    text-transform: uppercase;
  }
</style>
