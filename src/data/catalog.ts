import catalogSource from '../../products (2) copy.json'
import type { CatalogProduct, CatalogShade } from '../types'

interface RawCatalogShade {
  name: string
  swatch_url: string
  rgb: CatalogShade['rgb']
  lab: CatalogShade['lab']
}

interface RawCatalogProduct {
  name: string
  price: string
  brand: string
  colors: RawCatalogShade[]
  url: string
  skin_type: string | null
  texture: string | null
  finish: string | null
}

const sourceProducts = catalogSource.products as RawCatalogProduct[]

export const catalogProducts: CatalogProduct[] = sourceProducts.map((product, index) => {
  const brand = product.brand.trim() || inferBrand(product.name)

  return {
    id: String(index + 1),
    brand,
    name: cleanProductName(product.name, brand),
    price: parsePrice(product.price),
    url: product.url,
    skinType: product.skin_type || 'для всех типов кожи',
    texture: product.texture || 'не указана',
    finish: product.finish || 'не указан',
    shades: (product.colors || []).map((shade) => ({
      name: shade.name,
      swatchUrl: shade.swatch_url,
      rgb: shade.rgb,
      lab: shade.lab,
    })),
  }
})

function parsePrice(value: string): number {
  return Number(value.replace(/\D/g, '')) || 0
}

function inferBrand(name: string): string {
  const uppercasePrefix = name.match(/^([A-ZА-ЯЁ0-9&.'*-]{2,}?)(?=[A-ZА-ЯЁ][a-zа-яё]|[a-zа-яё])/)
  if (uppercasePrefix) return uppercasePrefix[1].replace(/\*$/, '')

  const titleCasePrefix = name.match(/^([A-ZА-ЯЁ][a-zа-яё]+)(?=[A-ZА-ЯЁ])/)
  if (titleCasePrefix) return titleCasePrefix[1]

  return name.split(/\s+/)[0].replace(/\*$/, '')
}

function cleanProductName(name: string, brand: string): string {
  const withoutBrand = name.slice(brand.length).replace(/^\*?\s*/, '')
  return withoutBrand || name
}
