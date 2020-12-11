import React from "react";

import FormControl from '@material-ui/core/FormControl';
import TextField, {
  StandardTextFieldProps as TextFieldProps,
} from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { WidgetProps, utils } from "@rjsf/core";

const { getDisplayLabel } = utils;
const filter = createFilterOptions<string>();

export type TextWidgetProps = WidgetProps & TextFieldProps;

const TextWidget = ({
  id,
  required,
  readonly,
  disabled,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  schema,
  uiSchema,
  rawErrors = [],
  formContext,
  ...textFieldProps
}: TextWidgetProps) => {
  const { autoCompleteOptions, autoComplete } = options;
  const enumOptions = autoCompleteOptions || ([] as any);
  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange(value === "" ? options.emptyValue : value);
  const _onAutoCompleteChange = (_event: object, value: any, _reason: string) =>
    onChange(value === "" ? options.emptyValue : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  let size: 'small' | 'medium' = 'medium';
  if (options.size === 'small') {
    size = 'small';
  }
  let variant: 'standard' | 'outlined' | 'filled' = 'standard' as 'standard';
  if (options.variant === 'outlined') {
    variant = 'outlined' as 'outlined';
  }
  if (options.variant === 'filled') {
    variant = 'filled' as 'filled';
  }

  const displayLabel = getDisplayLabel(
    schema,
    uiSchema
    /* TODO: , rootSchema */
  );

  return (
    <FormControl fullWidth={true} required={required}>
      {autoComplete ? (
        <Autocomplete
          inputValue={value ? value : ''}
          freeSolo={true}
          id={id}
          disabled={disabled || readonly}
          onInputChange={_onAutoCompleteChange}
          options={enumOptions}
          size={size}
          handleHomeEndKeys
          selectOnFocus
          clearOnBlur
          getOptionLabel={(option: any) => option || ''}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            // Suggest the creation of a new value
            if (params.inputValue !== '') {
              filtered.push(`Add "${params.inputValue}"`);
            }

            return filtered;
          }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              margin={'dense'}
              error={!!rawErrors}
              autoFocus={autofocus}
              onBlur={_onBlur}
              onFocus={_onFocus}
              required={required}
              label={displayLabel ? label || schema.title : false}
              variant={variant}
            />
          )}
        />
      ) : (
        <TextField
          error={!!rawErrors}
          id={id}
          label={displayLabel ? label || schema.title : false}
          margin={'dense'}
          autoFocus={autofocus}
          required={required}
          disabled={disabled || readonly}
          type="text"
          value={value ? value : ''}
          onChange={_onChange}
          onBlur={_onBlur}
          onFocus={_onFocus}
          {...(textFieldProps as TextFieldProps)}
        />
      )}
    </FormControl>
  );
};

export default TextWidget;
