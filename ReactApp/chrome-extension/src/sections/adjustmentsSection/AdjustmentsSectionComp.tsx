import { Box, Button, TextField } from "@mui/joy"
import { useState } from "react"
import TagsOptionsComp from "../../components/TagsOptionsComp"
import TransitionAlertComp from "../../components/TransitionAlertComp"

const AdjustmentsSectionComp = () => {
  const [sneakersSearchLimit, setSneakersSearchLimit] = useState(5)
  const [timeoutBetweenRequests, setTimeoutBetweenRequests] = useState(0.5)

  return (
    <>
      <TransitionAlertComp
        severity="warning"
        title="Warning!"
        message="You have to be fully aware of your actions and adjust these values on your own risk. 
        Make sure you are aware of the consequences.
        When requests frequency exceeds STEPN's Cloudflare Rate Limiting your IP address might be blocked for up to 24 hours."
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        <TextField
          label="Sneakers search limit"
          size="md"
          variant="soft"
          type="number"
          value={sneakersSearchLimit}
          onChange={(e) => setSneakersSearchLimit(parseInt(e.target.value))}
        />
        <TextField
          label="Timeout between requests in seconds"
          size="md"
          variant="soft"
          type="number"
          value={timeoutBetweenRequests}
          onChange={(e) =>
            setTimeoutBetweenRequests(parseFloat(e.target.value))
          }
        />

        <TagsOptionsComp
          options={[
            {
              data: "order",
            },
            {
              data: "chain",
            },
            {
              data: "type",
            },
            {
              data: "gType",
            },
            {
              data: "quality",
            },
            {
              data: "level",
            },
            {
              data: "breed",
            },
          ]}
          label={"Included request parameters"}
        />
        <Button>Restore settings</Button>
      </Box>
    </>
  )
}

export default AdjustmentsSectionComp
