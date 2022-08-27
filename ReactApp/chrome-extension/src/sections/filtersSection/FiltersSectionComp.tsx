import {
  Sheet,
  Box,
  checkboxClasses,
  Button,
  Stack,
  Typography,
} from "@mui/joy"
import { Skeleton } from "@mui/material"
import { useState } from "react"
import store from "../../redux/store"
import {
  listenToChromeMessages,
  sendMessageToCurrentTab,
} from "../../services/chromeMessagingService"
import AttributesFilterSectionComp from "./AttributesFilterSectionComp"
import SocketsFilterSectionComp from "./SocketsFilterSectionComp"

const FiltersSectionComp = () => {
  // Let the page render when react app is rendered outside of the extension
  const [userLoggedIn, setUserLoggedIn] = useState(chrome ? false : true)

  if (!userLoggedIn) {
    sendMessageToCurrentTab<null, string>({
      type: "CheckSession",
      data: null,
      from: "ReactApp",
    })

    listenToChromeMessages((message) => {
      if (message.from !== "ContentScript") return
      if (message.type === "CheckSession") setUserLoggedIn(!!message.data)
    })
    return (
      <Stack spacing={1}>
        <Skeleton animation="pulse" />
        <Skeleton animation="wave" />
        <Skeleton animation="pulse" />
        <Typography textAlign={"center"}>
          Awaiting STEPN user session
        </Typography>
        <Skeleton animation="wave" />
        <Skeleton animation="pulse" />
        <Skeleton animation="wave" />
      </Stack>
    )
  }

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
              from: "ContentScript",
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
