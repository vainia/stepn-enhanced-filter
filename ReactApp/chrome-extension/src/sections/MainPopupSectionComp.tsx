import { Tabs, TabList, Tab, TabPanel } from "@mui/joy"
import AdjustmentsSectionComp from "./adjustmentsSection/AdjustmentsSectionComp"
import CreditsSectionComp from "./creditsSection/CreditsSectionComp"
import FiltersSectionComp from "./filtersSection/FiltersSectionComp"

const MainPopupSectionComp = () => {
  return (
    <Tabs defaultValue={0} sx={{ width: "100%" }}>
      <TabList variant="soft" color="neutral">
        <Tab>Filters</Tab>
        <Tab>Adjustments</Tab>
        <Tab>Credits</Tab>
      </TabList>
      <TabPanel value={0}>
        <FiltersSectionComp />
      </TabPanel>
      <TabPanel value={1}>
        <AdjustmentsSectionComp />
      </TabPanel>
      <TabPanel value={2}>
        <CreditsSectionComp />
      </TabPanel>
    </Tabs>
  )
}

export default MainPopupSectionComp
