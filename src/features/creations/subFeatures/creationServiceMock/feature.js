import {createFeature}    from 'feature-u';
import featureFlags       from 'featureFlags';
import CreationServiceMock  from './CreationServiceMock';

// feature: creationServiceMock
//          defines the mock 'creationService' implementation,
//          conditionally promoted when WIFI is NOT available(i.e. mocking)
export default createFeature({
  name:    'creationServiceMock',

  enabled: !featureFlags.useWIFI,

  // our public face ...
  fassets: {
    defineUse: {
      'creationService': new CreationServiceMock(),
    },
  },

});
