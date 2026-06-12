import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const FOUNDATION_COLLECTION_URL = 'https://goldapple.ru/azija/makijazh/dlja-lica/tonal-nye-sredstva?srsltid=AfmBOorvdZxzLKxLTcsiGYV2zlFjAiefIrVsSvarWtjDAmxoe2pRTdLC'

interface RecommendationsQrCardProps {
  isCenter: boolean
}

export function RecommendationsQrCard({ isCenter }: RecommendationsQrCardProps) {
  const [qrImage, setQrImage] = useState('')

  useEffect(() => {
    let active = true

    QRCode.toDataURL(FOUNDATION_COLLECTION_URL, {
      width: 420,
      margin: 2,
      color: { dark: '#171419', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then((image) => {
      if (active) setQrImage(image)
    })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className={`product-card recommendations-qr-card ${isCenter ? 'product-card--center' : ''}`}>
      <div className="recommendations-qr-card__accent">Полная коллекция</div>
      <div className="recommendations-qr-card__content">
        <div className="recommendations-qr-card__copy">
          <span className="recommendations-qr-card__eyebrow">Больше оттенков</span>
          <strong>Все тональные средства в одном месте</strong>
          <p>Отсканируйте QR-код, чтобы открыть полную коллекцию на телефоне.</p>
        </div>
        <div className="recommendations-qr-card__code">
          {qrImage && <img src={qrImage} alt="QR-код коллекции тональных средств" />}
        </div>
      </div>

      <style>{`
        .recommendations-qr-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          color: #171419;
        }
        .recommendations-qr-card::before {
          content: '';
          position: absolute;
          width: 240px;
          height: 240px;
          right: -55px;
          bottom: -80px;
          border-radius: 50%;
          background: rgba(210,235,11,.35);
          filter: blur(30px);
          pointer-events: none;
        }
        .recommendations-qr-card__accent {
          position: relative;
          z-index: 1;
          align-self: flex-start;
          padding: 7px 11px;
          border: 1px solid rgba(23,20,25,.12);
          border-radius: 999px;
          background: rgba(210,235,11,.72);
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .recommendations-qr-card__content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 174px;
          align-items: end;
          gap: 18px;
        }
        .recommendations-qr-card__copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-bottom: 4px;
          text-align: left;
        }
        .recommendations-qr-card__eyebrow {
          margin-bottom: 9px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(20,20,20,.48);
        }
        .recommendations-qr-card__copy strong {
          font-size: clamp(22px, 2vw, 29px);
          line-height: 1.04;
          letter-spacing: -.035em;
        }
        .recommendations-qr-card__copy p {
          margin: 13px 0 0;
          font-size: 12px;
          line-height: 1.45;
          color: rgba(20,20,20,.62);
        }
        .recommendations-qr-card__code {
          width: 174px;
          height: 174px;
          padding: 10px;
          border-radius: 22px;
          background: #fff;
          border: 1px solid rgba(255,255,255,.92);
          box-shadow: inset 0 1px 0 #fff, 0 18px 34px rgba(62,36,72,.18);
        }
        .recommendations-qr-card__code img {
          width: 100%;
          height: 100%;
          display: block;
        }
        @media (max-height: 720px) {
          .recommendations-qr-card__content {
            grid-template-columns: 1fr 150px;
          }
          .recommendations-qr-card__code {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>
    </div>
  )
}
