import { interceptStepnRequests } from "../services/stepnInterceptorService"
import { applyEnhancedFilters } from "../services/stepnPageService"

const placeholder = document.querySelector(
  "#__next > main > div:last-child > div:first-child > div"
)
placeholder?.insertAdjacentHTML(
  "afterend",
  "<h1>SCRIPT IS ABOUT TO SPIN UP!</h1>"
)

interceptStepnRequests()
applyEnhancedFilters()
