import React, { PropTypes } from 'react';
import styles from './index.scss';

const WorldSnackbar = ({ selected }) => (
  <div
    id={styles.root}
    style={{ transform: selected === null ? 'translateY(100px)' : 'translateY(0px)' }}
  >
    <div className="container">
      snackbar
    </div>
  </div>
);
WorldSnackbar.propTypes = {
  selected: PropTypes.object,
};
export default WorldSnackbar;
