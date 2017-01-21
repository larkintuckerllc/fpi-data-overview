import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromRotation from '../../../ducks/rotation';
import { getScale } from '../../../ducks/scale';
import WorldView from './WorldView';

const World = ({ rotation, scale, setRotation }) => (
  <WorldView
    rotation={rotation}
    scale={scale}
    setRotation={setRotation}
  />
);
World.propTypes = {
  rotation: PropTypes.array.isRequired,
  setRotation: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
};
export default connect(
  (state) => ({
    rotation: fromRotation.getRotation(state),
    scale: getScale(state),
  }),
  {
    setRotation: fromRotation.setRotation,
  }
)(World);
