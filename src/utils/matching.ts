import { products } from '../data/products'
import type { Coverage, Finish, ScoredProduct, SkinProfile, SkinType, Undertone } from '../types'

const displayLabels = {
  Warm: 'Тёплый',
  Cool: 'Холодный',
  Neutral: 'Нейтральный',
  Olive: 'Оливковый',
  Dry: 'Сухая',
  Normal: 'Нормальная',
  Oily: 'Жирная',
  Combination: 'Комбинированная',
  Light: 'Лёгкое покрытие',
  Medium: 'Среднее покрытие',
  Full: 'Плотное покрытие',
  Matte: 'Матовый финиш',
  Natural: 'Натуральный финиш',
  Dewy: 'Сияющий финиш',
  Satin: 'Сатиновый финиш',
} satisfies Record<Undertone | SkinType | Coverage | Finish, string>

export function formatProfileValue(value: Undertone | SkinType): string {
  return displayLabels[value]
}

export function formatProductTag(value: Coverage | Finish): string {
  return displayLabels[value]
}

export function getRecommendations(profile: SkinProfile): ScoredProduct[] {
  return products
    .map((product) => ({
      ...product,
      matchScore: calculateMatchScore(product.undertone, product.skinType, profile),
    }))
    .filter((p) => p.matchScore >= 70)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)
}

function calculateMatchScore(
  productUndertones: string[],
  productSkinTypes: string[],
  profile: SkinProfile
): number {
  const undertoneMatch = productUndertones.includes(profile.undertone) ? 50 : 15
  const skinTypeMatch = productSkinTypes.includes(profile.skinType) ? 50 : 20
  const bonus = productUndertones.includes(profile.undertone) &&
    productSkinTypes.includes(profile.skinType)
    ? 6
    : 0

  return Math.min(99, undertoneMatch + skinTypeMatch + bonus)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}
