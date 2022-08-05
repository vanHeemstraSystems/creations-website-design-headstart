import {createLogic}          from 'redux-logic';
import creationFilterFormMeta from './creationFilterFormMeta';
import _creations             from './featureName';
import * as _creationsSel     from './state';
import _creationsAct          from './actions';
import {expandWithFassets}    from 'feature-u';
import discloseError          from 'util/discloseError';
import {toast}                from 'util/notify';
import CreationServiceMock    from './subFeatures/creationServiceMock/CreationServiceMock';


/**
 * Our persistent monitor that manages various aspects of a given pool.
 */
let curPoolMonitor = {   // current "pool" monitor (initially a placebo)
  pool:   null,          // type: string
  wrapUp: () => 'no-op', // type: function(): void ... cleanup existing monitored resources
};

let   originalCreationService = null;


/**
 * Setup any "guest" user to use a "mocked" creation service backed by
 * an in-memory DB.
 */
export const setupGuestUser = expandWithFassets( (fassets) => createLogic({

  name: `${_creations}.setupGuestUser`,
  type: String(fassets.actions.signIn.complete),

  transform({getState, action, fassets}, next) { // transform() so as to swap out service quickly (before it is needed)

    if (action.user.isGuest()) {

      // swap out our creation service with a mocked in-memory source
      originalCreationService = fassets.creationService;
      fassets.creationService = new CreationServiceMock(); // AI: we are mutating fassets ... may be a  code smell

      // inform user of what is going on
      toast({ msg:'as a "guest" user, your Creation pool is a "mocked" in-memory data source'});
    }

    next(action);
  },

}) );


/**
 * Tear-down any "guest" user, reverting to the original creation
 * service.
 */
export const tearDownGuestUser = expandWithFassets( (fassets) => createLogic({

  name: `${_creations}.tearDownGuestUser`,
  type: String(fassets.actions.signOut),

  process({getState, action, fassets}, dispatch, done) { // process() so as to allow the action to be supplemented with user
    if (action.user.isGuest()) {
      // revert our creation service to the original service
      fassets.creationService = originalCreationService; // AI: we are mutating fassets ... may be a  code smell
    }
    done();
  },

}) );


/**
 * This is the primary logic module, which initially loads (and
 * monitors changes) in the real-time DB for the pool creations of our
 * active user.
 *
 * The key that drives this is the active User.pool identifier.
 * Therefore, we trigger the process off of the 'userProfileChanged'
 * action (where the User.pool is obtained).  This action is emitted:
 *  - on initial startup of our app
 *  - and when the User profile changes (TODO: a future enhancement of the app)
 */
export const monitorDbPool = expandWithFassets( (fassets) => createLogic({

  name:        `${_creations}.monitorDbPool`,
  type:        String(fassets.actions.userProfileChanged), // NOTE: action contains: User object (where we obtain the pool)
  warnTimeout: 0, // long-running logic

  validate({getState, action, fassets}, allow, reject) {

    // no-op if we are already monitoring this same pool
    if (action.user.pool === curPoolMonitor.pool) {
      reject(action); // other-logic/middleware/reducers: YES, self's process(): NO
      return;
    }

    // allow self's process()
    allow(action);
  },

  process({getState, action, fassets}, dispatch, done) {

    // close prior monitor
    curPoolMonitor.wrapUp();

    // create new monitor (retaining needed info for subsequent visibility)
    curPoolMonitor = {
      pool:   action.user.pool,
      wrapUp() {
        done();
      }
    };

    // register our real-time DB listener for the set of creations in our pool
    fassets.creationService.monitorDbCreationPool(
      action.user.pool,
      fassets.sel.getLocation(getState()),
      (creations) => {

        // broadcast a notification of a change in our creations (or the initial population)
        dispatch( _creationsAct.dbPool.changed(creations) );

      });
  },

}) );


/**
 * Close down any real-time monitor of our real-time DB pool (at sign-out time).
 */
export const closeDbPool = expandWithFassets( (fassets) => createLogic({

  name: `${_creations}.closeDbPool`,
  type: String(fassets.actions.signOut),

  process({getState, action, fassets}, dispatch, done) {

    // close prior monitor
    curPoolMonitor.wrapUp();

    // create new placebo monitor
    curPoolMonitor = {
      pool:   null,          // type: string
      wrapUp: () => 'no-op', // type: function(): void ... cleanup existing monitored resources
    };

    done();
  },

}) );


/**
 * Default the actions.filterForm.open() domain param from the
 * appState filter.
 */
export const defaultFilter = createLogic({

  name: `${_creations}.defaultFilter`,
  type: String(_creationsAct.filterForm.open),

  transform({getState, action, fassets}, next) {
    if (!action.domain) {
      action.domain = _creationsSel.getListViewFilter(getState());
    }
    next(action);
  },

});


/**
 * Process creation filter.
 */
export const processFilter = createLogic({

  name: `${_creations}.processFilter`,
  type: String(_creationsAct.filterForm.process),
  
  process({getState, action, fassets}, dispatch, done) {

    // console.log(`xx logic: creation.processFilter, action is: `, action);
    //   action: {
    //     "domain": {
    //       "distance":  6, // null when NOT supplied
    //       "sortOrder": "name",
    //     },
    //     "type": "creations.filter.process",
    //     "values": {
    //       "distance": 6, // null when NOT supplied
    //       "sortOrder": "name",
    //     },
    //   }
    
    // show our view
    dispatch( fassets.actions.changeView(_creations) );

    // close creation form filter
    dispatch( _creationsAct.filterForm.close() );

    done();
  },

});


export const spin = createLogic({

  name: `${_creations}.spin`,
  type: String(_creationsAct.spin),

  transform({getState, action, fassets}, next, reject) {

    const appState          = getState();
    const filteredCreations = _creationsSel.getFilteredCreations(appState);

    // supplement action with spinMsg
    action.spinMsg = `... selecting your creation from ${filteredCreations.length} entries!`;
    next(action);
  },

  process({getState, action, fassets}, dispatch, done) {

    setTimeout( () => {

      const appState = getState();
      const filteredCreations  = _creationsSel.getFilteredCreations(appState);

      // algorithm from MDN ... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      const min      = Math.ceil(0);                        // min is inclusive (in usage below)
      const max      = Math.floor(filteredCreations.length); // max is exclusive (in usage below)
      const randIndx = Math.floor(Math.random() * (max - min)) + min;
      
      const randomCreationId = filteredCreations[randIndx].id;

      dispatch( _creationsAct.spin.complete(randomCreationId) );
      done();

    }, 1200);

  },

});

export const spinComplete = createLogic({

  name: `${_creations}.spinComplete`,
  type: String(_creationsAct.spin.complete),

  process({getState, action, fassets}, dispatch, done) {
    dispatch( _creationsAct.viewDetail(action.eateryId) );
    done();
  },

});


export const addToPoolPrep = createLogic({

  name: `${_creations}.addToPoolPrep`,
  type: String(_creationsAct.dbPool.add),

  async process({getState, action, fassets}, dispatch, done) {
    try {
      const creation = await fassets.discoveryService.fetchCreationDetail(action.creationId);
      dispatch( _creationsAct.dbPool.add.creationDetail(creation) );
    }
    catch(err) {
      // report unexpected error to user
      discloseError({err: err.defineAttemptingToMsg('DiscoveryService.fetchCreationDetail()')});
    }
    finally {
      done();
    }
  },

});



export const addToPool = createLogic({

  name: `${_creations}.addToPool`,
  type: String(_creationsAct.dbPool.add.creationDetail),

  async transform({getState, action, fassets}, next, reject) {
    try {
      // add the new creation
      await fassets.creationService.addCreation(action.creation);
      next(action);
    }
    catch(err) {
      // report unexpected error to user
      discloseError({err});
      reject(action);
    }
  },

});


export const removeFromPool = createLogic({

  name: `${_creations}.removeFromPool`,
  type: String(_creationsAct.dbPool.remove),

  async transform({getState, action, fassets}, next, reject) {
    try {
      // remove the supplied creation
      await fassets.creationService.removeCreation(action.creationId)
      next(action);
    }
    catch(err) {
      // report unexpected error to user
      discloseError({err});
      reject(action);
    }
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default expandWithFassets( (fassets) => [
  setupGuestUser(fassets),
  tearDownGuestUser(fassets),
  monitorDbPool(fassets),
  closeDbPool(fassets),
  ...creationFilterFormMeta.registrar.formLogic(), // inject the standard creation filter form-based logic modules
  defaultFilter,
  processFilter,
  spin,
  spinComplete,
  addToPoolPrep,
  addToPool,
  removeFromPool,
] );
