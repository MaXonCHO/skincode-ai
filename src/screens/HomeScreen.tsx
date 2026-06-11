import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { SlideToScan } from '../components/SlideToScan'
import heroPhoto from '../../photo/hero-block-new.png'

interface HomeScreenProps {
  onStart: () => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="screen home-screen">
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
          <motion.div
            className="home-screen__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SlideToScan
              onComplete={onStart}
              label="Проведите, чтобы начать подбор →"
              completedLabel="Начинаем подбор..."
            />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .home-screen__content {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 52%) minmax(0, 48%);
          background:
            radial-gradient(circle at 14% 18%, rgba(255,223,213,.92), transparent 34%),
            radial-gradient(circle at 86% 82%, rgba(218,208,250,.88), transparent 42%),
            #f5f1fa;
        }
        .home-screen > .logo {
          filter: brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,.32));
        }
        .home-screen__visual {
          position: relative;
          min-width: 0;
          height: 100%;
        }
        .home-screen__image-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .home-screen__image-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, rgba(237,220,250,.2), rgba(255,216,200,.13));
          pointer-events: none;
        }
        .home-screen__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 38%;
        }
        .home-screen__text {
          align-self: center;
          max-width: 760px;
          padding: clamp(48px, 7vw, 120px);
          text-align: left;
          color: var(--color-foreground);
        }
        .home-screen__title {
          font-size: clamp(52px, 5.4vw, 88px);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: 0.04em;
          margin-bottom: 28px;
          color: var(--color-foreground);
        }
        .home-screen__subtitle {
          max-width: 650px;
          font-size: clamp(20px, 1.9vw, 30px);
          line-height: 1.6;
          color: rgba(41,38,52,.62);
          margin-bottom: 48px;
          font-weight: 400;
        }
        .home-screen__cta {
          width: min(100%, 520px);
        }
        .home-screen__cta .slide-to-scan {
          max-width: none;
          padding: 0;
        }
        .home-screen__cta .slide-to-scan__track {
          border-color: rgba(255,255,255,.92);
          background: rgba(255,255,255,.42);
          box-shadow: inset 0 1px 0 #fff, 0 18px 46px rgba(108,92,143,.14);
        }
        .home-screen__cta .slide-to-scan__thumb {
          color: var(--color-primary);
          border-color: rgba(255,255,255,.96);
          background: rgba(255,255,255,.78);
          box-shadow: 0 8px 22px rgba(108,92,143,.16);
        }
        .home-screen__cta .slide-to-scan__label {
          color: rgba(41,38,52,.66);
        }
        .home-screen__cta .slide-to-scan__fill {
          background: linear-gradient(90deg, rgba(249,208,211,.32), rgba(215,205,247,.48));
        }

        @media (orientation: portrait), (max-width: 900px) {
          .home-screen__content {
            display: block;
            position: relative;
            background: #ece6f4;
          }
          .home-screen__visual {
            position: absolute;
            inset: 0;
          }
          .home-screen__image-wrapper::after {
            background:
              linear-gradient(180deg, rgba(225,216,250,.12) 0%, transparent 38%, rgba(67,55,79,.4) 100%),
              linear-gradient(145deg, rgba(237,220,250,.16), rgba(255,216,200,.1));
          }
          .home-screen__image {
            object-position: center 32%;
          }
          .home-screen__text {
            position: absolute;
            left: var(--space-md);
            right: var(--space-md);
            bottom: var(--space-md);
            z-index: 3;
            max-width: none;
            padding: clamp(8px, 2vw, 16px);
            border: 0;
            border-radius: 0;
            background: transparent;
            color: #fff;
            backdrop-filter: none;
          }
          .home-screen__title {
            color: #fff;
            font-size: clamp(42px, 9vw, 72px);
            text-shadow: 0 3px 18px rgba(0,0,0,.42);
          }
          .home-screen__subtitle {
            color: rgba(255,255,255,.78);
            margin-bottom: 28px;
            text-shadow: 0 2px 12px rgba(0,0,0,.5);
          }
          .home-screen__cta .slide-to-scan__track,
          .home-screen__cta .slide-to-scan__thumb {
            border-color: rgba(255,255,255,.94);
            color: #fff;
          }
          .home-screen__cta .slide-to-scan__track {
            background: rgba(255,255,255,.2);
            box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 18px 42px rgba(50,38,66,.16);
          }
          .home-screen__cta .slide-to-scan__thumb {
            background: rgba(255,255,255,.3);
          }
          .home-screen__cta .slide-to-scan__label {
            color: rgba(255,255,255,.8);
          }
          .home-screen__cta .slide-to-scan__fill {
            background: rgba(255,255,255,.12);
          }
        }
      `}</style>
    </div>
  )
}
