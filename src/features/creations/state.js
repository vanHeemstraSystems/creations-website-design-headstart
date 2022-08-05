import {combineReducers}     from 'redux';
import {reducerHash}           from 'astx-redux-util';
import {expandWithFassets}     from 'feature-u';
import {slicedReducer}         from 'feature-redux';
import {createSelector}        from 'reselect';
import _creations              from './featureName';
import creationFilterFormMeta  from './creationFilterFormMeta';
import _creationsAct           from './actions';

// ***
// *** Our feature reducer, managing state for our creations process.
// ***

// NOTE: expandWithFassets() is used NOT for app injection,
//       but RATHER to delay expansion (avoiding circular dependencies
//       in selector access from creationFilterFormMeta.js)
//       >>> subsequently, fassets is now used to access fassets.actions.signOut action
const reducer = slicedReducer(`view.${_creations}`, expandWithFassets( (fassets) => combineReducers({

  // raw creation entries synced from our realtime DB
  dbPool: reducerHash({
    [_creationsAct.dbPool.changed]: (state, action) => action.creations,
    [fassets.actions.signOut]:      (state, action) => null, // same as initialState ... AI: streamline in "INITIALIZATION" journal entry
  }, null), // initialState

  listView: combineReducers({

    // standard iForm for our CreationFilterForm
    filterForm: creationFilterFormMeta.registrar.formReducer(),

    // filter used in visualizing listView
    filter: reducerHash({
      [_creationsAct.filterForm.process]: (state, action) => action.domain,
      [fassets.actions.signOut]:          (state, action) => ({distance: null, sortOrder: 'name'}), // same as initialState ... AI: streamline in "INITIALIZATION" journal entry
    }, { // initialState
      distance: null,    // distance in miles (default: null - for any distance)
      sortOrder: 'name', // sortOrder: 'name'/'distance'
    }),

  }),

  // selectedCreationId: creationId ... id of selected creation to "display details for" (null for none)
  selectedCreationId: reducerHash({
    [_creationsAct.viewDetail]:       (state, action) => action.creationId,
    [_creationsAct.viewDetail.close]: (state, action) => null,
  }, null), // initialState

  // spin: string ... msg to display when spin operation is in place, null for spin NOT in place
  spin: reducerHash({
    [_creationsAct.spin]:          (state, action) => action.spinMsg,
    [_creationsAct.spin.complete]: (state, action) => null,
  }, null), // initialState

}) ) );

export default reducer;


// ***
// *** Various Selectors
// ***

                                   /** Our feature state root (via slicedReducer as a single-source-of-truth) */
const getFeatureState            = (appState) => reducer.getSlicedState(appState);
const gfs = getFeatureState;       // ... concise alias (used internally)

export const getDbPool           = (appState) => gfs(appState).dbPool;

export const isFormFilterActive  = (appState) => gfs(appState).listView.filterForm ? true : false;
export const getFormFilter       = (appState) => gfs(appState).listView.filterForm;

export const getListViewFilter   = (appState) => gfs(appState).listView.filter;

export const getFilteredEateries  = createSelector(
  getDbPool,
  getListViewFilter,
  (dbPool, filter) => {

    if (!dbPool) {
      return null; // NO dbPool yet ... waiting for pool entries
    }

    // apply filter to dbPool
    // filteredCreations: Creation[]
    const entries = Object.values(dbPool)
                          .filter(entry => { // filter entries
                            // apply distance (when supplied in filter)
                            return filter.distance ? entry.distance <= filter.distance : true;
                          })
                          .sort((e1, e2) => ( // sort entries ... order by:
                            // distance (when requested)
                            (filter.sortOrder==='distance' ? e1.distance-e2.distance : 0) ||
                            // name - either secondary (within distance), or primary (when no distance)
                            e1.name.localeCompare(e2.name)
                          ));

    return entries;
  }
);

export const getSelectedCreation   = (appState) => {
  const  selectedCreationId = gfs(appState).selectedCreationId;
  return selectedCreationId ? gfs(appState).dbPool[selectedCreationId] : null;
};

export const getSpinMsg          = (appState) => gfs(appState).spin;
