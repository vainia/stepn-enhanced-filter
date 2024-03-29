import { AutoGraph, Close, RemoveCircleOutline } from "@mui/icons-material"
import { Button, Box, Checkbox } from "@mui/joy"
import GemSocketComp from "../../components/poppers/GemSocketComp"
import { useAppSelector, useAppDispatch } from "../../redux/store"
import { EGemQuality, EGemType } from "../../services/stepnGemService"
import {
  selectSocketFilters,
  socketFilterSlice,
} from "../../redux/reducers/socketFilterReducer"

const SocketsFilterSectionComp = () => {
  const socketFilters = useAppSelector(selectSocketFilters)
  const socketFiltersCount = socketFilters.sockets.length

  const dispatch = useAppDispatch()

  return (
    <>
      <div>
        {socketFiltersCount < 4 && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<AutoGraph />}
            sx={{ flex: "1" }}
            onClick={() => {
              if (socketFiltersCount < 4) {
                dispatch(
                  socketFilterSlice.actions.add({
                    index: socketFiltersCount,
                    type: EGemType.Comfort,
                    quality: EGemQuality.Common,
                  })
                )
              }
            }}
          >
            Add socket filter
          </Button>
        )}
        {socketFiltersCount > 0 && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RemoveCircleOutline />}
            sx={{
              marginLeft: socketFiltersCount < 4 ? "15px" : "unset",
              flex: socketFiltersCount === 4 ? "1" : "unset",
            }}
            onClick={() => {
              if (socketFiltersCount > 0) {
                dispatch(socketFilterSlice.actions.removeLast())
              }
            }}
          >
            Remove last added
          </Button>
        )}
      </div>

      {socketFiltersCount > 0 && (
        <Box>
          {socketFilters.sockets.map((v, i) => (
            <GemSocketComp
              key={i}
              index={v.index}
              gemLevel={v.quality}
              gemType={v.type}
            />
          ))}
        </Box>
      )}

      <Checkbox
        checked={socketFilters.followOrder}
        onChange={(e) => {
          const { checked } = e.target
          dispatch(socketFilterSlice.actions.setFollowOrder(checked))
        }}
        uncheckedIcon={<Close />}
        label="Gem sockets must follow the order"
      />
    </>
  )
}

export default SocketsFilterSectionComp
