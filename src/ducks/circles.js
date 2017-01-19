import { combineReducers } from 'redux';
import { normalize, Schema } from 'normalizr';
import { createSelector } from 'reselect';
import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'circles';
// ACTIONS
export const ADD_CIRCLES =
  `${ACTION_PREFIX}ADD_CIRCLES`;
export const REMOVE_CIRCLES =
  `${ACTION_PREFIX}REMOVE_CIRCLES`;
export const RESET_CIRCLES =
  `${ACTION_PREFIX}RESET_CIRCLES`;
// SCHEMA
const circleSchema = new Schema('circles');
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_CIRCLES:
      return {
        ...state,
        ...action.response.entities.circles,
      };
    case REMOVE_CIRCLES: {
      const newState = { ...state };
      delete newState[action.response.result];
      return newState;
    }
    case RESET_CIRCLES: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case ADD_CIRCLES:
      return [...state, action.response.result];
    case REMOVE_CIRCLES: {
      const newState = [...state];
      newState.splice(
        state.indexOf(action.response.result),
        1
      );
      return newState;
    }
    case RESET_CIRCLES:
      return [];
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
});
// ACCESSORS
export const getCircle = (state, id) => state[reducerMountPoint].byId[id];
const getCirclesIds = state => state[reducerMountPoint].ids;
const getCirclesById = state => state[reducerMountPoint].byId;
export const getCircles = createSelector(
  [getCirclesIds, getCirclesById],
  (circlesIds, circlesById) => circlesIds.map(id => circlesById[id])
);
// ACTION CREATOR VALIDATORS
const validCircle = (circle) =>
  !(circle === undefined
  || circle.id === undefined
  || typeof circle.id !== 'number'
  || circle.x === undefined
  || typeof circle.x !== 'number'
  || circle.y === undefined
  || typeof circle.y !== 'number'
  );
const validNewCircle = (state, circle) =>
  validCircle(circle)
  && getCircle(state, circle.id) === undefined;
// ACTION CREATORS
export const addCircle = (circle) => (dispatch, getState) => {
  const newCircle = circle;
  const id = new Date().getTime();
  newCircle.id = id;
  const state = getState();
  if (!validCircle(newCircle)) throw new Error();
  if (!validNewCircle(state, newCircle)) throw new Error();
  dispatch({
    type: ADD_CIRCLES,
    response: normalize(newCircle, circleSchema),
  });
};
export const removeCircle = (id) => (dispatch, getState) => {
  const state = getState();
  if (getCircle(state, id) === undefined) throw new Error();
  dispatch({
    type: REMOVE_CIRCLES,
    response: normalize(getCircle(state, id), circleSchema),
  });
};
export const resetCircles = () => ({
  type: RESET_CIRCLES,
});
