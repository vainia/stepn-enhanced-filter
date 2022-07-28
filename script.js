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
    
            if (minEffBase <= orderBaseEff && minLuckBase <= orderBaseLuck && minComBase <= orderBaseCom && minResBase <= orderBaseRes) {
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
    iteratorCurrentPage: "filter-result-current-page"
}

const dataSelectors = {
    filterMinEffBase: () => parseInt(document.getElementById(inputIds.minEffBase).value || '0'),
    filterMinLuckBase: () => parseInt(document.getElementById(inputIds.minLuckBase).value || '0'),
    filterMinComBase: () => parseInt(document.getElementById(inputIds.minComBase).value || '0'),
    filterMinResBase: () => parseInt(document.getElementById(inputIds.minResBase).value || '0'),
}

const copyWalletToBuffer = () => {
    var copyText = document.getElementById("stepn-wallet-address")
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(copyText.value)
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
        <input type="range" min="1" max="112" name="${inputIds[ft]}" id="${inputIds[ft]}"
            value="9" class="w-full h-[34px] border bg-white text-sm capitalize m-auto mb-4" oninput="this.nextElementSibling.value = this.value" />
        <output class="px-5 text-lg font-bold">9</output>
    </div>`).join("")}
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
