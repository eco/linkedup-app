<div class="spinner" />

<style>
  .spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 100%;
    vertical-align: middle;
    background-color: currentColor;
    animation: sk-scaleout 1s infinite ease-in-out;
  }

  @keyframes sk-scaleout {
    0% {
      transform: scale(0.2);
    }
    100% {
      transform: scale(1.7);
      opacity: 0;
    }
  }
</style>
