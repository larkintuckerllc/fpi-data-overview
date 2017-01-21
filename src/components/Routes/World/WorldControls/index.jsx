import React, { PropTypes } from 'react';
import styles from './index.scss';

const WorldControls = ({ scale, setScale }) => (
  <div id={styles.root}>
    <div
      onClick={() => setScale(
        scale < 3 ? scale + 0.25 : 3
      )}
    >
      <span className="glyphicon glyphicon-zoom-in" aria-hidden="true" />
    </div>
    <div
      onClick={() => setScale(
        scale > 1 ? scale - 0.25 : 1
      )}
    >
      <span className="glyphicon glyphicon-zoom-out" aria-hidden="true" />
    </div>
  </div>
);
WorldControls.propTypes = {
  scale: PropTypes.number.isRequired,
  setScale: PropTypes.func.isRequired,
};
export default WorldControls;
