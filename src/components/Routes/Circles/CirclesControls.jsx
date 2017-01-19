import React, { PropTypes } from 'react';

const CirclesControls = ({ addCircle, resetCircles }) => (
  <div>
    <button
      onClick={() => {
        addCircle({
          x: Math.random(),
          y: Math.random(),
        });
      }}
    >
    Add</button>
    <button
      onClick={resetCircles}
    >Reset</button>
  </div>
);
CirclesControls.propTypes = {
  addCircle: PropTypes.func.isRequired,
  resetCircles: PropTypes.func.isRequired,
};
export default CirclesControls;
