import { TStoreState } from "../redux/store"
import { interceptStepnRequests } from "../services/stepnInterceptorService"
import {
  applyEnhancedFilters,
  getSessionId,
} from "../services/stepnPageService"
import {
  listenToWindowMessages,
  sendWindowMessage,
} from "../services/windowMessagingService"

listenToWindowMessages((type, data, from) => {
  if (from !== "ContentScript") return

  if (type === "StartSearch") {
    const storeState = data as TStoreState
    console.log(storeState)

    const sessionId = getSessionId()
    if (!sessionId) return

    applyEnhancedFilters(storeState, sessionId)
  }

  if (type === "CheckSession") {
    const sessionId = getSessionId()
    sendWindowMessage(sessionId, "CheckSession", "HostSiteScript")
  }
})

interceptStepnRequests()
