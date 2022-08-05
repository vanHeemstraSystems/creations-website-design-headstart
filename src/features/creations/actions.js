import {generateActions}     from 'action-u';
import _creations             from './featureName';
import creationFilterFormMeta  from './creationFilterFormMeta';

export default generateActions.root({

  [_creations]: { // prefix all actions with our feature name, guaranteeing they are unique app-wide!


    dbPool: {

      changed: { // actions.dbPool.changed(creations): Action
                 // > creations changed: creations: { creationKey1: {id, name, addr, phone, loc, navUrl, website}, creationKey2: {...}}
                 actionMeta: {
                   traits: ['creations'],
                 },
      },


      add: { // actions.dbPool.add(creationId): Action
             // > add creation (from creationId) to pool
             actionMeta: {
               traits: ['creationId'],
             },
      
        creationDetail: { // actions.dbPool.add.creationDetail(creation): Action
                        // > add supplied creation to our pool
                        actionMeta: {
                          traits: ['creation'],
                        },
        },
      
      },

      
      remove: { // actions.dbPool.remove(creationId): Action
                // > remove creation (from creationId) to pool
                actionMeta: {
                  traits: ['creationId'],
                },
      },

    },


    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    filterForm: creationFilterFormMeta.registrar.formActionGenesis(),

    viewDetail: { // actions.viewDetail(creationId): Action
                  // > view creation details (from supplied creationId)
                  actionMeta: {
                    traits: ['creationId'],
                  },

      close: { // actions.viewDetail.close(): Action
               // > close creation details
               actionMeta: {},
      },

    },


    spin: { // actions.spin(): Action
            // > randomly select a creation
            actionMeta: {},

      complete: { // actions.spin.complete(creationId): Action
                  // > spin complete, with supplied creationId selected
                  actionMeta: {
                    traits: ['creationId'],
                  },
      },

    },


  },
});
