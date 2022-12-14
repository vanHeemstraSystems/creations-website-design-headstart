import * as Yup          from 'yup';
import IFormMeta         from 'util/iForms/IFormMeta';
import _creationsAct      from './actions';
import * as _creationsSel from './state';

/* eslint-disable no-whitespace-before-property */  // special case here (for readability)

const distanceMsg  = 'Miles should be a positive number (when supplied)';
const sortOrderMsg = "Sort order should be either 'name' or 'distance'";

export default IFormMeta({
  formDesc:  'Pool Filter',
  formSchema: Yup.object().shape({
    // distance is an optional positive number (or null for any distance)
    // NOTE: could NOT get default() to work, but transform() to null, works in conjunction with .nullable()
    distance:   Yup.number().label('Miles').typeError(distanceMsg)  .nullable() .transform(val => val || null) .positive(distanceMsg),
    sortOrder:  Yup.string().label('Sort') .typeError(sortOrderMsg) .required() .matches(/(name|distance)/, sortOrderMsg),

  }),
  formActionsAccessor: ()         => _creationsAct.filterForm,
  formStateSelector:   (appState) => _creationsSel.getFormFilter(appState),
});
