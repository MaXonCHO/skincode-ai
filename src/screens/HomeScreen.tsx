import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import heroPhoto from '../../photo/hero-photo-2.png'

interface HomeScreenProps {
  onStart: () => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="screen home-screen beauty-gradient">
      <Logo />

      <div className="home-screen__content">
        <motion.div
          className="home-screen__visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="home-screen__image-wrapper">
            <img
              src={heroPhoto}
              alt="Чистая кожа"
              className="home-screen__image"
            />
            <span className="home-screen__image-corner home-screen__image-corner--left" />
            <span className="home-screen__image-corner home-screen__image-corner--right" />
            <div className="home-screen__image-glow" />
          </div>
        </motion.div>

        <motion.div
          className="home-screen__text"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h1 className="home-screen__title">
            НАЙДИ СВОЙ<br />ИДЕАЛЬНЫЙ ТОН
          </h1>
          <p className="home-screen__subtitle">
            Расскажи немного о своей коже, а мы подберём оттенки,
            которые подойдут именно тебе.
          </p>
          <motion.button
            className="glow-button home-screen__cta"
            onClick={onStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            НАЧАТЬ ПОДБОР
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        .home-screen__content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(54px, 7vw, 130px);
          padding: var(--space-lg) clamp(54px, 7vw, 130px);
        }
        .home-screen__visual {
          position: relative;
          flex-shrink: 0;
        }
        .home-screen__image-wrapper {
          position: relative;
          width: clamp(360px, 34vw, 590px);
          height: clamp(500px, 48vw, 770px);
        }
        .home-screen__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        .home-screen__image-corner {
          position: absolute;
          bottom: 0;
          width: 68px;
          height: 68px;
          border-bottom: 3px solid rgba(0,0,0,.72);
          pointer-events: none;
        }
        .home-screen__image-corner--left {
          left: 0;
          border-left: 3px solid rgba(0,0,0,.72);
          border-radius: 0 0 0 18px;
        }
        .home-screen__image-corner--right {
          right: 0;
          border-right: 3px solid rgba(0,0,0,.72);
          border-radius: 0 0 18px 0;
        }
        .home-screen__image-glow {
          position: absolute;
          inset: -20px;
          border-radius: inherit;
          background: rgba(0, 0, 0, 0.06);
          z-index: -1;
          filter: blur(30px);
        }
        .home-screen__text {
          max-width: clamp(420px, 43vw, 720px);
          text-align: left;
        }
        .home-screen__title {
          font-size: clamp(52px, 5.4vw, 88px);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: 0.04em;
          margin-bottom: 28px;
          color: #000;
        }
        .home-screen__subtitle {
          max-width: 650px;
          font-size: clamp(20px, 1.9vw, 30px);
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 48px;
          font-weight: 400;
        }
        .home-screen__cta {
          display: block;
          font-size: clamp(17px, 1.6vw, 22px);
        }

        @media (orientation: portrait), (max-width: 900px) {
          .home-screen__content {
            flex-direction: column;
            gap: var(--space-md);
            padding: calc(var(--space-lg) + 40px) var(--space-md) var(--space-md);
          }
        }
      `}</style>
    </div>
  )
}
