import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import styles from './index.scss';

class CirclesDrawing extends Component {
  componentDidMount() {
    const { circles } = this.props;
    this.rootEl = d3.select(`#${styles.root}`);
    this.rootElWidth = this.rootEl.attr('width');
    this.rootElHeight = this.rootEl.attr('height');
    this.d3Render(circles);
  }
  componentWillReceiveProps({ circles }) {
    this.d3Render(circles);
  }
  shouldComponentUpdate() {
    return false;
  }
  d3Render(circles) {
    const rootElSelection = this.rootEl
      .selectAll('circle')
      .data(circles, d => d.id);
    rootElSelection
      .enter()
      .append('circle')
      .attr('cx', d => d.x * this.rootElWidth)
      .attr('cy', d => d.y * this.rootElHeight)
      .attr('r', 0)
      .transition()
      .duration(1500)
      .attr('r', 20);
    rootElSelection
      .exit()
      .transition()
      .duration(1500)
      .attr('r', 0)
      .remove();
  }
  render() {
    return (
      <svg
        id={styles.root}
        width="300"
        height="300"
      />
    );
  }
}
CirclesDrawing.propTypes = {
  circles: PropTypes.array.isRequired,
};
export default CirclesDrawing;
