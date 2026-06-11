import { motion } from 'framer-motion'
import type { FaceBox } from '../hooks/useFaceDetection'

interface FaceOverlayProps {
  scanning?: boolean
  showLandmarks?: boolean
  faceBox?: FaceBox | null
  detected?: boolean
  centered?: boolean
}

const FACE_DOTS = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 9 }, (_, column) => ({
    x: 14 + column * 9,
    y: 8 + row * 9.4,
  }))
).flat().filter((point) => {
  const x = (point.x - 50) / 40
  const y = (point.y - 50) / 48
  return x * x + y * y <= 1
})

export function FaceOverlay({
  scanning = false,
  showLandmarks = true,
  faceBox,
  detected = false,
  centered = false,
}: FaceOverlayProps) {
  const frame = faceBox
    ? {
        left: `${faceBox.left}%`,
        top: `${faceBox.top}%`,
        width: `${faceBox.width}%`,
        height: `${faceBox.height}%`,
      }
    : { left: '22.5%', top: '14%', width: '55%', height: '72%' }

  return (
    <div className={`face-overlay ${detected ? 'face-overlay--detected' : ''} ${centered ? 'face-overlay--centered' : ''}`}>
      <motion.div
        className="face-overlay__frame"
        animate={{
          ...frame,
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {scanning && detected && (
          <motion.svg
            className="face-overlay__mesh"
            viewBox="0 0 200 240"
            preserveAspectRatio="none"
            initial={{ opacity: 0, scale: .94, rotateY: -8 }}
            animate={{ opacity: .92, scale: 1, rotateY: [0, 4, 0, -4, 0] }}
            transition={{
              opacity: { duration: .45 },
              scale: { duration: .45 },
              rotateY: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <defs>
              <radialGradient id="face-mesh-surface" cx="50%" cy="43%" r="62%">
                <stop offset="0%" stopColor="rgba(255,255,255,.22)" />
                <stop offset="58%" stopColor="rgba(255,255,255,.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,.02)" />
              </radialGradient>
              <linearGradient id="face-mesh-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,.92)" />
                <stop offset="52%" stopColor="rgba(255,255,255,.64)" />
                <stop offset="100%" stopColor="rgba(255,255,255,.3)" />
              </linearGradient>
            </defs>
            <ellipse cx="100" cy="120" rx="88" ry="112" fill="url(#face-mesh-surface)" />
            {[30, 55, 80, 105, 130, 155, 180, 205].map((y) => {
              const spread = 84 * Math.sqrt(Math.max(0, 1 - Math.pow((y - 120) / 112, 2)))
              return (
                <path
                  key={`horizontal-${y}`}
                  d={`M ${100 - spread} ${y} Q 100 ${y + (y < 120 ? 13 : -13)} ${100 + spread} ${y}`}
                  fill="none"
                  stroke="url(#face-mesh-line)"
                  strokeWidth="1"
                />
              )
            })}
            {[-72, -48, -24, 0, 24, 48, 72].map((x) => (
              <path
                key={`vertical-${x}`}
                d={`M ${100 + x * .28} 10 Q ${100 + x} 120 ${100 + x * .25} 230`}
                fill="none"
                stroke="url(#face-mesh-line)"
                strokeWidth="1"
              />
            ))}
            <path d="M38 102 Q100 76 162 102" fill="none" stroke="url(#face-mesh-line)" strokeWidth="1.4" />
            <path d="M54 166 Q100 196 146 166" fill="none" stroke="url(#face-mesh-line)" strokeWidth="1.4" />
          </motion.svg>
        )}

        {detected && showLandmarks && FACE_DOTS.map((point, i) => (
          <motion.div
            key={i}
            className="face-overlay__landmark"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: scanning ? [0.7, 1.2, 0.7] : 1,
              opacity: scanning ? [0.35, 1, 0.35] : centered ? 0.9 : 0.62,
            }}
            transition={{
              delay: i * 0.012,
              duration: scanning ? 1.4 : 0.32,
              repeat: scanning ? Infinity : 0,
            }}
          />
        ))}

        {scanning && (
          <motion.div
            className="face-overlay__scanline"
            animate={{ top: ['15%', '85%', '15%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

      </motion.div>

      <style>{`
        .face-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .face-overlay__frame {
          position: absolute;
          border-radius: 50% 50% 45% 45% / 55% 55% 45% 45%;
          perspective: 700px;
        }
        .face-overlay__mesh {
          position: absolute;
          inset: -3%;
          width: 106%;
          height: 106%;
          overflow: visible;
          filter: drop-shadow(0 0 12px rgba(255,255,255,.2));
          transform-style: preserve-3d;
          transform-origin: center;
        }
        .face-overlay__landmark {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,.72);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 9px rgba(255,255,255,.48);
          transition: background .35s ease, box-shadow .35s ease;
          z-index: 2;
        }
        .face-overlay--centered .face-overlay__landmark {
          background: #fff;
          box-shadow: 0 0 10px rgba(255,255,255,.72);
        }
        .face-overlay__scanline {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent);
          box-shadow: 0 0 20px rgba(255,255,255,.48);
        }
      `}</style>
    </div>
  )
}
