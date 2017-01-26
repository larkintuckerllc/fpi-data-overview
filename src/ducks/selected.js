import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'selected';
// ACTIONS
export const SET_SELECTED = `${ACTION_PREFIX}SET_SELECTED`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_SELECTED:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getSelected = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validSelected = value =>
  !(value === undefined || typeof value !== 'object');
// ACTION CREATORS
export const setSelected = (value) => {
  if (!validSelected(value)) throw new Error();
  return ({
    type: SET_SELECTED,
    value,
  });
};
export const removeSelected = () => ({
  type: SET_SELECTED,
  value: null,
});
