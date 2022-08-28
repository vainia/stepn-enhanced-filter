import { Box, Button, TextField } from "@mui/joy"
import TagsOptionsComp from "../../components/TagsOptionsComp"
import TransitionAlertComp from "../../components/TransitionAlertComp"
import {
  selectSettings,
  settingsSlice,
} from "../../redux/reducers/settingsReducer"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { defaultRequestParams } from "../../services/stepnInterceptorService"

const AdjustmentsSectionComp = () => {
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()

  return (
    <>
      <TransitionAlertComp
        severity="warning"
        title="Warning!"
        message="You have to be fully aware of your actions and adjust these values on your own risk. 
        Make sure you are aware of the consequences.
        When requests frequency exceeds STEPN's Cloudflare Rate Limiting boundaries your IP address might get blocked for up to 24 hours.
        In case if that happens you can avoid limitations by using VPN."
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
          value={settings.limitResultsCount}
          onChange={(e) => {
            dispatch(
              settingsSlice.actions.update({
                ...settings,
                // Do not allow negatives
                limitResultsCount: parseInt(e.target.value) || 1,
              })
            )
          }}
        />
        <TextField
          label="Timeout between requests in seconds"
          size="md"
          variant="soft"
          type="number"
          value={settings.requestTimeoutSeconds}
          onChange={(e) => {
            dispatch(
              settingsSlice.actions.update({
                ...settings,
                // Do not allow negatives
                requestTimeoutSeconds: parseFloat(e.target.value) || 0.1,
              })
            )
          }}
        />

        <TagsOptionsComp
          options={defaultRequestParams.map((p) => {
            return {
              data: p,
            }
          })}
          selectedOptions={settings.includedRequestParams.map((p) => {
            return {
              data: p,
            }
          })}
          updateOptions={(newParams) => {
            dispatch(
              settingsSlice.actions.update({
                ...settings,
                includedRequestParams: newParams.map((p) => p.data),
              })
            )
          }}
          label={"Included request parameters"}
        />
        <TextField
          label="Native sort dropdown button selector"
          size="md"
          variant="soft"
          value={settings.sortDropdownBtnSelector}
          onChange={(e) => {
            dispatch(
              settingsSlice.actions.update({
                ...settings,
                sortDropdownBtnSelector: e.target.value,
              })
            )
          }}
        />
        <TextField
          label="Native available sort option button selector"
          size="md"
          variant="soft"
          value={settings.availableSortOptionBtnSelector}
          onChange={(e) => {
            dispatch(
              settingsSlice.actions.update({
                ...settings,
                availableSortOptionBtnSelector: e.target.value,
              })
            )
          }}
        />
        <Button
          color="neutral"
          onClick={() => dispatch(settingsSlice.actions.restore())}
        >
          Restore settings
        </Button>
      </Box>
    </>
  )
}

export default AdjustmentsSectionComp
