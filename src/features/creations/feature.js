import {createFeature}      from 'feature-u';
import _creations           from './featureName';
import _creationsAct        from './actions'; // TODO: QUIRKINESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (creationFilterFormMeta)
import reducer              from './state';
import * as _creationsSel   from './state';
import logic                from './logic';
import route                from './route';
import CreationLeftNavItem  from './comp/CreationLeftNavItem';
import CreationsTitle       from './comp/CreationsTitle';
import CreationsFooter      from './comp/CreationsFooter';


// feature: creations
//          manage and promotes the creations view (a list of pooled
//          and filtered) places, with the ability to select a
//          creation through a random spin.  Selected creations provide
//          the ability to phone, visit their web site, and navigate
//          to them (full details in README)
export default createFeature({
  name: _creations,

  // our public face ...
  fassets: {
    define: {
      'actions.addCreation':     _creationsAct.dbPool.add,      // addCreation(creationId)    ... slight naming variation to original action
      'actions.removeCreation':  _creationsAct.dbPool.remove,   // removeCreation(creationId) ... slight naming variation to original action

      'sel.getCreationDbPool':   _creationsSel.getDbPool, // ... slight naming variation to original selector
    },

    defineUse: {
      [`AppMotif.LeftNavItem.cc4_${_creations}`]: CreationLeftNavItem, // inject our entry into the leftNav

      // auxiliary view content for the creations view
      [`AppMotif.auxViewContent.${_creations}`]: {
        TitleComp:  CreationsTitle,
        FooterComp: CreationsFooter,
      },
    }
  },

  reducer,
  logic,
  route,

  // default the app view to be self
  appInit({showStatus, fassets, appState, dispatch}) {
    dispatch( fassets.actions.changeView(_creations) );
  },
});
