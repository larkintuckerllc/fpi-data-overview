import React, { PropTypes } from 'react';

const CirclesItem = ({ id, removeCircle }) => (
  <li>
    {id.toString()}
    <button
      onClick={() => {
        removeCircle(id);
      }}
    >X</button>
  </li>
);
CirclesItem.propTypes = {
  id: PropTypes.number.isRequired,
  removeCircle: PropTypes.func.isRequired,
};
export default CirclesItem;
