const isPageTarget = url => url && url.includes("m.stepn.com")

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
	if (!isPageTarget(tabInfo.url) || changeInfo.status !== "complete" || changeInfo.status === "loading") {
		return
	}

	// Set bolded icon to extension when target page is detected
	chrome.action.setIcon({ path: 'assets/logo-active.png', tabId })
	
	// When scope of the site is known initiate its bookmarks
	chrome.tabs.sendMessage(tabId, {
		type: "createNewBookmarksScope",
		// Currently all chains are bookmarked in one list - eventually grouping by chain will come
		scope: chainId = "All",
	})
})