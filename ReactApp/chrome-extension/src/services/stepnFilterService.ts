import { IOrderData, IOrderDataHole } from "./stepnApiService"
import { EGemLevel } from "./stepnGemService"

export const checkBaseAttributes = (orderData: IOrderData) => {
  const orderBaseEff = orderData.attrs[0] / 10
  const orderBaseLuck = orderData.attrs[1] / 10
  const orderBaseCom = orderData.attrs[2] / 10
  const orderBaseRes = orderData.attrs[3] / 10

  // TODO: Get from storage
  const minEffBase = 0
  const minLuckBase = 0
  const minComBase = 0
  const minResBase = 0

  const baseAttributesFilterMatch =
    minEffBase <= orderBaseEff &&
    minLuckBase <= orderBaseLuck &&
    minComBase <= orderBaseCom &&
    minResBase <= orderBaseRes

  return baseAttributesFilterMatch
}

export const checkSockets = (orderData: IOrderData) => {
  // TODO: Get from storage
  const useSocketsFilters = false
  const gemSocketsInOrder = false
  const socketFilters = [
    {
      type: 1,
      quality: EGemLevel.Common,
    },
  ]

  if (!useSocketsFilters) return true

  if (gemSocketsInOrder) {
    const socketsMatching = orderData.holes.every((hole, idx) => {
      const socketOrder = idx + 1

      // No filter specified for this socket
      if (!socketFilters[socketOrder]) {
        return true
      }

      const typeFilterMatch =
        // TODO: verify this condition
        typeof socketFilters[socketOrder].type === "undefined" ||
        socketFilters[socketOrder].type === hole.type

      const qualityFilterMatch =
        typeof socketFilters[socketOrder].quality === "undefined" ||
        socketFilters[socketOrder].quality === hole.quality

      return typeFilterMatch && qualityFilterMatch
    })
    return socketsMatching
  }

  const socketsMatching = Object.values(socketFilters).every((socketFilter) => {
    const filteredHoles = orderData.holes as [
      IFilteredSneakerHole,
      IFilteredSneakerHole,
      IFilteredSneakerHole,
      IFilteredSneakerHole
    ]
    const someUncheckedHoleMatchesFilter = filteredHoles.some(
      (filteredHole) => {
        if (filteredHole.checked) return false

        const typeFilterMatch =
          typeof socketFilter.type === "undefined" ||
          // TODO: test if comparison works
          socketFilter.type === filteredHole.type

        const qualityFilterMatch =
          typeof socketFilter.quality === "undefined" ||
          socketFilter.quality === filteredHole.quality

        if (typeFilterMatch && qualityFilterMatch) {
          filteredHole.checked = true
          return true
        }
        return false
      }
    )
    return someUncheckedHoleMatchesFilter
  })
  return socketsMatching
}

export const allFiltersMatching = (orderData: IOrderData) => {
  if (!checkSockets(orderData)) return false
  if (!checkBaseAttributes(orderData)) return false
  return true
}

interface IFilteredSneakerHole extends IOrderDataHole {
  checked: boolean
}
