let paramsDefinedByUser = "&order=2001&chain=103&type=&gType=&quality=&level=0&breed=0"
const stepnApi = {
    orderList: (pageIdx, sessionId) => `https://api.stepn.com/run/orderlist?refresh=false&page=${pageIdx}&sessionID=${sessionId}&simulated=true${paramsDefinedByUser}`,
    orderData: (orderId, sessionId) => `https://api.stepn.com/run/orderdata?orderId=${orderId}&sessionID=${sessionId}&simulated=true`
}

const getCookieFromDocument = (name) => document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1]

const getSessionId = () => new Promise((resolve, reject) => {
    if (window.cookieStore) {
        window.cookieStore.get("sessionID").then(
            data => resolve(encodeURIComponent(data.value))
        )
    } else {
        resolve(getCookieFromDocument("sessionID"))
    }
})

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))
const formatPrice = (price) => parseFloat(price / 1000000).toFixed(4)
const assignInnerHtmlById = (id, html) => document.getElementById(id).innerHTML = html

let limitResultsCount = 5
const sneakersPerPage = 60

const findSneaker = (pageIdx, sessionId) => new Promise((resolve, reject) => { 
    fetch(stepnApi.orderList(pageIdx, sessionId), {
        method: "GET",
        mode: "cors",
        credentials: "include"
    }).then((e) => e.json()).then(async (e) => {
        if (!e.data || e.data.length === 0) {
            reject(false)
            throw new Error("Order list request error")
        }

        let currentIterationSet = (pageIdx + 1) * sneakersPerPage
        let currentOrderIteration = currentIterationSet - sneakersPerPage
        for (let order of e.data) {
            currentOrderIteration++
            if (targetOrderList.length >= limitResultsCount) {
                resolve(true)
                return
            }

            const minEffBase = dataSelectors.filterMinEffBase()
            const minLuckBase = dataSelectors.filterMinLuckBase()
            const minComBase = dataSelectors.filterMinComBase()
            const minResBase = dataSelectors.filterMinResBase()

            assignInnerHtmlById(inputIds.iteratorCurrentPage, `Sneakers iterated: ${currentOrderIteration}/${currentIterationSet}<br />Price: ${formatPrice(order.sellPrice)}`)

            // Await necessary amount of ms to avoid getting blacklisted IP
            await timeout(0.25 * 1000)
            
            // ->data[]->attrs [0-Efficiency, 1-Luck, 2-Comfort, 3-Resilience] - All bases, [4-7] - All points assigned respectively
            // ->data[]->breed (0-7)
            // ->data[]->holes[0-4]->type (1-Efficiency, 2-Luck, 3-Comfort, 4-Resilience)
            // ->data[]->holes[0-4]->quality (-1, 0, ...)
            // ->data[]->level (0-30)
            // ->data[]->type (1-Walker, 2-Jogger, 3-Runner, 4-Trainer)
            const orderData = await getOrderData(order.id.toString(), sessionId)
            
            // Sneaker got sold
            if (!orderData) { 
                assignInnerHtmlById(inputIds.iteratorCurrentPage, `Order for iteration #${currentOrderIteration} got sold`)
                continue
            }

            // Attributes are not present when shoebox is encountered
            if (!orderData.attrs) {
                continue
            }
    
            const orderBaseEff = orderData.attrs[0] / 10
            const orderBaseLuck = orderData.attrs[1] / 10
            const orderBaseCom = orderData.attrs[2] / 10
            const orderBaseRes = orderData.attrs[3] / 10
            const baseAttributesFilterMatch = minEffBase <= orderBaseEff && minLuckBase <= orderBaseLuck && minComBase <= orderBaseCom && minResBase <= orderBaseRes
            const noPointsAssigned = dataSelectors.filterNoPointsAssigned()
            const noPointsAssignedFilterMatch = (!noPointsAssigned) || (noPointsAssigned && orderData.attrs[4] == 0 && orderData.attrs[5] == 0 && orderData.attrs[6] == 0 && orderData.attrs[7] == 0)

            //Filter to select shoes whose max points were assigned to a specific attribute
            const attrToCheckPoints = orderData.attrs.slice(0,4).map((a, i) => a + orderData.attrs.slice(4,8)[i]);
            const maxPointsAttrFilterMatch = (selectedMaxAttrFilter == 0) || (selectedMaxAttrFilter != 0 && attrToCheckPoints.every(attr => attr <= attrToCheckPoints[selectedMaxAttrFilter-1]))


            const useSocketsFilters = Object.keys(selectedGemFilters).length !== 0
            const gemSocketsInOrder = dataSelectors.filterGemsInOrder()
            const socketsFilterMatch = !useSocketsFilters || (gemSocketsInOrder && orderData.holes.every((hole, idx) => {
                pos = idx + 1

                // No filter specified for this socket
                if (!selectedGemFilters[pos]) {
                    return true
                }

                const typeFilterMatch = typeof selectedGemFilters[pos].type === "undefined" || selectedGemFilters[pos].type == hole.type
                const qualityFilterMatch = typeof selectedGemFilters[pos].quality === "undefined" || selectedGemFilters[pos].quality == hole.quality
                return typeFilterMatch && qualityFilterMatch
            })) || Object.values(selectedGemFilters).every(gemFilter => orderData.holes.some(hole => {
                if (hole.used) return false
                const typeFilterMatch = typeof gemFilter.type === "undefined" || gemFilter.type == hole.type
                const qualityFilterMatch = typeof gemFilter.quality === "undefined" || gemFilter.quality == hole.quality
                if (typeFilterMatch && qualityFilterMatch) {
                    hole.used = true
                    return true
                }
            }))
            if (baseAttributesFilterMatch && socketsFilterMatch && noPointsAssignedFilterMatch && maxPointsAttrFilterMatch) {
                targetOrderList.push(order)
                assignInnerHtmlById(inputIds.filterResultOutput, `Sneakers found: ${targetOrderList.length}/${limitResultsCount}`)
                if (targetOrderList.length >= limitResultsCount) {
                    resolve(true)
                    return
                }
            }
        }
        resolve(false)
    })
})

const getOrderData = async (orderId, sessionId) => new Promise((resolve, reject) => { 
    fetch(stepnApi.orderData(orderId, sessionId), {
        method: "GET",
        mode: "cors",
        credentials: "include"
    }).then((e) => e.json()).then((e) => {
        if (!e.data || e.data.length === 0) {
            resolve(null)
            return
        }
        resolve(e.data)
    })
})

// Intercept the order list request and replace it with the target order list
let targetOrderList = []
const { fetch: origFetch } = window
window.fetch = async (...args) => {
    return new Promise(async (resolve, reject) => {
        const response = await origFetch(...args)

        const swapOrderList = args[0].indexOf("simulated") === -1 && args[0].indexOf("orderlist") !== -1

        // If new order list is requested by user grab native filter parameters to combine with enhanced filter
        if (swapOrderList) {
            var url = new URL(args[0])

            paramsDefinedByUser = "&order=" + url.searchParams.get("order")
                + "&chain=" + url.searchParams.get("chain")
                + "&type=" + url.searchParams.get("type")
                + "&gType=" + url.searchParams.get("gType")
                + "&quality=" + url.searchParams.get("quality")
                + "&level=" + url.searchParams.get("level")
                + "&breed=" + url.searchParams.get("breed")
        }

        if (!swapOrderList || targetOrderList.length === 0 || !args || !args[0]) {
            resolve(response)
        }

        response
            .clone()
            .json()
            .then(body => {
                response.json = () => {
                    body.data = targetOrderList
                    return body
                }
                resolve(response)
            })
            .catch((error) => {
                reject(response)
            })
    })
}

const applyEnhancedFilters = async () => {
    targetOrderList = []
    limitResultsCount = 5

    let pageIndex = 0
    assignInnerHtmlById(inputIds.filterResultOutput, "Searching...")

    while (true) {
        await timeout(0.25 * 1000)
        const sessionId = await getSessionId()
        const isFound = await findSneaker(pageIndex++, sessionId)
        if (isFound) {
            renderTargetOrderList()
            return
        }
    }
}

const stopFilterSearch = () => {
    limitResultsCount = targetOrderList.length
}

const renderTargetOrderList = async () => {
    if (limitResultsCount === 0) {
        return
    }

    const sortDropdownButton = document.querySelector("#__next > main > div:last-child > div:last-child [id^='headlessui-listbox-button']")
    sortDropdownButton.innerText = "Enchanced Filtering"
    sortDropdownButton.dispatchEvent(new Event('click', { bubbles: true }));
    await timeout(0.25 * 1000)
    const unselectedSortOption = document.querySelector("li[id^=headlessui-listbox-option]:not([aria-selected])")
    unselectedSortOption.dispatchEvent(new Event('click', { bubbles: true }));
}

const inputIds = {
    filterResultOutput: "filter-result-output",
    minEffBase: "filter-min-eff-base",
    minLuckBase: "filter-min-luck-base",
    minComBase: "filter-min-com-base",
    minResBase: "filter-min-res-base",
    gemsInOrder: "filter-gems-in-order",
    attrNoPointsAssigned: "filter-no-points-assigned",
    attrMaxAssignedPoints: "filter-attr-max-points",
    iteratorCurrentPage: "filter-result-current-page"
}

const dataSelectors = {
    filterMinEffBase: () => parseInt(document.getElementById(inputIds.minEffBase).value || '0'),
    filterMinLuckBase: () => parseInt(document.getElementById(inputIds.minLuckBase).value || '0'),
    filterMinComBase: () => parseInt(document.getElementById(inputIds.minComBase).value || '0'),
    filterMinResBase: () => parseInt(document.getElementById(inputIds.minResBase).value || '0'),
    filterGemsInOrder: () => document.getElementById(inputIds.gemsInOrder).checked,
    filterNoPointsAssigned: () => document.getElementById(inputIds.attrNoPointsAssigned).checked
}

const copyWalletToBuffer = () => {
    const copyText = document.getElementById("stepn-wallet-address")
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(copyText.value)
}

const gemSockets = {
    1: "Efficiency",
    2: "Luck",
    3: "Comfort",
    4: "Resilience"
}
const gemQualities = [-1, 0, 1, 2, 3, 4, 5]

const getSocketIconPath = (type, quality) => `/images/gem_${type}_${quality}.svg`

const selectedGemFilters = {}

const selectArrowElement = `<img src="/images/select.svg" alt="" class="ml-[2px]" />`
const toggleDropdown = target => {
    // Toggle will erase the current selection visually and from state
    // const socketNumber = target.attributes['socket-number'].value
    // delete selectedGemFilters[socketNumber]
    // target.innerHTML = socketNumber + "t #" + selectArrowElement

    const optionsList = target.nextElementSibling
    optionsList.querySelectorAll(".dropdown-selection").forEach(e => e.remove())

    optionsList.classList.toggle('hidden')
}

const markSelectedDropDownOption = target => target.innerHTML = `<div class="relative">
    <div class="bg-[#64ffcb] w-[50px] rounded-[3px] -z-10 h-[6px] -left-[3px] absolute top-[7px]"></div>
</div>` + target.innerHTML

const applyDropdownSocketSelection = (target) => {
    const dropDownButton = target.parentElement.parentElement.previousElementSibling
    toggleDropdown(dropDownButton)

    // markSelectedDropDownOption(target)

    const socketNumber = target.attributes['socket-number'].value

    if (target.attributes['socket-type-id']) {
        const socketTypeId = target.attributes['socket-type-id'].value
        selectedGemFilters[socketNumber] = selectedGemFilters[socketNumber] || {}
        selectedGemFilters[socketNumber]['type'] = socketTypeId

        // Update dropdown button text
        document.getElementById(`filter-socket-type-${socketNumber}`).innerHTML = socketNumber + "t " + gemSockets[socketTypeId].charAt(0) + selectArrowElement
    }
    else if (target.attributes['socket-quality-id']) { 
        const socketQualityId = target.attributes['socket-quality-id'].value
        selectedGemFilters[socketNumber] = selectedGemFilters[socketNumber] || {}
        selectedGemFilters[socketNumber]['quality'] = socketQualityId

        // Update dropdown button text
        document.getElementById(`filter-socket-quality-${socketNumber}`).innerHTML = socketNumber + "q " + socketQualityId + selectArrowElement
    }
    
    // Update socket image icon
    if (selectedGemFilters[socketNumber]['type']) {
        document.getElementById(`filter-socket-image-${socketNumber}`).src = getSocketIconPath(selectedGemFilters[socketNumber]['type'], selectedGemFilters[socketNumber]['quality'] || -1)
    }
}

let selectedMaxAttrFilter = 0

const applyDropdownMaxAttrSelection = (target) => {
    const dropDownButton = target.parentElement.parentElement.previousElementSibling
    toggleDropdown(dropDownButton)

    if (target.attributes['attr-type-id']) { 
        const attrTypeId = target.attributes['attr-type-id'].value
        selectedMaxAttrFilter = attrTypeId

        // Update dropdown button text
        document.getElementById(`filter-maxpoints-attr-type`).innerHTML = gemSockets[attrTypeId] + selectArrowElement
    }
    
}

const enhancedFiltersFormString = `<div id="stepn-enhanced-filters-by-inapolsky" class="p-5">
    <h1 class="mb-5 border-b-[4px] border-green-400">
        <b>Enhanced Filtering</b>
        <hr/>
        <i>Works With Native Filters</i>
        <hr/>
        <i>By inapolsky</i>
        <input type="text" value="2stFvNdELDQ56C6vD71Lt3jKN9Th4r7cfkpJchwyxJ6x" id="stepn-wallet-address" style="text-overflow: ellipsis;" class="mt-4"/>
        <button  class="w-full h-[34px] border bg-white text-sm capitalize m-auto mb-4" onclick="copyWalletToBuffer()">
            Donate (GST|GMT|SOL)
        </button>
    </h1>
    ${['minEffBase', 'minLuckBase', 'minComBase', 'minResBase'].map(ft =>
    `<label for="${inputIds[ft]}" class="capitalize">${ft.replace("min", "Min. ").replace("Base", " Base")}</label>
    <div class="range-verbose flex">
        <input type="range" min="1" max="112" step="0.1" name="${inputIds[ft]}" id="${inputIds[ft]}"
            value="1" class="w-full h-[34px] border bg-white text-sm capitalize m-auto mb-4" oninput="this.nextElementSibling.value = this.value" />
        <output class="px-5 text-lg font-bold">1</output>
    </div>`).join("")}
    <div class="flex mb-5">
        <input type="checkbox" id="${inputIds.attrNoPointsAssigned}" name="${inputIds.attrNoPointsAssigned}" class="mr-2">
        <label for="${inputIds.attrNoPointsAssigned}">Points must not be assigned</label>
    </div>
    <div class="max-assigned-points flex mb-5">
        <label for="${inputIds.attrMaxAssignedPoints}">Max points on: </label>
        <nav class="stepn-filter_points-on-attr-type-select relative" style="margin-left:30px">
            <button id="filter-maxpoints-attr-type" class="px-[6px] pt-[3.5px] pb-[4.5px] m-auto bg-white border-border rounded-xl text-xs border flex items-center justify-center"
                onclick="toggleDropdown(this)">
                <span>None</span>${selectArrowElement}
            </button>
            <ul class="absolute text-sm border-border z-30 rounded-xl mt-1 w-[80px] border bg-white hidden">
                ${Object.keys(gemSockets).map(attrTypeId => `<li class="cursor-pointer">
                    <span class="nav-button flex w-full justify-center" onclick="applyDropdownMaxAttrSelection(this)" attr-type-id="${attrTypeId}">${gemSockets[attrTypeId]}</span>
                </li>`).join("")}
            </ul>
        </nav>
    </div>
    <div class="stepn-sockets-filter flex mb=[20px]">
        ${Object.keys(gemSockets).map(number => 
        `<div class="justify-between py-[5px] flex bg-[#f9f9f9]">
            <div class="px-[2px]">
                <nav class="stepn-filter__socket-type-select relative">
                    <button id="filter-socket-type-${number}" socket-number=${number} class="px-[6px] pt-[3.5px] pb-[4.5px] m-auto bg-white border-border rounded-xl text-xs border flex items-center justify-center"
                        onclick="toggleDropdown(this)">
                        <span>${number}t #</span>${selectArrowElement}
                    </button>
                    <ul class="absolute text-sm border-border z-30 rounded-xl mt-1 w-[80px] border bg-white hidden">
                        ${Object.keys(gemSockets).map(socketTypeId => `<li class="cursor-pointer">
                            <span class="nav-button flex w-full justify-center" onclick="applyDropdownSocketSelection(this)" socket-number=${number} socket-type-id="${socketTypeId}">${gemSockets[socketTypeId]}</span>
                        </li>`).join("")}
                    </ul>
                </nav>
                <div class="w-[50px] h-[50px] relative">
                    <img id="filter-socket-image-${number}" src="${getSocketIconPath(number, -1)}" alt="gem lock icon" class="" />
                </div>
                <nav class="stepn-filter__socket-quality-select relative">
                    <button id="filter-socket-quality-${number}" socket-number=${number} class="px-[6px] pt-[3.5px] pb-[4.5px] m-auto bg-white border-border rounded-xl text-xs border flex items-center justify-center"
                        onclick="toggleDropdown(this)">
                        <span>${number}q #</span>${selectArrowElement}
                    </button>
                    <ul class="absolute text-sm border-border z-30 rounded-xl mt-1 w-[50px] border bg-white hidden">
                        ${gemQualities.map(qualityId => `<li class="cursor-pointer">
                            <span class="nav-button flex w-full justify-center" onclick="applyDropdownSocketSelection(this)" socket-number=${number} socket-quality-id="${qualityId}">${qualityId}</span>
                        </li>`).join("")}
                    </ul>
                </nav>
            </div>
        </div>`).join("")}
    </div>
    <div class="flex mb-5">
        <input type="checkbox" id="${inputIds.gemsInOrder}" name="${inputIds.gemsInOrder}" class="mr-2">
        <label for="${inputIds.gemsInOrder}">Gem sockets must follow the order</label>
    </div>
    <button class="w-full h-[34px] border bg-white text-sm capitalize m-auto mb-4" onclick="applyEnhancedFilters();">
        Apply Filters
    </button>
    <button class="w-full h-[34px] border bg-white text-sm capitalize m-auto mb-4" onclick="stopFilterSearch();">
        Stop Filter Search
    </button>
    <div class="flex-column">
        <div class="text-lg 2xl:text-base 2xl:leading-5" id="${inputIds.iteratorCurrentPage}"></div>
        <div class="ml-auto text-lg font-bold" id="${inputIds.filterResultOutput}"></div>
    </div>
</div>`

const placeholder = document.querySelector("#__next > main > div:last-child > div:first-child > div")
placeholder.insertAdjacentHTML("afterend", enhancedFiltersFormString)