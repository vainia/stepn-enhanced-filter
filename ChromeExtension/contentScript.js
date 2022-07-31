(() => {
	const injectScript = (filePath, tag) => {
		const script = document.createElement('script')
		script.setAttribute('type', 'text/javascript')
		script.setAttribute('src', filePath)
		document.getElementsByTagName(tag)[0].appendChild(script)
	}
	injectScript(chrome.runtime.getURL('contentPrivileged.js'), 'body')

	const bookmarkText = "or later"
	const customBookmarkButtonStyle = "w-[62px] h-[20px] text-xs shadow-tab bg-[#64ffcb] border-[2px] h-[45px] rounded-[25px] border-[#3a3831]"
	
	// Will mark containers to avoid adding buttons to them again
	const getBookmarkButtonContainers = () => document.querySelectorAll(".shadow-input div:not(.bookmarked) > button")

	const fetchBookmarks = (scope) => {
		return new Promise((resolve) => {
			chrome.storage.sync.get([scope], (obj) => {
				resolve(obj[scope] ? JSON.parse(obj[scope]) : [])
			})
		})
	}
	
	// Defines current Marketplace chain (realm)
	let currentScope = ""
	let currentScopeBookmarks = []
	const setBookmarksScope = async (scope) => {
		currentScope = scope
		currentScopeBookmarks = await fetchBookmarks(currentScope)
	}

	const getNewBookmarkFromButton = (button) => {
		const sneakerId = button.parentElement?.parentElement?.parentElement?.firstChild?.querySelector("[class^=border]")?.textContent?.replace("#", "")
		const orderData = cachedOrderList.find(order => order.otd == sneakerId)

		return {
			identifier: sneakerId,
			name: `#${sneakerId}`,
			timestamp: new Date().getTime(),
			data: orderData,
		}
	}

	const renderBookmarkButtons = async () => {
		const containers = getBookmarkButtonContainers()
		if (!containers || containers.length === 0) {
			return
		}
		
		containers.forEach(container => {
			const bookmarkBtn = document.createElement("button")
			bookmarkBtn.innerHTML = `${bookmarkText}<span class="tooltiptext">Check extension window after clicking this button 😋</span>`
			bookmarkBtn.className = `${customBookmarkButtonStyle} bookmark-btn tooltip`
		
			container.parentElement.appendChild(bookmarkBtn)

			bookmarkBtn.addEventListener("click", async function () {
				const newBookmark = getNewBookmarkFromButton(this)
	
				currentScopeBookmarks = await fetchBookmarks(currentScope)
				
				currentScopeBookmarks = [
					...currentScopeBookmarks,
					newBookmark
				].sort((a, b) => a.timestamp - b.timestamp)

				chrome.storage.sync.set({
					[currentScope]: JSON.stringify(currentScopeBookmarks)
				})
			})
	
			container.parentElement.classList.add("bookmarked")
		})
	}

	let cachedOrderList = []
	const handleMessageFromPrivilegedScript = async (event) => {
		if (event.data.from === "contentPrivileged.js" && event.data.type === "newOrderData") {
			// Data props
			// id - order ID
			// dataID - sneaker data ID
			// propID - might be skipped
			// otd - sneaker ID
			// img, hp, level, lifeRatio, mint, quality, sellPrice
			cachedOrderList.push(...event.data.orders)
		}
	}
	window.addEventListener('message', handleMessageFromPrivilegedScript)

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, scope } = obj

		if (type === "createNewBookmarksScope") {
			setBookmarksScope(scope)

			// Until better solution is found
			setInterval(renderBookmarkButtons, 100)

			return
		}

		if (type === "activateBookmark") {
        	// Use value to filter orders and display only targets
			const orderToShow = currentScopeBookmarks.find((b) => b.identifier == value)
			window.postMessage({ from: 'contentScript.js', signal: "activateBookmark", orders: [orderToShow.data] })
			return
		}

		if (type === "deleteBookmark") {
			currentScopeBookmarks = currentScopeBookmarks.filter((b) => b.identifier != value)
			chrome.storage.sync.set({ [currentScope]: JSON.stringify(currentScopeBookmarks) })

			response(currentScopeBookmarks)
			return
		}
	})
})()