import { useEffect, useState, type RefObject } from 'react'
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision'

export interface FaceBox {
  left: number
  top: number
  width: number
  height: number
}

const DETECTION_INTERVAL = 120

export function useFaceDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  active: boolean
) {
  const [faceBox, setFaceBox] = useState<FaceBox | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!active) return

    let cancelled = false
    let animationFrame = 0
    let detector: FaceDetector | null = null
    let lastDetection = 0

    async function start() {
      try {
        const base = import.meta.env.BASE_URL
        const fileset = await FilesetResolver.forVisionTasks(`${base}mediapipe/wasm`)
        detector = await FaceDetector.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: `${base}mediapipe/models/blaze_face_short_range.tflite`,
          },
          runningMode: 'VIDEO',
          minDetectionConfidence: 0.62,
          minSuppressionThreshold: 0.3,
        })

        if (cancelled) return
        setReady(true)

        const detect = (timestamp: number) => {
          const video = videoRef.current
          if (!cancelled && detector && video?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
            if (timestamp - lastDetection >= DETECTION_INTERVAL) {
              lastDetection = timestamp
              const result = detector.detectForVideo(video, timestamp)
              const boundingBox = result.detections[0]?.boundingBox
              setFaceBox(boundingBox ? mapFaceToVideo(boundingBox, video) : null)
            }
            animationFrame = requestAnimationFrame(detect)
          } else if (!cancelled) {
            animationFrame = requestAnimationFrame(detect)
          }
        }

        animationFrame = requestAnimationFrame(detect)
      } catch {
        if (!cancelled) {
          setError(true)
          setReady(false)
        }
      }
    }

    start()

    return () => {
      cancelled = true
      cancelAnimationFrame(animationFrame)
      detector?.close()
    }
  }, [active, videoRef])

  return { faceBox, faceDetected: Boolean(faceBox), ready, error }
}

function mapFaceToVideo(
  box: { originX: number; originY: number; width: number; height: number },
  video: HTMLVideoElement
): FaceBox {
  const sourceWidth = video.videoWidth
  const sourceHeight = video.videoHeight
  const displayWidth = video.clientWidth
  const displayHeight = video.clientHeight
  const scale = Math.max(displayWidth / sourceWidth, displayHeight / sourceHeight)
  const renderedWidth = sourceWidth * scale
  const renderedHeight = sourceHeight * scale
  const offsetX = (displayWidth - renderedWidth) / 2
  const offsetY = (displayHeight - renderedHeight) / 2

  const width = box.width * scale * 1.45
  const height = box.height * scale * 1.7
  const mirroredX = sourceWidth - box.originX - box.width
  const left = offsetX + mirroredX * scale - (width - box.width * scale) / 2
  const top = offsetY + box.originY * scale - (height - box.height * scale) * 0.46

  return {
    left: clampPercent((left / displayWidth) * 100),
    top: clampPercent((top / displayHeight) * 100),
    width: clampPercent((width / displayWidth) * 100),
    height: clampPercent((height / displayHeight) * 100),
  }
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value))
}
