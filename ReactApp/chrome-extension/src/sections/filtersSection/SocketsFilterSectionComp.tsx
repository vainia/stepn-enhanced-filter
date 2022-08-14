import { AutoGraph, Close, RemoveCircleOutline } from "@mui/icons-material"
import { Button, Box, Checkbox, Typography } from "@mui/joy"
import { useState } from "react"
import GemSocketComp from "../../components/poppers/GemSocketComp"
import { useAppSelector, useAppDispatch } from "../../redux/store"
import { EGemLevel, EGemType } from "../../services/stepnGemService"
import { counterSlice } from "../../redux/reducers/counterReducer"

const SocketsFilterSectionComp = () => {
  const [socketsCount, setSocketsCount] = useState(0)

  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <>
      <Typography>Socket filter created {count} times</Typography>
      <Box>
        {socketsCount < 4 && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<AutoGraph />}
            sx={{ flex: "1" }}
            onClick={() => {
              socketsCount < 4 && setSocketsCount(socketsCount + 1)
              dispatch(counterSlice.actions.incrementByAmount(1))
            }}
          >
            Add socket filter
          </Button>
        )}
        {socketsCount > 0 && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RemoveCircleOutline />}
            sx={{
              marginLeft: socketsCount < 4 ? "15px" : "unset",
              flex: socketsCount === 4 ? "1" : "unset",
            }}
            onClick={() => {
              if (socketsCount > 0) {
                setSocketsCount(socketsCount - 1)
              }
            }}
          >
            Remove last
          </Button>
        )}
      </Box>

      {socketsCount > 0 && (
        <Box>
          {[...Array(socketsCount)].map((v, i) => (
            <GemSocketComp
              key={i}
              index={i}
              gemLevel={EGemLevel.Unrevealed}
              gemType={EGemType.Comfort}
            />
          ))}
        </Box>
      )}

      <Checkbox uncheckedIcon={<Close />} label="Follow order of sockets" />
    </>
  )
}

export default SocketsFilterSectionComp
