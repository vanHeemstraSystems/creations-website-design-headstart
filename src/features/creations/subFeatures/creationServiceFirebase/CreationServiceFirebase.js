import firebase           from 'firebase/app';
import                         'firebase/database';
import geodist            from 'geodist';
import CreationServiceAPI from '../creationService/CreationServiceAPI';

/**
 * CreationServiceFirebase is the **real** CreationServiceAPI derivation
 * using the Firebase service APIs.
 * 
 * NOTE: This represents a persistent service of a real-time DB, where
 *       the monitored DB is retained between service invocations.
 */
export default class CreationServiceFirebase extends CreationServiceAPI {

  /**
   * Our persistent monitor that manages various aspects of a given pool.
   */
  curPoolMonitor = {       // current "pool" monitor (initially a placebo)
    pool:   null,          // type: string
    dbRef:  null,          // type: firebase.database.Reference
    wrapUp: () => 'no-op', // type: function(): void ... cleanup existing monitored resources
  };


  /**
   * Monitor a set of creations, within our real-time DB, as defined by
   * the supplied pool.  The real-time monitor is triggered both from
   * an initial population, and when data changes.
   * 
   * @param {string} pool the creation pool identifier to monitor
   * (e.g. 'CreationPool').
   * 
   * @param {(struct: {lat, lng})} baseLoc the location from which to
   * calculate the distance to each creation
   * 
   * @param {function} monitorCB the callback function that
   * communicates the set of monitored creations.  This function is
   * called both for an initial data population, and whenever data
   * changes.  It has the following signature:
   *  + monitorCB(creations): void
   */
  monitorDbCreationPool(pool, baseLoc, monitorCB) {

    // close prior monitor (if any)
    this.curPoolMonitor.wrapUp();

    // create a new monitor (retaining needed info for subsequent visibility)
    this.curPoolMonitor = {
      pool,
      dbRef: firebase.database().ref(`/pools/${pool}`),
      wrapUp() {
        this.dbRef.off('value');
      }
    };

    // listen for creation data changes in the specified pool
    this.curPoolMonitor.dbRef.on('value', (snapshot) => {

      // conditional logic accommodates an empty pool
      // ... a firebase DB philosophy is that it will NOT store empty data (or collections)
      const creations = snapshot.val() !== null ? snapshot.val() : {};

      // supplement creations with distance from the supplied baseLoc (as the crow flies)
      for (const creationId in creations) {
        const creation = creations[creationId];
        creation.distance = geodist([creation.loc.lat, creation.loc.lng], [baseLoc.lat, baseLoc.lng]);
      }

      // notify our supplied monitorCB
      // console.log(`xx CreationServiceFirebase.monitorDbCreationPool() -and- MOCK RECORDING ... creations changed for pool '${this.curPoolMonitor.pool}': ${JSON.stringify(creations)}`);
      monitorCB(creations);

    });
  }


  /**
   * Add new Creation to the DB being monitored (asynchronously).
   *
   * This method can only be called, once a successful
   * monitorDbCreationPool() has been established, because of the
   * persistent nature of this service.
   * 
   * @param {Creation} creation the creation entry to add
   */
  async addCreation(creation) {
    // verify we are monitoring a pool
    if (!this.curPoolMonitor.pool) {
      // unexpected condition
      throw new Error('***ERROR*** (within app logic) CreationServiceFirebase.addCreation(): may only be called once a successful monitorDbCreationPool() has completed.')
              .defineAttemptingToMsg('add a Creation to the DB');
    }

    try {
      // add the creation to our DB pool
      // console.log(`xx CreationServiceFirebase.addCreation() adding creation: /pools/${this.curPoolMonitor.pool}/${creation.id}`);
      const dbRef = firebase.database().ref(`/pools/${this.curPoolMonitor.pool}/${creation.id}`);
      await dbRef.set(creation);
    }
    catch(err) {
      // re-throw unexpected error with qualifier
      throw err.defineAttemptingToMsg(`add creation (${creation.name}) to pool ${this.curPoolMonitor.pool}`);
    }
  }


  /**
   * Remove the supplied creationId from the DB being monitored (asynchronously).
   *
   * This method can only be called, once a successful
   * monitorDbCreationPool() has been established, because of the
   * persistent nature of this service.
   * 
   * @param {number} creationId the creation id to remove
   */
  async removeCreation(creationId) {
    // verify we are monitoring a pool
    if (!this.curPoolMonitor.pool) {
      // unexpected condition
      throw new Error('***ERROR*** (within app logic) CreationServiceFirebase.removeCreation(): may only be called once a successful monitorDbCreationPool() has completed.')
              .defineAttemptingToMsg('remove a Creation from the DB');
    }

    try {
      // remove the creation to our DB pool
      // console.log(`xx CreationServiceFirebase.removeCreation() removing creation: /pools/${this.curPoolMonitor.pool}/${creationId}`);
      const dbRef = firebase.database().ref(`/pools/${this.curPoolMonitor.pool}/${creationId}`);
      await dbRef.set(null);
    }
    catch(err) {
      // re-throw unexpected error with qualifier
      throw err.defineAttemptingToMsg(`remove a creation from pool ${this.curPoolMonitor.pool}`);
    }
  }

};
