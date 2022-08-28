import { IStepnOrder } from "./stepnApiService"

// eslint-disable-next-line
let paramsDefinedByUser =
  "&order=2001&chain=103&type=&gType=&quality=&level=0&breed=0"

const { fetch: origFetch } = window

// Intercept the order list request and replace it with the target order list
export const interceptStepnRequests = (foundSneakerOrders?: IStepnOrder[]) => {
  window.fetch = async (...args) => {
    return new Promise(async (resolve, reject) => {
      const response = await origFetch(...args)
      const requestUrl = args[0] as string

      const orderListRequest = requestUrl.indexOf("orderlist") !== -1
      if (!orderListRequest) {
        resolve(response)
      }

      const requestSimulatedByExtension = requestUrl.indexOf("simulated") > 0

      // If new order list is requested by user grab native filter parameters to combine with enhanced filter
      if (!requestSimulatedByExtension) {
        var url = new URL(requestUrl)

        paramsDefinedByUser =
          "&order=" +
          url.searchParams.get("order") +
          "&chain=" +
          url.searchParams.get("chain") +
          "&type=" +
          url.searchParams.get("type") +
          "&gType=" +
          url.searchParams.get("gType") +
          "&quality=" +
          url.searchParams.get("quality") +
          "&level=" +
          url.searchParams.get("level") +
          "&breed=" +
          url.searchParams.get("breed")
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
