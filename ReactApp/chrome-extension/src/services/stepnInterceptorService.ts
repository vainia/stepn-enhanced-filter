import { TStoreState } from "../redux/store"
import { IStepnOrder } from "./stepnApiService"

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

let paramsDefinedByUser =
  // Some default params 🍞
  "&order=2001&chain=103&type=&gType=&quality=&level=0&bread=0"

const { fetch: origFetch } = window

// Intercept the order list request and replace it with the target order list
export const interceptStepnRequests = (
  storeState: TStoreState,
  foundSneakerOrders?: IStepnOrder[]
) => {
  window.fetch = async (...args) => {
    return new Promise(async (resolve, reject) => {
      const requestUrl = args[0] as string
      const orderListRequest = requestUrl.indexOf("orderlist") !== -1
      const requestSimulatedByExtension = requestUrl.indexOf("simulated") > 0

      if (orderListRequest && requestSimulatedByExtension) {
        args[0] = args[0] + paramsDefinedByUser
      }

      const response = await origFetch(...args)

      if (!orderListRequest) {
        resolve(response)
      }

      // If new order list is requested by user grab native filter parameters to combine with enhanced filter
      if (!requestSimulatedByExtension) {
        var url = new URL(requestUrl)

        const { includedRequestParams } = storeState.settings
        paramsDefinedByUser = includedRequestParams.reduce((prev, curr) => {
          return `${prev}&${curr}=${url.searchParams.get(curr)}`
        }, "")
      }

      response
        .clone()
        .json()
        .then((body) => {
          response.json = () => {
            const avoidInterception =
              requestSimulatedByExtension ||
              !foundSneakerOrders ||
              foundSneakerOrders.length === 0 ||
              !args ||
              !requestUrl

            if (avoidInterception) {
              return body
            }

            body.data = foundSneakerOrders
            return body
          }
          resolve(response)
        })
        .catch((error) => {
          reject(response)
        })
    })
  }
}
