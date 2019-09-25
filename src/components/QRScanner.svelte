<script>
  import { onMount, onDestroy } from 'svelte'
  import jsQR from 'jsqr'
  import { cover } from 'intrinsic-scale'

  let video = document.createElement('video')
  let canvas
  let stream

  export let onCode

  async function loadVideoStream() {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: 'environment' },
    })
    video.srcObject = stream
    video.setAttribute('playsinline', true)
    video.play()
    requestAnimationFrame(renderFrame)
  }

  function unloadVideoStream() {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
      })
    }
    video = null
  }

  function renderFrame() {
    if (!video) {
      return
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = canvas.scrollWidth
      canvas.height = canvas.scrollHeight

      const { x, y, width, height } = cover(
        canvas.width,
        canvas.height,
        video.videoWidth,
        video.videoHeight
      )

      const context = canvas.getContext('2d')
      context.drawImage(video, x, y, width, height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code && code.data) {
        onCode(code)
      }
    }

    requestAnimationFrame(renderFrame)
  }

  onMount(loadVideoStream)
  onDestroy(unloadVideoStream)
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    background: grey;
  }
</style>
