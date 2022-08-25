import { TStoreState } from "../redux/store"
import { IOrderData, IOrderDataHole } from "./stepnApiService"

export const checkBaseAttributes = (
  orderData: IOrderData,
  storeState: TStoreState
) => {
  const orderBaseEff = orderData.attrs[0] / 10
  const orderBaseLuck = orderData.attrs[1] / 10
  const orderBaseCom = orderData.attrs[2] / 10
  const orderBaseRes = orderData.attrs[3] / 10

  // TODO: update algorithm to only consider presented values
  const minEffBase = storeState.attributeFilters.efficiency.minBase || 0
  const minLuckBase = storeState.attributeFilters.luck.minBase || 0
  const minComBase = storeState.attributeFilters.comfort.minBase || 0
  const minResBase = storeState.attributeFilters.resilience.minBase || 0

  const baseAttributesFilterMatch =
    minEffBase <= orderBaseEff &&
    minLuckBase <= orderBaseLuck &&
    minComBase <= orderBaseCom &&
    minResBase <= orderBaseRes

  return baseAttributesFilterMatch
}

export const checkSockets = (
  orderData: IOrderData,
  storeState: TStoreState
) => {
  const useSocketsFilters = storeState.socketFilters.sockets
  // TODO: Get from storage
  const gemSocketsInOrder = false
  const socketFilters = storeState.socketFilters.sockets

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

export const allFiltersMatching = (
  orderData: IOrderData,
  storeState: TStoreState
) => {
  if (!checkSockets(orderData, storeState)) return false
  if (!checkBaseAttributes(orderData, storeState)) return false
  return true
}

interface IFilteredSneakerHole extends IOrderDataHole {
  checked: boolean
}
