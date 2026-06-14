export type Undertone = 'Warm' | 'Cool' | 'Neutral' | 'Olive'
export type SkinType = 'Dry' | 'Normal' | 'Oily' | 'Combination'
export type Coverage = 'Light' | 'Medium' | 'Full'
export type Finish = 'Matte' | 'Natural' | 'Dewy' | 'Satin'

export interface SkinProfile {
  undertone: Undertone
  skinType: SkinType
}

export interface Product {
  id: string
  brand: string
  name: string
  shade: string
  undertone: Undertone[]
  skinType: SkinType[]
  coverage: Coverage
  finish: Finish
  price: number
  description: string
  imageColor: string
}

export interface ScoredProduct extends Product {
  matchScore: number
}

export interface CatalogShade {
  name: string
  swatchUrl: string
  rgb: { r: number; g: number; b: number }
  lab: { L: number; a: number; b: number }
}

export interface CatalogProduct {
  id: string
  brand: string
  name: string
  price: number
  url: string
  skinType: string
  texture: string
  finish: string
  shades: CatalogShade[]
}

export interface CatalogMatch extends CatalogProduct {
  shade: CatalogShade
  matchScore: number
}

export type Screen = 'home' | 'scan' | 'parameters' | 'recommendations' | 'catalog'

export interface UndertoneOption {
  id: Undertone
  label: string
  description: string
  color: string
  image: string
}

export interface SkinTypeOption {
  id: SkinType
  label: string
  description: string
  color: string
  image: string
}
