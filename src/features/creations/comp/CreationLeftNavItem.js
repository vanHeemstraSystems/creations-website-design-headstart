import React,
       {useCallback}  from 'react';

import {useFassets}   from 'feature-u';
import {useDispatch}  from 'react-redux'

import _creations     from '../featureName';
import _creationsAct  from '../actions';

import {makeStyles}  from '@material-ui/core/styles';

import Divider                  from '@material-ui/core/Divider';
import ListItem                 from '@material-ui/core/ListItem';
import ListItemIcon             from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';
import ListItemText             from '@material-ui/core/ListItemText';
import PoolIcon                 from '@material-ui/icons/RestaurantMenu'; // possibilities: Restaurant RestaurantMenu Star StarRate Stars BlurOn AllOut DragIndicator GroupWork Reorder Apps Whatshot
import SettingsIcon             from '@material-ui/icons/Tune';           // possibilities: Tune PermDataSetting Settings PhonelinkSetup FilterList Filter
import IconButton               from '@material-ui/core/IconButton';

/**
 * CreationLeftNavItem: our Creation entry into the LeftNav.
 */
export default function CreationLeftNavItem() {

  const fassets      = useFassets();
  const dispatch     = useDispatch();
  const changeView   = useCallback(() => dispatch( fassets.actions.changeView(_creations) ), [fassets]);
  const handleFilter = useCallback(() => dispatch( _creationsAct.filterForm.open() ),        [fassets]);
  const classes      = useStyles();

  // render our menu item
  return (
    <>
      <ListItem button
                onClick={changeView}>
        <ListItemIcon className={classes.major}><PoolIcon/></ListItemIcon>
        <ListItemText primaryTypographyProps={{className:classes.major}} primary="Pool"/>
        <ListItemSecondaryAction onClick={handleFilter}>
          <ListItemIcon><IconButton className={classes.minor}><SettingsIcon/></IconButton></ListItemIcon>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider/>
    </>
  );
}


const useStyles = makeStyles( theme => ({
  major: {
    color: theme.palette.grey.A200, // light grey (or redish: theme.palette.secondary.main)
  },
  minor:{
    color: theme.palette.primary.dark,   // bluish
  },
}) );
