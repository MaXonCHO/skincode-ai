import { motion } from 'framer-motion'
import type { FaceBox } from '../hooks/useFaceDetection'

const STEPS = [
  { key: 'tone', label: 'Тон кожи', value: 'Равномерный', side: 'left', x: -5, y: .25 },
  { key: 'undertone', label: 'Подтон', value: 'Нейтральный', side: 'right', x: 5, y: .32 },
  { key: 'texture', label: 'Текстура', value: 'Гладкая', side: 'left', x: -5, y: .68 },
  { key: 'type', label: 'Тип кожи', value: 'Комбинированная', side: 'right', x: 5, y: .72 },
] as const

interface AnalysisProgressProps {
  currentStep: number
  faceBox: FaceBox | null
}

export function AnalysisProgress({ currentStep, faceBox }: AnalysisProgressProps) {
  if (!faceBox) return null

  return (
    <div className="analysis-progress" role="status" aria-live="polite">
      {STEPS.map((step, index) => {
        if (index > currentStep) return null

        const isLeft = step.side === 'left'
        const left = isLeft
          ? clamp(faceBox.left + step.x, 13, 42)
          : clamp(faceBox.left + faceBox.width + step.x, 58, 87)
        const top = clamp(faceBox.top + faceBox.height * step.y, 20, 78)

        return (
          <motion.div
            key={step.key}
            className={`analysis-callout analysis-callout--${step.side}`}
            style={{ left: `${left}%`, top: `${top}%` }}
            initial={{ opacity: 0, scale: .82, x: isLeft ? 18 : -18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: .9 }}
            transition={{ type: 'spring', stiffness: 210, damping: 24 }}
          >
            <span className="analysis-callout__index">0{index + 1}</span>
            <span className="analysis-callout__copy">
              <small>{step.label}</small>
              <strong>{step.value}</strong>
            </span>
            <span className="analysis-callout__anchor" />
          </motion.div>
        )
      })}

      <style>{`
        .analysis-progress {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .analysis-callout {
          position: absolute;
          z-index: 4;
          min-width: 150px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 13px;
          border: 1px solid rgba(255,255,255,.54);
          border-radius: 15px;
          background: rgba(255,255,255,.18);
          color: #fff;
          backdrop-filter: blur(20px) saturate(150%);
          box-shadow: 0 12px 30px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.45);
        }
        .analysis-callout--left {
          translate: -100% -50%;
        }
        .analysis-callout--right {
          translate: 0 -50%;
        }
        .analysis-callout::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 44px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,.25), rgba(126,236,190,.9));
        }
        .analysis-callout--left::after {
          left: 100%;
        }
        .analysis-callout--right::after {
          right: 100%;
          transform: rotate(180deg);
        }
        .analysis-callout__anchor {
          position: absolute;
          top: 50%;
          width: 7px;
          height: 7px;
          border: 1px solid rgba(126,236,190,.95);
          border-radius: 50%;
          background: transparent;
          box-shadow: 0 0 9px rgba(126,236,190,.72);
          transform: translateY(-50%);
        }
        .analysis-callout--left .analysis-callout__anchor {
          left: calc(100% + 41px);
        }
        .analysis-callout--right .analysis-callout__anchor {
          right: calc(100% + 41px);
        }
        .analysis-callout__index {
          font-size: 10px;
          font-weight: 700;
          color: rgba(126,236,190,.92);
          letter-spacing: .08em;
        }
        .analysis-callout__copy {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .analysis-callout__copy small {
          font-size: 9px;
          color: rgba(255,255,255,.68);
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .analysis-callout__copy strong {
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
