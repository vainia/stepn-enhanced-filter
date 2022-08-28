import { AutoGraph, Close, RemoveCircleOutline } from "@mui/icons-material"
import { Box, Button, Checkbox } from "@mui/joy"
import AttributesSliderComp from "../../components/AttributesSliderComp"
import AttributeTypeComp from "../../components/poppers/AttributeTypeComp"
import {
  attributeFilterSlice,
  selectAttributeFilters,
  selectAttributeFiltersActive,
  selectAvailableAttributeTypes,
} from "../../redux/reducers/attributesFilterReducer"
import { useAppDispatch, useAppSelector } from "../../redux/store"

const AttributesFilterSectionComp = () => {
  const attributeFiltersActive = useAppSelector(selectAttributeFiltersActive)
  const availableAttributeTypes = useAppSelector(selectAvailableAttributeTypes)
  const { onlyBaseAttributes } = useAppSelector(selectAttributeFilters)

  const dispatch = useAppDispatch()

  return (
    <>
      <div>
        {attributeFiltersActive.length < 4 && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<AutoGraph />}
            sx={{ flex: "1" }}
            onClick={() => {
              dispatch(
                attributeFilterSlice.actions.replaceUsedTypeByFilterId({
                  usedBy: attributeFiltersActive.length,
                  newType: availableAttributeTypes[0],
                })
              )
            }}
          >
            Add attribute filter
          </Button>
        )}
        {attributeFiltersActive.length > 0 && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RemoveCircleOutline />}
            sx={{
              marginLeft: attributeFiltersActive.length < 4 ? "15px" : "unset",
              flex: attributeFiltersActive.length === 4 ? "1" : "unset",
            }}
            onClick={() => {
              const lastFilterId = attributeFiltersActive.length - 1
              dispatch(
                attributeFilterSlice.actions.removeUsedByFilterId({
                  usedBy: lastFilterId,
                })
              )
            }}
          >
            Remove last added
          </Button>
        )}
      </div>

      {attributeFiltersActive.map((v, i) => (
        <Box key={v.type}>
          <AttributesSliderComp
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: "1 0 auto",
              marginLeft: "15px",
            }}
            type={v.type}
            minBase={v.minBase}
            minAssigned={v.minAssigned}
          />
          <AttributeTypeComp
            usedBy={v.usedBy}
            attributeType={v.type}
            availableTypes={availableAttributeTypes}
            button={{
              sx: { flex: "0", marginLeft: "15px" },
              width: "40px",
              height: "40px",
            }}
          />
        </Box>
      ))}

      <Checkbox
        checked={onlyBaseAttributes}
        onChange={(e) => {
          const { checked } = e.target
          dispatch(
            attributeFilterSlice.actions.updateOnlyBaseAttributes(checked)
          )
        }}
        label="Sneaker must only contain base attributes"
        uncheckedIcon={<Close />}
      />
    </>
  )
}

export default AttributesFilterSectionComp
