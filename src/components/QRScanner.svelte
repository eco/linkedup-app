<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  let video = document.createElement('video')
  let canvas
  let stream
  let jsQR

  $: context = canvas && canvas.getContext('2d')

  let found = false
  const codeFound = code => {
    if (found) {
      return found
    }

    try {
      const url = new URL(code.data)
      const reValid = /^\/badge\/(\d+)$/
      if (!reValid.test(url.pathname)) {
        return false
      }
    } catch (e) {
      return false
    }

    // delay callback until user has been shown successful scan
    setTimeout(() => {
      const detail = { url: code.data }
      dispatch('code', detail)
    }, 1200)

    found = true

    return found
  }

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

  function drawBoundingBox(location, valid) {
    const padding = 10
    context.moveTo(
      location.topLeftCorner.x - padding,
      location.topLeftCorner.y - padding
    )
    context.lineTo(
      location.topRightCorner.x + padding,
      location.topRightCorner.y - padding
    )
    context.lineTo(
      location.bottomRightCorner.x + padding,
      location.bottomRightCorner.y + padding
    )
    context.lineTo(
      location.bottomLeftCorner.x - padding,
      location.bottomLeftCorner.y + padding
    )
    context.closePath()

    context.lineJoin = 'round'
    context.lineWidth = 12
    context.strokeStyle = valid ? '#3c48ea' : '#bb0000'
    context.stroke()
  }

  // renders a video frame to canvas and scans the content
  // for QR codes
  function renderFrame() {
    if (!video) {
      // video stream has been unloaded
      return
    }

    requestAnimationFrame(renderFrame)

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
          const valid = codeFound(code)
          drawBoundingBox(code.location, valid)
        }
      }
    }
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
