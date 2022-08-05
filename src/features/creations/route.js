import React               from 'react';
import * as _eateriesSel   from './state';
import {featureRoute, 
        PRIORITY}          from 'feature-router';
import featureName         from './featureName';
import EateriesListScreen  from './comp/EateriesListScreen';
import EateryFilterScreen  from './comp/EateryFilterScreen';

// ***
// *** The routes for this feature.
// ***

export default [

  featureRoute({
    priority: PRIORITY.HIGH,
    content({fassets, appState}) {
      // display CreationFilterScreen, when form is active (accomplished by our logic)
      // ... this is done as a priority route, because this screen can be used to
      //     actually change the view - so we display it regardless of the state of the active view
      if (_creationsSel.isFormFilterActive(appState)) {
        return <CreationFilterScreen/>;
      }
    }
  }),

  featureRoute({
    content({fassets, appState}) {

      // allow other down-stream features to route, when the active view is NOT ours
      if (fassets.sel.curView(appState) !== featureName) {
        return null;
      }
      
      // ***
      // *** at this point we know the active view is ours
      // ***
      
      // display our CreationsListScreen
      return <CreationsListScreen/>;
    }
  }),

];
