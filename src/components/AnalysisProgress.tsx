import { motion } from 'framer-motion'

const STEPS = [
  { key: 'tone', label: 'Тон кожи' },
  { key: 'undertone', label: 'Подтон' },
  { key: 'texture', label: 'Текстура' },
  { key: 'type', label: 'Тип кожи' },
]

interface AnalysisProgressProps {
  currentStep: number
}

export function AnalysisProgress({ currentStep }: AnalysisProgressProps) {
  return (
    <div className="analysis-progress glass" role="status" aria-live="polite">
      {STEPS.map((step, index) => {
        const done = index < currentStep
        const active = index === currentStep
        return (
          <motion.div
            key={step.key}
            className={`analysis-progress__item ${done ? 'analysis-progress__item--done' : ''} ${active ? 'analysis-progress__item--active' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="analysis-progress__check">
              {done ? '✓' : active ? '◉' : '○'}
            </span>
            <span className="analysis-progress__label">{step.label}</span>
            {active && (
              <motion.div
                className="analysis-progress__bar"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2 }}
              />
            )}
          </motion.div>
        )
      })}

      <style>{`
        .analysis-progress {
          padding: 28px 36px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 280px;
        }
        .analysis-progress__item {
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
          font-size: 18px;
          color: var(--text-secondary);
        }
        .analysis-progress__item--done {
          color: var(--text-primary);
        }
        .analysis-progress__item--active {
          color: var(--text-primary);
          font-weight: 500;
        }
        .analysis-progress__check {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }
        .analysis-progress__item--done .analysis-progress__check {
          color: #b8a0e0;
        }
        .analysis-progress__item--active .analysis-progress__check {
          color: #e0a0c8;
        }
        .analysis-progress__bar {
          position: absolute;
          bottom: -4px;
          left: 38px;
          height: 2px;
          background: linear-gradient(90deg, #b8a0e0, #e0a0c8);
          border-radius: 1px;
        }
      `}</style>
    </div>
  )
}
