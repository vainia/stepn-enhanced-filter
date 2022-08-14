import { EGemType } from "./stepnGemService"

export const attributeTypes = ['efficiency', 'luck', 'comfort', 'resilience'] as const
export type TAttribute = typeof attributeTypes[number]

export const getAttributeTypeForGemType = (gemType: EGemType) => EGemType[gemType].toLowerCase() as TAttribute

export const getAttributeIconUrl = (attribute: TAttribute) => `https://m.stepn.com/images/${attribute}.svg`