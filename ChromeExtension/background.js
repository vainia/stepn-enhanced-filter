const isPageTarget = url => url && url.includes("m.stepn.com")

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
	if (!isPageTarget(tabInfo.url) || changeInfo.status !== "complete" || changeInfo.status === "loading") {
		return
	}

	// Set bolded icon to extension when target page is detected
	chrome.action.setIcon({ path: 'assets/logo-active.png', tabId })
})