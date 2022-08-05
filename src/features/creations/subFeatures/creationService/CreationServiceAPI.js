/**
 * CreationServiceAPI is a "pseudo" interface specifying the CreationService API
 * which all implementations (i.e. derivations) must conform.
 * 
 * NOTE: This represents a persistent service of a real-time DB, where
 *       the monitored DB is retained between service invocations.
 */
export default class CreationServiceAPI {

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
    throw new Error(`***ERROR*** ${this.constructor.name}.monitorDbCreationPool() is a required service method that has NOT been implemented`);
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
    throw new Error(`***ERROR*** ${this.constructor.name}.addCreation() is a required service method that has NOT been implemented`);
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
    throw new Error(`***ERROR*** ${this.constructor.name}.removeCreation() is a required service method that has NOT been implemented`);
  }

};
