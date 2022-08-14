import { AutoGraph, RemoveCircleOutline } from "@mui/icons-material"
import { Box, Button } from "@mui/joy"
import { useState } from "react"
import AttributesSliderComp from "../../components/AttributesSliderComp"
import AttributeTypeComp from "../../components/poppers/AttributeTypeComp"
import { TAttribute } from "../../services/stepnAttributesService"

type TTypesInUse = {
  [key in TAttribute]: {
    usedBy?: number
  }
}

const AttributesFilterSectionComp = () => {
  const [filtersCount, setFiltersCount] = useState(0)
  const [typesInUse, setTypesInUse] = useState<TTypesInUse>({
    comfort: {},
    efficiency: {},
    luck: {},
    resilience: {},
  })

  const removeUsedTypeByFilterId = (id: number) => {
    Object.keys(typesInUse).forEach((key) => {
      if (typesInUse[key as TAttribute].usedBy === id) {
        typesInUse[key as TAttribute] = {}
        setTypesInUse(typesInUse)
      }
    })
  }

  const availableTypes = Object.keys(typesInUse)
    .map((key) => {
      if (typeof typesInUse[key as TAttribute].usedBy === "undefined") {
        return key as TAttribute
      }
      return null
    })
    .filter((key) => key) as TAttribute[]

  const markUsedType = (id: number, newType: TAttribute) => {
    removeUsedTypeByFilterId(id)
    const updatedTypesInUse = {
      ...typesInUse,
      [newType]: {
        usedBy: id,
      },
    }
    setTypesInUse(updatedTypesInUse)
  }

  return (
    <>
      <div>{JSON.stringify(typesInUse)}</div>
      <Box>
        {filtersCount < 4 && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<AutoGraph />}
            sx={{ flex: "1" }}
            onClick={() => {
              filtersCount < 4 && setFiltersCount(filtersCount + 1)
            }}
          >
            Add attribute filter
          </Button>
        )}
        {filtersCount > 0 && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RemoveCircleOutline />}
            sx={{
              marginLeft: filtersCount < 4 ? "15px" : "unset",
              flex: filtersCount === 4 ? "1" : "unset",
            }}
            onClick={() => {
              if (filtersCount > 0) {
                removeUsedTypeByFilterId(filtersCount - 1)
                setFiltersCount(filtersCount - 1)
              }
            }}
          >
            Remove last
          </Button>
        )}
      </Box>

      {[...Array(filtersCount)].map((v, i) => (
        <Box key={i}>
          <AttributesSliderComp
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: "1 0 auto",
            }}
          />
          <AttributeTypeComp
            id={i}
            attributeType={availableTypes[0]}
            availableTypes={availableTypes}
            button={{
              sx: { flex: "0", marginLeft: "15px" },
              width: "40px",
              height: "40px",
            }}
            onTypeChange={markUsedType}
          />
        </Box>
      ))}
    </>
  )
}

export default AttributesFilterSectionComp
