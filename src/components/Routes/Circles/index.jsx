import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromCircles from '../../../ducks/circles';
import CirclesDrawing from './CirclesDrawing';
import CirclesControls from './CirclesControls';
import CirclesItem from './CirclesItem';

const Circles = ({ addCircle, circles, removeCircle, resetCircles }) => (
  <div>
    <CirclesDrawing
      circles={circles}
    />
    <CirclesControls
      addCircle={addCircle}
      resetCircles={resetCircles}
    />
    <ul>
      {circles.map(circle => (
        <CirclesItem
          key={circle.id.toString()}
          id={circle.id}
          removeCircle={removeCircle}
        />
      ))}
    </ul>
  </div>
);
Circles.propTypes = {
  addCircle: PropTypes.func.isRequired,
  circles: PropTypes.array.isRequired,
  removeCircle: PropTypes.func.isRequired,
  resetCircles: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    circles: fromCircles.getCircles(state),
  }),
  {
    addCircle: fromCircles.addCircle,
    removeCircle: fromCircles.removeCircle,
    resetCircles: fromCircles.resetCircles,
  }
)(Circles);
