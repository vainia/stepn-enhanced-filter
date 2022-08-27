import { TStoreState } from "../redux/store"
import { interceptStepnRequests } from "../services/stepnInterceptorService"
import {
  applyEnhancedFilters,
  getSessionId,
} from "../services/stepnPageService"
import { listenToWindowMessages } from "../services/windowMessagingService"

const placeholder = document.querySelector(
  "#__next > main > div:last-child > div:first-child > div"
)
placeholder?.insertAdjacentHTML(
  "afterend",
  "<h1>SCRIPT IS ABOUT TO SPIN UP!</h1>"
)

listenToWindowMessages((type, data) => {
  if (type === "StartSearch") {
    const storeState = data as TStoreState
    console.log(storeState)

    const sessionId = getSessionId()
    if (!sessionId) {
      console.log("STEPN session ID is missing. User isn't logged in")
      return
    }

    applyEnhancedFilters(storeState, sessionId)
  }
  if (type === "CheckSession") {
    const sessionId = getSessionId()
    // TODO: post session back
  }
})

interceptStepnRequests()
