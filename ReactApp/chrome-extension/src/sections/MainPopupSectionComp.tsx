import { Tabs, TabList, Tab, TabPanel } from "@mui/joy"
import AdjustmentsSectionComp from "./adjustmentsSection/AdjustmentsSectionComp"
import FiltersSectionComp from "./filtersSection/FiltersSectionComp"

const MainPopupSectionComp = () => {
  // if (!currentHostnameIncludes("localhost")) {
  //   return <div className="title">This is not a STEPN Marketplace page.</div>
  // }

  return (
    <Tabs defaultValue={0} sx={{ width: "100%", margin: "5px" }}>
      <TabList variant="soft" color="neutral">
        <Tab>Filters</Tab>
        <Tab>Adjustments</Tab>
      </TabList>
      <TabPanel value={0}>
        <FiltersSectionComp />
      </TabPanel>
      <TabPanel value={1}>
        <AdjustmentsSectionComp />
      </TabPanel>
    </Tabs>
  )
}

export default MainPopupSectionComp
