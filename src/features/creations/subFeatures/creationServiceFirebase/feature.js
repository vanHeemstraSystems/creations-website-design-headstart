import {createFeature}         from 'feature-u';
import featureFlags            from 'featureFlags';
import CreationServiceFirebase from './CreationServiceFirebase';

// feature: creationServiceFirebase
//          defines the real 'creationService' (via the Firebase API),
//          conditionally promoted when WIFI is available(i.e. **not**
//          mocking)
export default createFeature({
  name:    'creationServiceFirebase',

  enabled: featureFlags.useWIFI,

  // our public face ...
  fassets: {
    defineUse: {
      'creationService': new CreationServiceFirebase(),
    },
  },

});
