import { getCookie } from "typescript-cookie"
import { TStoreState } from "../redux/store"
import { TSearchResultUpdate } from "../types/messageTypes"
import { timeout } from "../utils/kronosUtils"
import { findSneakersByFilters, IStepnOrder } from "./stepnApiService"
import { interceptStepnRequests } from "./stepnInterceptorService"
import { sendWindowMessage } from "./windowMessagingService"

export const shiftToFirstAvailableSortOption = async () => {
  const sortDropdownButton = document.querySelector(
    "#__next > main > div:last-child > div:last-child [id^='headlessui-listbox-button']"
  )
  if (sortDropdownButton === null) {
    alert("Native sort dropdown is not accessible")
    return
  }
  sortDropdownButton.textContent = "Enchanced Filtering"
  sortDropdownButton.dispatchEvent(new Event("click", { bubbles: true }))

  // Wait till options are rendered
  await timeout(0.25 * 1000)

  const availableSortOption = document.querySelector(
    "li[id^=headlessui-listbox-option]:not([aria-selected])"
  )
  if (availableSortOption === null) {
    alert("Available sort option is not accessible")
    return
  }
  availableSortOption.dispatchEvent(new Event("click", { bubbles: true }))
}

export const getSessionId = () => {
  const sessionId = getCookie("sessionID")
  if (!sessionId) return
  return encodeURIComponent(sessionId)
}

export const formatPrice = (price: number) => (price / 1000000).toFixed(4)

export const applyEnhancedFilters = async (
  storeState: TStoreState,
  sessionId: string
) => {
  let pageIndex = 0
  let foundSneakerOrders: IStepnOrder[] = []

  // TODO: define values
  const limitResultsCount = 5
  const requestTimeoutSeconds = 0.25

  //TODO: notify popup to display progress element

  const notifyWithCurrentIterationInfo = (
    itIndex: number,
    formattedSellPrice: string,
    foundOrdersAfterIt: IStepnOrder[]
  ) => {
    foundSneakerOrders = foundOrdersAfterIt
    sendWindowMessage<TSearchResultUpdate>(
      {
        checkedSneakersCount: itIndex,
        currentSneakerSellPrice: formattedSellPrice,
        foundSneakersCount: foundSneakerOrders.length,
      },
      "SearchResultUpdate",
      "HostSiteScript"
    )
  }

  while (true) {
    await timeout(requestTimeoutSeconds * 1000)

    const finishedFiltering = await findSneakersByFilters(
      pageIndex++,
      sessionId,
      limitResultsCount,
      requestTimeoutSeconds,
      foundSneakerOrders,
      notifyWithCurrentIterationInfo,
      storeState
    )
    if (finishedFiltering) {
      interceptStepnRequests(foundSneakerOrders)

      // Interceptor will alter sort results with found sneakers
      shiftToFirstAvailableSortOption()
      return
    }
  }
}
