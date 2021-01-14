import React from "react";

import { default as MUIIconButton } from '@material-ui/core/IconButton';
import Add from "@material-ui/icons/Add";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Remove from "@material-ui/icons/Remove";
import { IconButtonProps as MuiIconButtonProps } from "@material-ui/core/IconButton";
import Tooltip from '@material-ui/core/Tooltip';

const mappings: any = {
  remove: <Remove />,
  plus: <Add />,
  "arrow-up": <ArrowUpward />,
  "arrow-down": <ArrowDownward />,
};

type IconButtonProps = MuiIconButtonProps & {
  icon: string;
  tooltip?: string;
};

const IconButton = (props: IconButtonProps) => {
  const { icon, className, tooltip, ...otherProps } = props;
  return (
    tooltip ? <Tooltip title={tooltip}>
      <MUIIconButton {...otherProps} size="small">
        {mappings[icon]}
      </MUIIconButton>
    </Tooltip> : <MUIIconButton {...otherProps} size="small">
      {mappings[icon]}
    </MUIIconButton>
  );
};

export default IconButton;
