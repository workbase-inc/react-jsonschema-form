import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { ObjectFieldTemplateProps } from '@rjsf/core';
import { utils } from '@rjsf/core';

import AddButton from '../AddButton/AddButton';

const { canExpand } = utils;

const useStyles = makeStyles({
  root: {
    flexDirection: 'row',
  },
});

const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  disabled,
  readonly,
  uiSchema,
  idSchema,
  schema,
  formData,
  onAddClick,
}: ObjectFieldTemplateProps) => {
  const classes = useStyles();

  return (
    <>
      {(uiSchema['ui:title'] || title) && (
        <TitleField
          id={`${idSchema.$id}-title`}
          title={title}
          required={required}
        />
      )}
      {description && (
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={description}
        />
      )}
      <Grid container={true} spacing={2} className={classes.root}>
        {properties.map((element: any, index: number) =>
          element.content.props.uiSchema['ui:widget'] === 'hidden' ?
            <div key={index}></div> :
            <Grid
              item={true}
              xs={
                (uiSchema[element.name] &&
                  uiSchema[element.name]['ui:width']) ||
                12
              }
              key={index}
              style={{ marginBottom: '10px' }}
            >
              {element.content}
            </Grid>
        )}
        {canExpand(schema, uiSchema, formData) && (
          <Grid container justify='flex-end'>
            <Grid item={true}>
              <AddButton
                className='object-property-expand'
                onClick={onAddClick(schema)}
                disabled={disabled || readonly}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ObjectFieldTemplate;
