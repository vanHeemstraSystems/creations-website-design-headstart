# creationService feature

The **creationService** feature promotes a persistent "Creations" DB
service (monitoring real-time Creation DB activity) through the
`creationService` fassets reference (**feature-u**'s Cross Feature
Communication mechanism).


## API

A complete API reference can be found in the
[CreationServiceAPI](CreationServiceAPI.js) class.


## Example

Access is provided through the **feature-u** `fassets` reference:

```js
fassets.creationService.monitorDbCreationPool(...)
```


## Mocking

This service can be "mocked" through app-specific
[featureFlag](../../../../featureFlags.js) settings.

This "base" feature merely specifies the `creationService` **use
contract**, supporting **feature-u** validation: _a required resource
of type: `CreationServiceAPI`_.

The actual definition of the service is supplied by other features
(through the `defineUse` directive), either real or mocked (as
directed by `featureFlags.useWIFI`).
