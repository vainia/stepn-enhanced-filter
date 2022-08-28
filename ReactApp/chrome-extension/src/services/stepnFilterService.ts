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

  const { efficiency, luck, comfort, resilience } =
    storeState.attributeFilters.attrs

  const minEffBase = efficiency.minBase || 0
  const minLuckBase = luck.minBase || 0
  const minComBase = comfort.minBase || 0
  const minResBase = resilience.minBase || 0

  const baseAttributesFilterMatch =
    minEffBase <= orderBaseEff &&
    minLuckBase <= orderBaseLuck &&
    minComBase <= orderBaseCom &&
    minResBase <= orderBaseRes

  return baseAttributesFilterMatch
}

export const checkAssignedAttributes = (
  orderData: IOrderData,
  storeState: TStoreState
) => {
  const orderAssEff = orderData.attrs[4] / 10
  const orderAssLuck = orderData.attrs[5] / 10
  const orderAssCom = orderData.attrs[6] / 10
  const orderAssRes = orderData.attrs[7] / 10

  const { efficiency, luck, comfort, resilience } =
    storeState.attributeFilters.attrs

  const minEffAss = efficiency.minAssigned || 0
  const minLuckAss = luck.minAssigned || 0
  const minComAss = comfort.minAssigned || 0
  const minResAss = resilience.minAssigned || 0

  const assAttributesFilterMatch =
    minEffAss <= orderAssEff &&
    minLuckAss <= orderAssLuck &&
    minComAss <= orderAssCom &&
    minResAss <= orderAssRes

  return assAttributesFilterMatch
}

export const checkSockets = (
  orderData: IOrderData,
  storeState: TStoreState
) => {
  const gemSocketsInOrder = storeState.socketFilters.followOrder
  const socketFilters = storeState.socketFilters.sockets

  if (!socketFilters || socketFilters.length === 0) return true

  if (gemSocketsInOrder) {
    const socketsMatching = orderData.holes.every((hole, idx) => {
      const socketOrder = idx

      // No filter specified for this socket
      if (!socketFilters[socketOrder]) {
        return true
      }

      const typeFilterMatch =
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

const checkOnlyBaseAttributes = (
  orderData: IOrderData,
  storeState: TStoreState
) => {
  if (!storeState.attributeFilters.onlyBaseAttributes) return true
  return (
    orderData.attrs[4] === 0 &&
    orderData.attrs[4] === 0 &&
    orderData.attrs[4] === 0 &&
    orderData.attrs[4] === 0
  )
}

export const allFiltersMatching = (
  orderData: IOrderData,
  storeState: TStoreState
) => {
  if (!checkSockets(orderData, storeState)) return false
  if (!checkBaseAttributes(orderData, storeState)) return false
  if (!checkAssignedAttributes(orderData, storeState)) return false
  if (!checkOnlyBaseAttributes(orderData, storeState)) return false
  return true
}

interface IFilteredSneakerHole extends IOrderDataHole {
  checked: boolean
}
