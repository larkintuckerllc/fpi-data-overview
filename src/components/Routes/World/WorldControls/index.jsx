import React, { PropTypes } from 'react';
import { MIN_SCALE, MAX_SCALE } from '../../../../strings';
import styles from './index.scss';

const WorldControls = ({ scale, setScale }) => (
  <div id={styles.root}>
    <div
      onClick={() => setScale(
        scale < MAX_SCALE ? scale * 2 : MAX_SCALE
      )}
    >
      <span className="glyphicon glyphicon-zoom-in" aria-hidden="true" />
    </div>
    <div
      onClick={() => setScale(
        scale > MIN_SCALE ? scale / 2 : MIN_SCALE
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
