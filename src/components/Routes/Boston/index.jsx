import React, { Component } from 'react';
import * as d3Core from 'd3';
import * as d3Geo from 'd3-geo';
import './neighborhoods.json';
import styles from './index.scss';

const d3 = { ...d3Core, ...d3Geo };
class Boston extends Component {
  componentDidMount() {
    this.rootEl = d3.select(`#${styles.root}`);
    d3.json('neighborhoods.json', collection => {
      const width = this.rootEl.attr('width');
      const height = this.rootEl.attr('height');
      const albersProjection = d3.geoAlbers()
        .scale(190000)
        .rotate([71.057, 0])
        .center([0, 42.313])
        .translate([width / 2, height / 2]);
      const geoPath = d3.geoPath()
        .projection(albersProjection);
      const rootElNeighborhoods = this.rootEl.append('g');
      rootElNeighborhoods.selectAll('path')
        .data(collection.features)
        .enter()
        .append('path')
        .attr('fill', '#ccc')
        .attr('d', geoPath);
    });
    this.d3Render();
  }
  componentWillReceiveProps() {
    this.d3Render();
  }
  shouldComponentUpdate() {
    return false;
  }
  d3Render() {
  }
  render() {
    return (
      <svg
        id={styles.root}
        width="700"
        height="580"
      />
    );
  }
}
export default Boston;
