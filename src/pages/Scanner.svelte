<script>
  import { onMount, onDestroy } from 'svelte'
  import jsQR from 'jsqr'
  import page from 'page'

  let canvas
  let stream
  let video = document.createElement('video')

  async function loadVideoStream() {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    })
    video.srcObject = stream
    video.setAttribute('playsinline', true)
    video.play()
    requestAnimationFrame(tick)
  }

  function unloadVideoStream() {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
      })
    }
    video = null
  }

  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvasContext = canvas.getContext('2d')
      const { videoHeight, videoWidth } = video
      canvas.height = videoHeight
      canvas.width = videoWidth
      const dimensionArgs = [0, 0, videoWidth, videoHeight]
      canvasContext.drawImage(video, ...dimensionArgs)
      const imageData = canvasContext.getImageData(...dimensionArgs)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })
      if (code && code.data) {
        unloadVideoStream()
        page('/badge/123')
        return
      }
    }
    requestAnimationFrame(tick)
  }

  onMount(loadVideoStream)
  onDestroy(unloadVideoStream)
</script>

<h1>here be a scanner</h1>
<canvas bind:this={canvas} />
