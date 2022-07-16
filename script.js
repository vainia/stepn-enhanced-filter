const placeholder = document.querySelector("#__next > main > div:last-child > div:first-child > div")

const stepnSortParams = {
    lowToHigh: "order=1001",
    newToOld: "order=1002",
    hightToLow: "order=2002"
}

const stepnApi = {
    // TODO: fix page query param - each call to this endpoint returns data for next data set disregarding the page param
    sneakersData: pageIdx => `https://api.stepn.com/run/orderlist?${stepnSortParams.hightToLow}&chain=103&refresh=false&page=${pageIdx}&type=&gType=&quality=&level=0&bread=0`,
    sneakerPage: id => `https://m.stepn.com/order/${id}`
}

let resultSneaker = null

const findSneaker = pageIdx => fetch(stepnApi.sneakersData(pageIdx), {
    method: "GET",
    mode: "cors",
    credentials: "include"
}).then((e) => e.json()).then((e) => {
    if (resultSneaker || e.data.length === 0) {
        assignInnerHtmlById(inputIds.filterResultOutput, "No sneaker found")
        return true
    }
    const targetSneakerIdLength = dataSelectors.targetSneakerIdLength()
    for (let entry of e.data) {
        assignInnerHtmlById(inputIds.iteratorCurrentPage, `Current Page: ${pageIdx} \n Price: ${formatPrice(entry.sellPrice)}`)
        const sneakerId = entry.otd.toString()
        console.log({ a: sneakerId.length, b: targetSneakerIdLength })
        if (sneakerId.length <= targetSneakerIdLength) {
            resultSneaker = entry
            assignInnerHtmlById(inputIds.filterResultOutput, prepareResultHtml(entry))
            return true
        }
    }
    return false
})

const {fetch: origFetch} = window;
window.fetch = async (...args) => {
    return new Promise(async (resolve, reject) => {
        const response = await origFetch(...args)
        if(!resultSneaker || !args || !args[0] || args[0].indexOf(stepnSortParams.newToOld) < 0) {
            resolve(response)
        }

        response
            .clone()
            .json()
            .then(body => {
                response.json = () => {
                    body.data = [
                        resultSneaker
                    ]
                    return body
                }
                resolve(response)  
            })
            .catch((error) => {
                reject(response)
            })
    })
}

const formatPrice = (price) => parseFloat(price/1000000).toFixed(2)

const prepareResultHtml = (entry) => `#${entry.otd} - sort by "New to Old" to see the sneaker`

const applyEnhancedFilters = () => {
    let intervalSeconds = 1
    let pageIndex = 0
    resultSneaker = null

    assignInnerHtmlById(inputIds.filterResultOutput, "Searching...")

    const genesisSearchInterval = setInterval(() => {
        findSneaker(pageIndex++).then((finished) => finished && clearInterval(genesisSearchInterval))
    }, intervalSeconds * 1000)
}

const assignInnerHtmlById = (id, html) => document.getElementById(id).innerHTML = html

const inputIds = {
    filterResultOutput: "filter-result-output",
    limitSneakerIdDigits: "filter-limit-sneaker-id-digits",
    iteratorCurrentPage: "filter-result-current-page"
}

const dataSelectors = {
    targetSneakerIdLength: () => parseInt(document.getElementById(inputIds.limitSneakerIdDigits).value || '0'),
}

const enhancedFiltersFormString = `<div id="stepn-enhanced-filters-by-inapolsky" class="p-5">
    <h1 class="mb-5 border-b-[4px] border-green-400"><b>Enhanced Filtering</b></h1>
    <label for="${inputIds.limitSneakerIdDigits}" class="capitalize">Limit digits in sneaker\'s ID</label>
    <div class="range-verbose flex">
        <input type="range" min="1" max="9" placeholder="Enter count of digits" name="${inputIds.limitSneakerIdDigits}" id="${inputIds.limitSneakerIdDigits}"
            value="9" class="w-full h-[34px] border bg-white text-sm capitalize m-auto mb-4" oninput="this.nextElementSibling.value = this.value" />
        <output class="px-5 text-lg font-bold">9</output>
    </div>
    <button class="w-full h-[34px] border bg-white text-sm capitalize m-auto mb-4" onclick="applyEnhancedFilters();">
        Apply Filters
    </button>
    <div class="flex-column">
        <div class="text-lg 2xl:text-base 2xl:leading-5" id="${inputIds.iteratorCurrentPage}"></div>
        <div class="ml-auto text-lg font-bold" id="${inputIds.filterResultOutput}"></div>
    </div>
</div>`

placeholder.innerHTML = placeholder.innerHTML + enhancedFiltersFormString
