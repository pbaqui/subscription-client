import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import styles from "assets/jss/material-dashboard-react/components/listStyle.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles(styles);

export default function CustomList(props) {
  const classes = useStyles();
  const { listHeader, listItem, defaultValues, register } = props;

  const FormSwitch = ({
    name,
    value,
    register,
    defaultValue
  }) => {
    return (
      <FormControlLabel
        control={<Switch color='primary' defaultChecked={defaultValue} edge="start"/>}
        name={name}
        inputRef={register}
        value={value}
      />
    );
  };

  return (
    <div className={classes.itemResponsive}>
      <List subheader={<ListSubheader>{listHeader}</ListSubheader>} className={classes.root}>
        {listItem.map((item,i) => {
          return (
            <ListItem key={item.planId} >
              <ListItemIcon> 
                <FormSwitch
                  key={item.planId}
                  name={`planes[${i}]`}
                  value={item.planId}
                  register={register}
                  defaultValue={defaultValues.planes.some(p => p === item.planId)}
                />
                </ListItemIcon>
              <ListItemText id={item.planId} primary={item.nombre} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

CustomList.propTypes = {
  listHeader: PropTypes.string,
  listItem: PropTypes.arrayOf(PropTypes.object),
  register: PropTypes.func,
  defaultValues: PropTypes.object.isRequired
};
