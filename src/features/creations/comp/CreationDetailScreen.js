import React,
       {useCallback}      from 'react';
import PropTypes          from 'prop-types';

import {useFassets}       from 'feature-u';
import {useSelector,
        useDispatch}      from 'react-redux'
import {makeStyles}       from '@material-ui/core/styles';
import {useForCellPhone}  from 'util/responsiveBreakpoints';

import _creationsAct      from '../actions';

import CloseIcon          from '@material-ui/icons/Close';
import Dialog             from '@material-ui/core/Dialog';
import DialogActions      from '@material-ui/core/DialogActions';
import DialogContent      from '@material-ui/core/DialogContent';
import DialogTitle        from '@material-ui/core/DialogTitle';
import IconButton         from '@material-ui/core/IconButton';
import Link               from '@material-ui/core/Link';
import LinkIcon           from '@material-ui/icons/Link';
import List               from '@material-ui/core/List';
import ListItem           from '@material-ui/core/ListItem';
import ListItemIcon       from '@material-ui/core/ListItemIcon';
import ListItemText       from '@material-ui/core/ListItemText';
import NavigationIcon     from '@material-ui/icons/Navigation';
import PhoneIcon          from '@material-ui/icons/Phone';
import SpinIcon           from '@material-ui/icons/SwapCalls';
import Typography         from '@material-ui/core/Typography';
import {TransitionZoom}   from 'util/Transition';


/**
 * CreationDetailScreen displaying the details of a given creation.
 */
export default function CreationDetailScreen({creation}) {

  const fassets     = useFassets();
  const curUser     = useSelector((appState) => fassets.sel.curUser(appState), [fassets]);

  const dispatch    = useDispatch();
  const handleClose = useCallback(() => dispatch( _creationsAct.viewDetail.close() ), []);
  const handleSpin  = useCallback(() => dispatch( _creationsAct.spin() ),             []);

  const isCellPhone = useForCellPhone();

  const classes     = useStyles();

  return (
    <Dialog open={true}
            onClose={handleClose}
            fullScreen={isCellPhone}
            TransitionComponent={TransitionZoom}>

      <DialogTitle disableTypography className={classes.titleBar}>
        
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Eatery
          <Typography color="inherit" display="inline" noWrap>
            &nbsp;({curUser.pool})
          </Typography>
        </Typography>

        <IconButton color="inherit" onClick={handleClose}>
          <CloseIcon />
        </IconButton>

      </DialogTitle>

      <DialogContent>
        <List>

          <ListItem>
            <ListItemText 
                primary={<Typography variant="h6">{creation.name}</Typography>}/>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <NavigationIcon/>
            </ListItemIcon>
            <ListItemText 
                primary={
                  <Link variant="body1" 
                        href={creation.navUrl}
                        target="_blank"
                        color="inherit"
                        underline="none">
                    {creation.addr}
                  </Link>
                }
                secondary={`${creation.distance} mile${creation.distance===1?'':'s'}`}/>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <PhoneIcon/>
            </ListItemIcon>
            <ListItemText 
                primary={
                  <Link variant="body1" 
                        href={`tel:${creation.phone}`}
                        color="inherit"
                        underline="none">
                    {creation.phone}
                  </Link>
                }/>
          </ListItem>

          {creation.website !== 'not-in-search' &&
          <ListItem>
            <ListItemIcon>
              <LinkIcon/>
            </ListItemIcon>
            <ListItemText 
                primary={
                  <Link variant="body1" 
                        href={creation.website}
                        target="_blank"
                        color="inherit"
                        underline="none">
                    Web Site
                  </Link>
                }/>
          </ListItem>
          }

        </List>
      </DialogContent>

      <DialogActions className={classes.bottomBar}>
        <IconButton color="inherit" onClick={handleSpin}>
          <SpinIcon/>
          <Typography color="inherit" variant="subtitle1">&nbsp;&nbsp;Spin Again</Typography>
        </IconButton>
      </DialogActions>

    </Dialog>
  );
}

CreationDetailScreen.propTypes = {
  creation:     PropTypes.object.isRequired,
};


const useStyles = makeStyles( theme => ({
  titleBar: {
    display:         'flex',
    alignItems:      'center', // vertically align title text with close (X) to it's right
    padding:         '10px 15px',
    color:           theme.palette.common.white,
    backgroundColor: theme.palette.primary.main, // theme.palette.primary.main (bluish) or theme.palette.secondary.main (redish)
  },

  title: {
    flexGrow: 1, // moves right-most toolbar items to the right
  },

  bottomBar: {
    color:           theme.palette.common.white,
    backgroundColor: theme.palette.primary.main, // theme.palette.primary.main (bluish) or theme.palette.secondary.main (redish)
  },
}) );
