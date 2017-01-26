import React, { PropTypes } from 'react';
import styles from './index.scss';

const WorldView = ({ children }) => (
  <div id={styles.root}>{children}</div>
);
WorldView.propTypes = {
  children: PropTypes.node.isRequired,
};
export default WorldView;
