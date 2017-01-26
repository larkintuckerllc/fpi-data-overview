import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromRotation from '../../../ducks/rotation';
import * as fromScale from '../../../ducks/scale';
import WorldView from './WorldView';
import WorldDrawing from './WorldDrawing';
import WorldControls from './WorldControls';

const World = ({ rotation, scale, setRotation, setScale }) => (
  <WorldView>
    <WorldDrawing
      rotation={rotation}
      scale={scale}
      setRotation={setRotation}
      setScale={setScale}
    />
    <WorldControls
      scale={scale}
      setScale={setScale}
    />
  </WorldView>
);
World.propTypes = {
  rotation: PropTypes.array.isRequired,
  setRotation: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  setScale: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    rotation: fromRotation.getRotation(state),
    scale: fromScale.getScale(state),
  }),
  {
    setRotation: fromRotation.setRotation,
    setScale: fromScale.setScale,
  }
)(World);
