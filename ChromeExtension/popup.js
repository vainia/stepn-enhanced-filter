import { getActiveTabUrl, isPageTarget } from "./utils.js"

const wrongPageMessage = '<div class="title">This is not a STEPN Marketplace page.</div>'
const noBookmarksMessage = '<i class="row">No saved sneakers to show</i>'

// Render bookmarks on page load from data in browser storage
document.addEventListener("DOMContentLoaded", async () => {
	const activeTab = await getActiveTabUrl()
	if (!isPageTarget(activeTab.url)) {
		document.getElementsByClassName("container")[0].innerHTML = wrongPageMessage
		return
	}

	// Should be selected from dropdown with available scopes
	const currentScope = "All"
	chrome.storage.sync.get([currentScope], (data) => {
		const currentBookmarks = data[currentScope] ? JSON.parse(data[currentScope]) : []
		renderBookmarks(currentBookmarks)
	})
})

const renderBookmarks = (currentBookmarks = []) => {
	const bookmarksElement = document.getElementById("bookmarks")

	if (currentBookmarks.length === 0) {
		bookmarksElement.innerHTML = noBookmarksMessage
		return
	}

	bookmarksElement.innerHTML = ""
	currentBookmarks.forEach(bookmark => addNewBookmark(bookmarksElement, bookmark))
}

const addNewBookmark = (bookmarksContainer, bookmark) => {
	// Render bookmark element
	const newBookmarkElement = document.createElement("div")
	newBookmarkElement.id = `bookmark-${bookmark.identifier}`
	newBookmarkElement.className = "bookmark"
	newBookmarkElement.setAttribute("identifier", bookmark.identifier)
	bookmarksContainer.appendChild(newBookmarkElement)

	// Render bookmark title
	const bookmarkTitleElement = document.createElement("div")
	bookmarkTitleElement.textContent = bookmark.name
	bookmarkTitleElement.className = "bookmark-title"
	newBookmarkElement.appendChild(bookmarkTitleElement)

	// Render bookmark controls
	const controlsElement = document.createElement("div")
	controlsElement.className = "bookmark-controls"
	setBookmarkAttributes("activate", onActivateBookmark, controlsElement)
	setBookmarkAttributes("delete", onDelete, controlsElement)
	newBookmarkElement.appendChild(controlsElement)
}

const onActivateBookmark = async e => {
	const identifier = e.target.parentNode.parentNode.getAttribute("identifier")
	const activeTab = await getActiveTabUrl()

	chrome.tabs.sendMessage(activeTab.id, {
		type: "activateBookmark",
		value: identifier,
	})
}

const onDelete = async e => {
	const activeTab = await getActiveTabUrl()
	const identifier = e.target.parentNode.parentNode.getAttribute("identifier")
	const bookmarkElementToDelete = document.getElementById(`bookmark-${identifier}`)

	bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete)

	chrome.tabs.sendMessage(
		activeTab.id,
		{
			type: "deleteBookmark",
			value: identifier,
		},
		// When bookmark is deleted refresh bookmarks
		renderBookmarks
	)
}

const setBookmarkAttributes = (assetName, eventListener, controlParentElement) => {
	const controlElement = document.createElement("img")
	controlElement.title = assetName
	controlElement.src = `assets/${assetName}.png`
	controlElement.addEventListener("click", eventListener)
	controlParentElement.appendChild(controlElement)
}