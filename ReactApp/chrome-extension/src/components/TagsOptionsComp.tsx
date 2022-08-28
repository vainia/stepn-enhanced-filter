import { Checkbox, FormLabel } from "@mui/joy"
import {
  createFilterOptions,
  Autocomplete,
  TextField,
  styled,
  TextFieldProps,
  OutlinedInputProps,
} from "@mui/material"
import { useState } from "react"

export type TAutocompleteOption = {
  label?: string
  data: string
}

type TTagsOptionsComp = {
  label: string
  options: TAutocompleteOption[]
  selectedOptions: TAutocompleteOption[]
  updateOptions: (options: TAutocompleteOption[]) => void
}

const JoyTextField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(() => ({
  "& .MuiInputBase-root": {
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "var(--joy-palette-neutral-softBg)",
    fieldset: {
      borderWidth: "0px",
    },
    "&:hover": {
      backgroundColor: "var(--joy-palette-neutral-softHoverBg)",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      ".MuiOutlinedInput-notchedOutline": {
        borderWidth: 2,
      },
      fieldset: {
        top: -3,
      },
    },
  },
}))

const TagsOptionsComp = ({
  label,
  options,
  updateOptions,
  selectedOptions,
}: TTagsOptionsComp) => {
  const filter = createFilterOptions<TAutocompleteOption>()
  const [dropdownOptions, setDropdownOptions] = useState(options)

  return (
    <Autocomplete
      multiple
      size="small"
      options={dropdownOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.data}
      filterOptions={(ops, params) => {
        const filtered = filter(ops, params)
        const { inputValue } = params

        // Suggest the creation of a new value
        const isExisting = dropdownOptions.some(
          (option) => inputValue === option.data
        )
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            data: inputValue,
            label: `Custom "${inputValue}"`,
          })
        }
        return filtered
      }}
      value={selectedOptions}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      isOptionEqualToValue={(option, value) => {
        if (!dropdownOptions.some((o) => o.data === value.data)) {
          dropdownOptions.push(value)
          setDropdownOptions(dropdownOptions)
          return true
        }
        return option.data === value.data
      }}
      onChange={(e, ops) => {
        updateOptions(ops)
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox style={{ marginRight: 8 }} checked={selected} />
          {option.label || option.data}
        </li>
      )}
      renderInput={(params) => (
        <>
          <FormLabel>{label}</FormLabel>
          <JoyTextField {...params} />
        </>
      )}
    />
  )
}

export default TagsOptionsComp
