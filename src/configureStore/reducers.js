import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import circles from '../ducks/circles';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  circles,
});
