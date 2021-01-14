import React from "react";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from '@material-ui/core/FormControl';

import { WidgetProps } from "@rjsf/core";
import { utils } from "@rjsf/core";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const { asNumber, guessType } = utils;

const nums = new Set(["number", "integer"]);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: any, value: any) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === "") {
    return undefined;
  } else if (type === "array" && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x: any) => guessType(x) === "number")) {
      return asNumber(value);
    } else if (schema.enum.every((x: any) => guessType(x) === "boolean")) {
      return value === "true";
    }
  }

  return value;
};

const find = (array: any[], val: string) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].value === val) {
      return array[i];
    }
  }
};

type MWidgetProps = WidgetProps & {
  options: { [key: string]: boolean | number | string | object | null | any }
}

const SelectWidget = ({
  schema,
  id,
  options,
  label,
  required,
  disabled,
  readonly,
  value,
  multiple,
  autofocus,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  rawErrors = [],
}: MWidgetProps & { schema: any }) => {
  const { enumOptions, enumDisabled, autoComplete } = options;
  const { enumImages } = schema;

  const labelRef = React.useRef<HTMLLabelElement>(null);
  const labelWidth = labelRef.current
    ? labelRef.current.clientWidth
    : (label || schema.title || '').length * 12;

  const emptyValue = multiple ? [] : "";

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string; value: unknown }>) =>
    onChange(processValue(schema, value));
  const _onAutoCompleteChange = (
    _event: object,
    value: any,
    _reason: string
  ) => {
    return onChange(processValue(schema, value && value.value));
  };
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, processValue(schema, value));
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) =>
    onFocus(id, processValue(schema, value));

  let size: 'small' | 'medium' = 'medium';
  if (options.size === 'small') {
    size = 'small';
  }
  let variant: 'standard' | 'outlined' | 'filled' = 'standard';
  if (options.variant === 'outlined') {
    variant = 'outlined' as 'outlined';
  }
  if (options.variant === 'filled') {
    variant = 'filled' as 'filled';
  }

  return (
    <FormControl
      fullWidth={true}
      required={required}
      error={!!rawErrors}
      margin={'dense'}
      variant={variant}
      component='div'
    >
      {autoComplete ? (
        <Autocomplete
          value={
            typeof value === 'undefined' ? emptyValue : find(enumOptions, value)
          }
          id={id}
          disabled={disabled || readonly || schema.readOnly}
          onChange={_onAutoCompleteChange}
          options={enumOptions}
          size={size}
          getOptionLabel={(option: any) => option.label || ''}
          renderInput={(params: any) => (
            <TextField
              {...params}
              error={!!rawErrors}
              autoFocus={autofocus}
              onBlur={_onBlur}
              onFocus={_onFocus}
              required={required}
              label={label || schema.title || undefined}
              variant={variant}
            />
          )}
        />
      ) : (
        <>
          {' '}
          {(label || schema.title) !== '' ? (
            <InputLabel ref={labelRef} shrink={true} htmlFor={id}>
              {label || schema.title}
            </InputLabel>
          ) : null}
          <Select
            multiple={typeof multiple === 'undefined' ? false : multiple}
            value={typeof value === 'undefined' ? emptyValue : value}
            labelWidth={labelWidth}
            displayEmpty={!!placeholder}
            error={!!rawErrors}
            required={required}
            id={id}
            disabled={disabled || readonly || schema.readOnly}
            autoFocus={autofocus}
            onChange={_onChange}
            onBlur={_onBlur}
            onFocus={_onFocus}
          >
            {placeholder ? (
              <MenuItem value={''} disabled>
                {placeholder}
              </MenuItem>
            ) : null}
            {(enumOptions as any).map(({ value, label }: any, i: number) => {
              const disabled: any =
                enumDisabled && (enumDisabled as any).indexOf(value) != -1;
              return (
                <MenuItem
                  key={i}
                  value={value}
                  disabled={disabled}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {enumImages && enumImages[i] ? (
                    <img
                      src={enumImages[i]}
                      style={{
                        width: '15px',
                        height: '15px',
                        marginRight: '6px',
                      }}
                    />
                  ) : null}
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        </>
      )}
    </FormControl>
  );
};

export default SelectWidget;
