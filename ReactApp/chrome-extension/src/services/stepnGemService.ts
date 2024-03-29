import { enumToMap } from "../utils/enumUtils"
import { TAttribute } from "./stepnAttributesService"

export enum EGemType {
  Efficiency = 1,
  Luck = 2,
  Comfort = 3,
  Resilience = 4,
}
export enum EGemQuality {
  Locked = -1,
  Unrevealed = 0,
  Common = 1,
  Uncommon = 2,
  Rare = 3,
  Epic = 4,
  Legendary = 5,
}

export const getGemTypeFromAttribute = (attribute: TAttribute) => {
  const enumType =
    attribute.charAt(0).toUpperCase() + attribute.slice(1).toLowerCase()
  return EGemType[enumType as keyof typeof EGemType]
}

export const getGemIconUrl = (type: EGemType, quality: EGemQuality) =>
  `https://m.stepn.com/images/gem_${type}_${quality}.svg`

export const gemQualities = Array.from(
  enumToMap(EGemQuality).values()
) as unknown as EGemQuality[]
