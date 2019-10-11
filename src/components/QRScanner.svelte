<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  let video = document.createElement('video')
  let canvas
  let stream
  let jsQR

  $: context = canvas && canvas.getContext('2d')

  // requests permission to access device camera and begins
  // streaming the video the the canvas element
  async function loadVideoStream() {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    })
    video.srcObject = stream
    video.setAttribute('playsinline', true)
    video.play()
    requestAnimationFrame(renderFrame)
    ;({ default: jsQR } = await import('jsqr'))
  }

  // renders a video frame to canvas and scans the content
  // for QR codes
  function renderFrame() {
    if (!video) {
      return
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const { videoWidth: width, videoHeight: height } = video
      canvas.width = width
      canvas.height = height

      const dimensions = [0, 0, width, height]
      context.drawImage(video, ...dimensions)

      if (jsQR) {
        const imageData = context.getImageData(...dimensions)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        })

        if (code && code.data) {
          dispatch('code', code)
        }
      }
    }

    requestAnimationFrame(renderFrame)
  }

  // switches off the video stream and cleans memory
  function unloadVideoStream() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    video = null
  }

  onMount(loadVideoStream)
  onDestroy(unloadVideoStream)
</script>

<div class="qr-scanner">
  <canvas bind:this={canvas} />
</div>

<style>
  .qr-scanner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: lightgray;
  }
  canvas {
    max-width: 100%;
    max-height: 100%;
  }
</style>
