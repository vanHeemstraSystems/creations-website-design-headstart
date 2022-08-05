import {createFeature}   from 'feature-u';
import CreationServiceAPI  from './CreationServiceAPI';

// feature: creationService
//          promote a service API that manages a real-time persistent
//          "Creations" DB, through the `creationService` use contract
//          (full details in README)
export default createFeature({
  name: 'creationService',

  // our public face ...
  fassets: {
    use: [
      ['creationService', {required: true, type: objectOfTypeCreationServiceAPI}],
    ],
  }
});

function objectOfTypeCreationServiceAPI(fassetsValue) {
  return fassetsValue instanceof CreationServiceAPI ? null : 'object of type CreationServiceAPI, NOT: ' + fassetsValue;
}
