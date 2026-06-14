import { getPriceBandRecommendations } from './catalog'
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
  return getPriceBandRecommendations(profile)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}
