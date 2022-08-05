import React,
       {useCallback}         from 'react';

import {useSelector,
        useDispatch}         from 'react-redux'
import {makeStyles}          from '@material-ui/core/styles';
import {useForWiderDevice}   from 'util/responsiveBreakpoints';

import _creationsAct         from '../actions';
import * as _creationsSel    from '../state';

import Link                  from '@material-ui/core/Link';
import LinkIcon              from '@material-ui/icons/Link';
import List                  from '@material-ui/core/List';
import ListItem              from '@material-ui/core/ListItem';
import ListItemIcon          from '@material-ui/core/ListItemIcon';
import ListItemText          from '@material-ui/core/ListItemText';
import NavigationIcon        from '@material-ui/icons/Navigation';
import RestaurantIcon        from '@material-ui/icons/Restaurant';
import Table                 from '@material-ui/core/Table';
import TableBody             from '@material-ui/core/TableBody';
import TableCell             from '@material-ui/core/TableCell';
import TableHead             from '@material-ui/core/TableHead';
import TableRow              from '@material-ui/core/TableRow';
import Typography            from '@material-ui/core/Typography';

import CreationDetailScreen  from './CreationDetailScreen';
import SplashScreen          from 'util/SplashScreen';


/**
 * CreationsListScreen displaying a set of creations (possibly filtered).
 */
export default function CreationsListScreen() {

  const filteredCreations = useSelector((appState) => _creationsSel.getFilteredEateries(appState), []);
  const filter            = useSelector((appState) => _creationsSel.getListViewFilter(appState),   []);
  const selectedCreation  = useSelector((appState) => _creationsSel.getSelectedCreation(appState),   []);
  const spinMsg           = useSelector((appState) => _creationsSel.getSpinMsg(appState),          []);

  const dispatch    = useDispatch();
  const showDetail  = useCallback((creationId) => {
    //console.log(`xx showDetail for ${creationId}`);
    dispatch( _creationsAct.viewDetail(creationId) );
  }, []);

  const isWiderDevice = useForWiderDevice();

  const classes = useStyles();

  // no-op if our pool entries are NOT yet retrieved
  if (!filteredCreations) {
    return <SplashScreen msg="... waiting for pool entries"/>;
  }

  const orderByDistance = filter.sortOrder === 'distance';


  //***
  //*** inner function to list content for smaller devices (like cell phones)
  //*** ... using <List>
  //***

  let currentDistance = -1;
  function contentAsList() {

    const content = [];

    filteredCreations.forEach( creation => {

      // optionally supply sub-header when ordered by distance
      if (orderByDistance && creation.distance !== currentDistance) {
        currentDistance = creation.distance;
        const subTxt = `${currentDistance} mile${currentDistance===1?'':'s'}`;
        content.push((
          <ListItem key={`subheader${currentDistance}`}
                    dense
                    className={classes.divider}
                    divider>
            <ListItemText primary={subTxt}
                          primaryTypographyProps={{variant:'subtitle1'}}/>
          </ListItem>
        ));
      }

      // supply our primary entry content
      content.push((
        <ListItem key={creation.id}
                  dense
                  button
                  divider
                  onClick={()=>showDetail(creation.id)}>
          <ListItemIcon>
            <RestaurantIcon/>
          </ListItemIcon>

          <ListItemText 
              primary={
                <Typography variant="h6"
                  noWrap>
                  {creation.name}
                  <Typography display="inline" noWrap>
                    &nbsp;({`${creation.distance} mile${creation.distance===1?'':'s'}`})
                  </Typography>
                </Typography>
              }
              secondary={
                <Typography variant="subtitle1" noWrap>
                  {creation.addr}
                </Typography>
              }/>
        </ListItem>
      ));
    });
    return <List>{content}</List>;
  }

  //***
  //*** inner function to list content for larger devices (like tablets or desktops)
  //*** ... using <Table>
  //***

  function contentAsTable() {
    return (
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            {orderByDistance && <TableCell className={classes.tableHeader}>Miles</TableCell>}
            <TableCell className={classes.tableHeader}>Creation</TableCell>
            <TableCell className={classes.tableHeader}>Phone</TableCell>
            {!orderByDistance && <TableCell className={classes.tableHeader}>Miles</TableCell>}
            <TableCell className={classes.tableHeader}>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { filteredCreations.map( creation => (
              <TableRow key={creation.id}
                        hover
                        onClick={()=>showDetail(creation.id)}>

                {orderByDistance && <TableCell align="right">{creation.distance}</TableCell>}

                <TableCell>
                  {creation.name}
                  {creation.website !== 'not-in-search' &&
                   <>
                     &nbsp;
                     <Link href={creation.website}
                           target="_blank"
                           color="inherit"
                           underline="none">
                       <LinkIcon className={classes.icon}/>
                     </Link>
                   </>
                  }
                </TableCell>

                <TableCell><Typography variant="body2" noWrap>{creation.phone}</Typography></TableCell>

                {!orderByDistance && <TableCell align="right">{creation.distance}</TableCell>}

                <TableCell>
                  <Link href={creation.navUrl}
                        target="_blank"
                        color="inherit"
                        underline="none">
                    <NavigationIcon className={classes.icon}/>
                  </Link> &nbsp;
                  {creation.addr}
                </TableCell>

              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }

  //***
  //*** render our CreationsListScreen
  //***

  const ListContent = () => isWiderDevice ? contentAsTable() : contentAsList();

  return (
    <>
      <ListContent/>
      {spinMsg        && <SplashScreen msg={spinMsg}/>}
      {selectedCreation && <CreationDetailScreen creation={selectedCreation}/>}
    </>
  );
}


const useStyles = makeStyles( theme => ({

  // vary background grey intensity based on light/dark theme
  // ... and text auto oscillates
  divider: {
    backgroundColor: theme.palette.divider,
  },

  table: {
    // hack to move table down a bit (so as to not be covered by our App Header)
    marginTop:  15,
  },

  // hack to make table header ALWAYS visible <<< using "sticky"
  tableHeader: {
    top:      0,
    position: "sticky",
    color:    'black',

    // set the table header background to a light grey
    // NOTE: uses  an opacity-level of 1 (NOT TRANSPARENT)
    //       - use technique that does NOT affect our children (via rgba css function)
    //         ... so when scrolling (with the "sticky" attr, the header is NOT obscured
    //       - this is accomplished through the rgba css function
    //         ... i.e. it is NOT possible through the 'opacity' css attr
    //       - for this reason we cannot tap into our theme colors (via theme.palette)
    //       - SO we choose a neutral color (light grey)
    background: 'rgba(200, 200, 200, 1.0)',  // opacity-level of 1 (NOT TRANSPARENT), while NOT affecting children (because of rgba usage)
  },

  icon: {
    width: 16,
    color: theme.palette.secondary.main, // theme.palette.primary.main (bluish) or theme.palette.secondary.main (redish)
    verticalAlign: 'middle',             // FIX icon alignment when used in conjunction with text
  },

}) );
