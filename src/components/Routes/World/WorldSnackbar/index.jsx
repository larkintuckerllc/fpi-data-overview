import React, { PropTypes } from 'react';
import styles from './index.scss';

const scaleWidth = v => 100 * ((v - 1) / 5);
const scaleColor = v => {
  if (v >= 4) return 'green';
  if (v >= 3) return 'yellow';
  return 'red';
};
const WorldSnackbar = ({ selected }) => (
  <div
    id={styles.root}
    style={{ transform: selected === null ? 'translateY(130px)' : 'translateY(0px)' }}
  >
    { window.console.log(selected) }
    { selected !== null &&
      <div id={styles.rootContainer} className="container">
        <img
          id={styles.rootContainerLeft}
          width="165"
          height="110"
          src={`data/img/${selected.id}.jpg`}
          alt="wagu_lobster"
        />
        <div id={styles.rootContainerRight}>
          <div id={styles.rootContainerRightTitle}>
            {selected.title}
          </div>
          <div className={styles.rootContainerRightIndicator}>
            <div className={styles.rootContainerRightIndicatorTitle}>Ecological</div>
            <div className={styles.rootContainerRightIndicatorValue}>
              <div
                className={styles.rootContainerRightIndicatorValueScale}
                style={{
                  width: `${scaleWidth(selected.ecology)}%`,
                  backgroundColor: scaleColor(selected.ecology),
                }}
              />
            </div>
          </div>
          <div className={styles.rootContainerRightIndicator}>
            <div className={styles.rootContainerRightIndicatorTitle}>Economic</div>
            <div className={styles.rootContainerRightIndicatorValue}>
              <div
                className={styles.rootContainerRightIndicatorValueScale}
                style={{
                  width: `${scaleWidth(selected.economic)}%`,
                  backgroundColor: scaleColor(selected.economic),
                }}
              />
            </div>
          </div>
          <div className={styles.rootContainerRightIndicator}>
            <div className={styles.rootContainerRightIndicatorTitle}>Community</div>
            <div className={styles.rootContainerRightIndicatorValue}>
              <div
                className={styles.rootContainerRightIndicatorValueScale}
                style={{
                  width: `${scaleWidth(selected.community)}%`,
                  backgroundColor: scaleColor(selected.community),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    }
  </div>
);
WorldSnackbar.propTypes = {
  selected: PropTypes.object,
};
export default WorldSnackbar;
