import { TStoreState } from "../redux/store"
import { timeout } from "../utils/kronosUtils"
import { allFiltersMatching } from "./stepnFilterService"
import { EGemQuality, EGemType } from "./stepnGemService"
import { formatPrice } from "./stepnPageService"
import { listenToWindowMessages } from "./windowMessagingService"

let paramsDefinedByUser =
  "&order=2001&chain=103&type=&gType=&quality=&level=0&breed=0"

export const defaultRequestParams = [
  "order",
  "chain", // Sol, Bnb, Eth
  "type", // Sneakers or Shoe boxes
  "gType",
  "quality", // Common, Uncommon, Rare, Epic, Legendary
  "level",
  "bread", // Mint - there is a spelling mistake in the API 🥖🍞🥐🥯
  "breed", // To accommodate query param once API is fixed
  "otd", // Rarity
]

const sneakersPerPage = 60
const stepnApiOrigin = "https://api.stepn.com"
const stepnEndpoints = {
  orderList: (pageIndex: number, sessionId: string) =>
    `${stepnApiOrigin}/run/orderlist?refresh=false&page=${pageIndex}&sessionID=${sessionId}&simulated=true${paramsDefinedByUser}`,
  orderData: (orderId: number, sessionId: string) =>
    `${stepnApiOrigin}/run/orderdata?orderId=${orderId}&sessionID=${sessionId}&simulated=true`,
}

export interface IStepnOrder {
  addRatio: number
  dataID: number
  hp: number
  id: number
  img: string
  level: number
  lifeRatio: number
  mint: number
  otd: number
  propID: number
  quality: number
  sellPrice: number
  speedMax: number
  speedMin: number
  time: number
  v1: number
  v2: number
}

let searchInterrupted = false
listenToWindowMessages((type, data, from) => {
  if (from !== "ContentScript") return

  if (type === "StartSearch") {
    searchInterrupted = false
  }
  if (type === "StopSearch") {
    searchInterrupted = true
  }
})

export const findSneakersByFilters = (
  pageIdx: number,
  sessionId: string,
  limitResultsCount: number,
  requestTimeoutSeconds: number,
  foundSneakerOrders: IStepnOrder[],
  notifyWithCurrentIterationInfo: (
    itIndex: number,
    formattedSellPrice: string,
    foundOrdersAfterIt: IStepnOrder[]
  ) => void,
  storeState: TStoreState
) =>
  new Promise((resolve, reject) => {
    const orderListUrl = stepnEndpoints.orderList(pageIdx, sessionId)
    fetch(orderListUrl, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((e) => e.json())
      .then(async (e) => {
        console.log(orderListUrl, e)
        const data = e.data as IStepnOrder[]
        if (!data || data.length === 0) {
          reject(false)
          throw new Error("Order list request error")
        }

        let currentIterationSet = (pageIdx + 1) * sneakersPerPage
        let currentOrderIteration = currentIterationSet - sneakersPerPage

        for (let order of data) {
          currentOrderIteration++
          if (
            searchInterrupted ||
            (limitResultsCount &&
              foundSneakerOrders.length >= limitResultsCount)
          ) {
            resolve(true)
            return
          }

          notifyWithCurrentIterationInfo(
            currentOrderIteration,
            formatPrice(order.sellPrice),
            foundSneakerOrders
          )

          // Await necessary amount of ms to avoid getting blacklisted IP
          await timeout(requestTimeoutSeconds * 1000)

          const orderData = await getOrderData(order.id, sessionId)

          // Sneaker is no longer available
          if (!orderData) {
            continue
          }

          // Attributes are not present when shoebox is encountered
          if (!orderData.attrs) {
            continue
          }

          if (!allFiltersMatching(orderData, storeState)) {
            continue
          }

          foundSneakerOrders.push(order)
          notifyWithCurrentIterationInfo(
            currentOrderIteration,
            formatPrice(order.sellPrice),
            foundSneakerOrders
          )

          if (foundSneakerOrders.length === limitResultsCount) {
            resolve(true)
          }
        }
        resolve(false)
      })
  })

export interface IOrderData {
  attrs: Array<number> // [0-Efficiency, 1-Luck, 2-Comfort, 3-Resilience] all bases, [4-7] points assigned respectively
  breed: number // [0-7]
  holes: [IOrderDataHole, IOrderDataHole, IOrderDataHole, IOrderDataHole]
  level: number // [0-30]
  type: ESneakerType
}

export interface IOrderDataHole {
  type: EGemType
  quality: EGemQuality
}

enum ESneakerType {
  Walker = 1,
  Jogger = 2,
  Runner = 3,
  Trainer = 4,
}

const getOrderData = async (orderId: number, sessionId: string) =>
  new Promise<IOrderData | undefined>((resolve, reject) => {
    const orderDataUrl = stepnEndpoints.orderData(orderId, sessionId)
    fetch(orderDataUrl, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((e) => e.json())
      .then((e) => {
        const data = e.data as IOrderData
        if (!data) {
          resolve(undefined)
        }
        resolve(data)
      })
  })
