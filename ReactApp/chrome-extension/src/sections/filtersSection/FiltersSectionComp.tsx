import { Sheet, Box, checkboxClasses, Button } from "@mui/joy"
import store from "../../redux/store"
import { sendMessageToCurrentTab } from "../../services/chromeMessagingService"
import AttributesFilterSectionComp from "./AttributesFilterSectionComp"
import SocketsFilterSectionComp from "./SocketsFilterSectionComp"

const FiltersSectionComp = () => {
  return (
    <>
      <Sheet sx={{ p: 1 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          "& > div": {
            px: 2,
            "&.JoyBox-root": {
              boxShadow: "sm",
              borderRadius: "xs",
            },
            display: "flex",
            justifyContent: "space-evenly",
          },
          [`& .${checkboxClasses.root}`]: {
            mr: "auto",
            flexGrow: 1,
            alignItems: "center",
            flexDirection: "row-reverse",
            gap: 1.5,
          },
        }}
      >
        <AttributesFilterSectionComp />
        <SocketsFilterSectionComp />

        <Button
          onClick={() => {
            const { attributeFilters, socketFilters } = store.getState()
            sendMessageToCurrentTab({
              type: "StartSearch",
              data: {
                attributeFilters,
                socketFilters,
              },
              from: "EnhancedFilterPopup",
            })
          }}
        >
          Start search
        </Button>

        {/* Apply filters section */}
        {/* Save filters group section save filter -> name -> confirm */}
      </Box>
    </>
  )
}

export default FiltersSectionComp
