import React, { PropTypes } from 'react';
import { MIN_SCALE, MAX_SCALE } from '../../../../strings';
import styles from './index.scss';
import zoomIn from './zoomIn.png';
import zoomOut from './zoomOut.png';

const WorldControls = ({ removeSelected, scale, setScale }) => (
  <div id={styles.root}>
    <div
      onClick={() => {
        removeSelected();
        setScale(
          scale < MAX_SCALE ? scale * 2 : MAX_SCALE
        );
      }}
    >
      <img width="45" height="45" alt="zoomIn" src={zoomIn} />
    </div>
    <div
      onClick={() => {
        removeSelected();
        setScale(
          scale > MIN_SCALE ? scale / 2 : MIN_SCALE
        );
      }}
    >
      <img width="45" height="45" alt="zoomOut" src={zoomOut} />
    </div>
  </div>
);
WorldControls.propTypes = {
  removeSelected: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  setScale: PropTypes.func.isRequired,
};
export default WorldControls;
