<script>
  import ButtonLink from './ButtonLink'

  export let editable = false
</script>

<span class="avatar">
  <img
    src="https://source.unsplash.com/random/400x400"
    alt="Your profile photo" />
  {#if editable}
    <ButtonLink>Choose avatar</ButtonLink>
  {/if}
</span>

<style>
  .avatar {
    display: inline-block;
    width: 265px;
    height: 265px;
    text-align: center;
  }
  img {
    width: 100%;
    border-radius: 50%;
  }
</style>
