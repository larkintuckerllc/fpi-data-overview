import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import rotation from '../ducks/rotation';
import scale from '../ducks/scale';
import selected from '../ducks/selected';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  rotation,
  scale,
  selected,
});
