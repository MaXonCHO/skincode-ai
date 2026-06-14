import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getCatalogMatches } from '../utils/catalog'
import { formatPrice, formatProfileValue } from '../utils/matching'
import type { SkinProfile } from '../types'

type PriceSort = 'match' | 'price-asc' | 'price-desc'

interface CatalogScreenProps {
  profile: SkinProfile
  onBack: () => void
}

export function CatalogScreen({ profile, onBack }: CatalogScreenProps) {
  const matches = useMemo(() => getCatalogMatches(profile), [profile])
  const [texture, setTexture] = useState('all')
  const [finish, setFinish] = useState('all')
  const [brand, setBrand] = useState('all')
  const [priceSort, setPriceSort] = useState<PriceSort>('match')

  const textures = useMemo(() => getOptions(matches.map((item) => item.texture)), [matches])
  const finishes = useMemo(() => getOptions(matches.map((item) => item.finish)), [matches])
  const brands = useMemo(() => getOptions(matches.map((item) => item.brand)), [matches])

  const visibleProducts = useMemo(() => {
    const filtered = matches.filter((product) =>
      (texture === 'all' || product.texture === texture) &&
      (finish === 'all' || product.finish === finish) &&
      (brand === 'all' || product.brand === brand)
    )

    if (priceSort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price)
    if (priceSort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [brand, finish, matches, priceSort, texture])

  const resetFilters = () => {
    setTexture('all')
    setFinish('all')
    setBrand('all')
    setPriceSort('match')
  }

  return (
    <div className="screen catalog-screen">
      <div className="catalog-screen__glow catalog-screen__glow--pink" />
      <div className="catalog-screen__glow catalog-screen__glow--lime" />

      <header className="catalog-screen__header">
        <button className="catalog-screen__back" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span>
          На главную
        </button>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="catalog-screen__eyebrow">Персональная коллекция</span>
          <h1>Все оттенки,<br />которые тебе подходят</h1>
        </motion.div>

        <div className="catalog-screen__profile">
          <div>
            <span>Подтон</span>
            <strong>{formatProfileValue(profile.undertone)}</strong>
          </div>
          <div>
            <span>Тип кожи</span>
            <strong>{formatProfileValue(profile.skinType)}</strong>
          </div>
        </div>
      </header>

      <main className="catalog-screen__main">
        <section className="catalog-screen__filters glass" aria-label="Фильтры каталога">
          <FilterSelect label="Текстура" value={texture} onChange={setTexture} options={textures} />
          <FilterSelect label="Финиш" value={finish} onChange={setFinish} options={finishes} />
          <FilterSelect label="Бренд" value={brand} onChange={setBrand} options={brands} />

          <label className="catalog-screen__filter">
            <span>Сортировка</span>
            <select value={priceSort} onChange={(event) => setPriceSort(event.target.value as PriceSort)}>
              <option value="match">По совпадению</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </label>

          <button type="button" className="catalog-screen__reset" onClick={resetFilters}>
            Сбросить
          </button>
        </section>

        <div className="catalog-screen__summary">
          <p><strong>{visibleProducts.length}</strong> подходящих средств</p>
          <span>Для каждого средства выбран наиболее подходящий оттенок</span>
        </div>

        <section className="catalog-screen__grid" aria-live="polite">
          {visibleProducts.map((product) => (
            <a
              key={product.id}
              className="catalog-product glass"
              href={product.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Открыть ${product.brand} ${product.name}`}
            >
              <div className="catalog-product__top">
                <span className="catalog-product__brand">{product.brand}</span>
                <span className="catalog-product__score">{product.matchScore}%</span>
              </div>

              <div className="catalog-product__swatch">
                <span style={{ background: rgbColor(product.shade.rgb) }} />
                <img
                  src={product.shade.swatchUrl}
                  alt={`Оттенок ${product.shade.name}`}
                  loading="lazy"
                />
              </div>

              <div className="catalog-product__body">
                <h2>{product.name}</h2>
                <p className="catalog-product__shade">Оттенок {product.shade.name}</p>
                <div className="catalog-product__tags">
                  <span>{product.texture}</span>
                  <span>{product.finish}</span>
                </div>
                <div className="catalog-product__footer">
                  <strong>{formatPrice(product.price)}</strong>
                  <span>Открыть ↗</span>
                </div>
              </div>
            </a>
          ))}
        </section>

        {visibleProducts.length === 0 && (
          <div className="catalog-screen__empty glass">
            <h2>Подходящих средств не найдено</h2>
            <p>Попробуйте сбросить один или несколько фильтров.</p>
            <button type="button" onClick={resetFilters}>Сбросить фильтры</button>
          </div>
        )}
      </main>

      <style>{`
        .catalog-screen {
          display: block;
          overflow-y: auto;
          overflow-x: hidden;
          background: #fff;
          color: #171419;
          user-select: text;
        }
        .catalog-screen__glow {
          position: fixed;
          z-index: 0;
          border-radius: 50%;
          filter: blur(52px);
          pointer-events: none;
        }
        .catalog-screen__glow--pink {
          width: 48vw;
          height: 48vw;
          top: -24vw;
          right: -8vw;
          background: rgba(255,182,210,.38);
        }
        .catalog-screen__glow--lime {
          width: 45vw;
          height: 32vw;
          left: -10vw;
          bottom: -18vw;
          background: rgba(210,235,11,.28);
        }
        .catalog-screen__header,
        .catalog-screen__main {
          position: relative;
          z-index: 1;
          width: min(100% - 40px, 1480px);
          margin: 0 auto;
        }
        .catalog-screen__header {
          min-height: 300px;
          display: grid;
          grid-template-columns: 180px 1fr auto;
          align-items: center;
          gap: 32px;
          padding: 32px 0 24px;
        }
        .catalog-screen__back,
        .catalog-screen__reset,
        .catalog-screen__empty button {
          min-height: 44px;
          border: 1px solid rgba(23,20,25,.2);
          border-radius: 999px;
          background: rgba(255,255,255,.38);
          backdrop-filter: blur(18px);
          color: #171419;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 650;
          transition: background .22s ease, border-color .22s ease, transform .22s ease;
        }
        .catalog-screen__back {
          justify-self: start;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 18px;
        }
        .catalog-screen__back span {
          font-size: 20px;
        }
        .catalog-screen__back:hover,
        .catalog-screen__reset:hover,
        .catalog-screen__empty button:hover {
          border-color: #171419;
          background: rgba(255,255,255,.7);
          transform: translateY(-1px);
        }
        .catalog-screen__eyebrow {
          display: block;
          margin-bottom: 12px;
          color: rgba(23,20,25,.52);
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .catalog-screen__header h1 {
          max-width: 800px;
          font-size: clamp(46px, 6vw, 92px);
          font-weight: 650;
          line-height: .94;
          letter-spacing: -.055em;
        }
        .catalog-screen__profile {
          display: flex;
          gap: 8px;
          align-self: start;
          padding-top: 10px;
        }
        .catalog-screen__profile div {
          min-width: 130px;
          padding: 12px 14px;
          border: 1px solid rgba(255,255,255,.75);
          border-radius: 18px;
          background: rgba(255,255,255,.4);
          backdrop-filter: blur(22px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 14px 36px rgba(62,36,72,.08);
        }
        .catalog-screen__profile span,
        .catalog-screen__filter > span {
          display: block;
          margin-bottom: 4px;
          color: rgba(23,20,25,.48);
          font-size: 9px;
          font-weight: 750;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .catalog-screen__profile strong {
          font-size: 13px;
        }
        .catalog-screen__main {
          padding-bottom: 80px;
        }
        .catalog-screen__filters {
          position: sticky;
          z-index: 10;
          top: 16px;
          display: grid;
          grid-template-columns: repeat(4, minmax(130px, 1fr)) auto;
          gap: 10px;
          padding: 12px;
          border-radius: 24px;
          background: rgba(255,255,255,.58);
        }
        .catalog-screen__filter select {
          width: 100%;
          min-height: 44px;
          padding: 0 36px 0 13px;
          border: 1px solid rgba(23,20,25,.13);
          border-radius: 13px;
          background: rgba(255,255,255,.5);
          color: #171419;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
        }
        .catalog-screen__filter select:focus-visible {
          outline: 3px solid rgba(210,235,11,.8);
          outline-offset: 2px;
        }
        .catalog-screen__reset {
          align-self: end;
          padding: 0 18px;
        }
        .catalog-screen__summary {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 20px;
          padding: 34px 4px 20px;
          color: rgba(23,20,25,.55);
          font-size: 13px;
        }
        .catalog-screen__summary strong {
          color: #171419;
          font-size: 24px;
        }
        .catalog-screen__grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        .catalog-product {
          min-width: 0;
          padding: 15px;
          border-radius: 26px;
          color: #171419;
          text-decoration: none;
          background: rgba(255,255,255,.46);
          transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease, border-color .25s ease;
        }
        .catalog-product:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,.96);
          box-shadow: inset 0 1px 0 #fff, 0 24px 52px rgba(62,36,72,.16);
        }
        .catalog-product:focus-visible {
          outline: 3px solid #d2eb0b;
          outline-offset: 3px;
        }
        .catalog-product__top,
        .catalog-product__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .catalog-product__brand {
          overflow: hidden;
          color: rgba(23,20,25,.52);
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .1em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .catalog-product__score {
          flex: 0 0 auto;
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(210,235,11,.68);
          font-size: 11px;
          font-weight: 750;
        }
        .catalog-product__swatch {
          position: relative;
          height: 150px;
          margin: 13px 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.72);
          border-radius: 20px;
          background: rgba(255,255,255,.32);
        }
        .catalog-product__swatch span,
        .catalog-product__swatch img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .catalog-product__swatch img {
          object-fit: cover;
          transition: transform .35s cubic-bezier(.22,1,.36,1);
        }
        .catalog-product:hover .catalog-product__swatch img {
          transform: scale(1.035);
        }
        .catalog-product__body h2 {
          min-height: 44px;
          overflow: hidden;
          font-size: 18px;
          font-weight: 650;
          line-height: 1.2;
          letter-spacing: -.02em;
        }
        .catalog-product__shade {
          margin: 7px 0 12px;
          color: rgba(23,20,25,.54);
          font-size: 12px;
        }
        .catalog-product__tags {
          min-height: 48px;
          display: flex;
          align-content: flex-start;
          flex-wrap: wrap;
          gap: 5px;
        }
        .catalog-product__tags span {
          padding: 5px 7px;
          border: 1px solid rgba(23,20,25,.09);
          border-radius: 999px;
          background: rgba(255,255,255,.4);
          color: rgba(23,20,25,.62);
          font-size: 9px;
          text-transform: uppercase;
        }
        .catalog-product__footer {
          margin-top: 16px;
          padding-top: 13px;
          border-top: 1px solid rgba(23,20,25,.08);
          font-size: 12px;
        }
        .catalog-product__footer strong {
          font-size: 16px;
          font-variant-numeric: tabular-nums;
        }
        .catalog-product__footer span {
          color: rgba(23,20,25,.5);
        }
        .catalog-screen__empty {
          max-width: 520px;
          margin: 48px auto;
          padding: 36px;
          text-align: center;
        }
        .catalog-screen__empty h2 {
          margin-bottom: 8px;
          font-size: 24px;
        }
        .catalog-screen__empty p {
          margin-bottom: 20px;
          color: rgba(23,20,25,.58);
        }
        .catalog-screen__empty button {
          padding: 0 20px;
        }
        @media (max-width: 1100px) {
          .catalog-screen__header {
            grid-template-columns: 150px 1fr;
          }
          .catalog-screen__profile {
            grid-column: 2;
            padding-top: 0;
          }
          .catalog-screen__filters {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .catalog-screen__grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 760px) {
          .catalog-screen__header,
          .catalog-screen__main {
            width: min(100% - 24px, 1480px);
          }
          .catalog-screen__header {
            min-height: auto;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
            padding: 20px 0 28px;
          }
          .catalog-screen__header h1 {
            font-size: clamp(42px, 13vw, 66px);
          }
          .catalog-screen__profile {
            width: 100%;
          }
          .catalog-screen__profile div {
            min-width: 0;
            flex: 1;
          }
          .catalog-screen__filters {
            position: relative;
            top: 0;
            grid-template-columns: 1fr;
          }
          .catalog-screen__summary {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
          }
          .catalog-screen__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
        }
        @media (max-width: 480px) {
          .catalog-screen__grid {
            grid-template-columns: 1fr;
          }
          .catalog-product__swatch {
            height: 180px;
          }
        }
      `}</style>
    </div>
  )
}

interface FilterSelectProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="catalog-screen__filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">Все</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function getOptions(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'ru'))
}

function rgbColor(rgb: { r: number; g: number; b: number }): string {
  return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`
}
