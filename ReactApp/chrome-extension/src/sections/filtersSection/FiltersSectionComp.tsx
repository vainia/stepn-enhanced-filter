import {
  Sheet,
  Box,
  checkboxClasses,
  Button,
  Stack,
  Typography,
} from "@mui/joy"
import { CircularProgress, Skeleton } from "@mui/material"
import { useState } from "react"
import ProgressBar from "../../components/ProgressBar"
import { selectSettings } from "../../redux/reducers/settingsReducer"
import store, { useAppSelector } from "../../redux/store"
import {
  listenToChromeMessages,
  sendMessageToCurrentTab,
} from "../../services/chromeMessagingService"
import { TSearchResultUpdate } from "../../types/messageTypes"
import { timeout } from "../../utils/kronosUtils"
import AttributesFilterSectionComp from "./AttributesFilterSectionComp"
import SocketsFilterSectionComp from "./SocketsFilterSectionComp"

const FiltersSectionComp = () => {
  const { limitResultsCount } = useAppSelector(selectSettings)

  // Let the page render when react app is rendered outside of the extension
  const [userLoggedIn, setUserLoggedIn] = useState(chrome.tabs ? false : true)
  const [countResults, setCountResults] = useState(0)
  const [disableStartButton, setDisableStartButton] = useState(false)
  const [skeletonHidden, setSkeletonHidden] = useState(true)

  listenToChromeMessages<string | TSearchResultUpdate>((message) => {
    if (message.from !== "ContentScript") return
    if (message.type === "CheckSession") setUserLoggedIn(!!message.data)
    if (message.type === "SearchResultUpdate") {
      const { foundSneakersCount } = message.data as TSearchResultUpdate
      if (foundSneakersCount === limitResultsCount) setDisableStartButton(false)
      if (foundSneakersCount !== countResults)
        setCountResults(foundSneakersCount)
    }
  })

  if (!userLoggedIn) {
    sendMessageToCurrentTab<null, string>({
      type: "CheckSession",
      data: null,
      from: "ReactApp",
    })

    timeout(100).then(() => skeletonHidden && setSkeletonHidden(false))

    return (
      <Stack
        className={skeletonHidden ? "hidden" : ""}
        sx={{
          transition: "opacity 1s",
          opacity: 1,
          "&.hidden": {
            opacity: 0,
          },
        }}
        spacing={1}
      >
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
          disabled={disableStartButton}
          onClick={() => {
            setCountResults(0)
            setDisableStartButton(true)
            const { attributeFilters, socketFilters, settings } =
              store.getState()
            sendMessageToCurrentTab({
              type: "StartSearch",
              data: {
                attributeFilters,
                socketFilters,
                settings,
              },
              from: "ReactApp",
            })
          }}
        >
          {disableStartButton ? "Searching" : "Start search"}
          {disableStartButton && (
            <CircularProgress
              color={"inherit"}
              thickness={3}
              sx={{ mx: 1 }}
              size={20}
            />
          )}
        </Button>

        {disableStartButton && (
          <ProgressBar
            maxProgress={limitResultsCount}
            currentProgress={countResults}
          />
        )}
        {disableStartButton && (
          <Button
            onClick={() => {
              sendMessageToCurrentTab<null, string>({
                type: "StopSearch",
                data: null,
                from: "ReactApp",
              })
              setDisableStartButton(false)
            }}
            color="warning"
          >
            Interrupt search
          </Button>
        )}
      </Box>
    </>
  )
}

export default FiltersSectionComp
