import React, { Component, PropTypes } from 'react';
import * as d3Core from 'd3';
import * as d3Geo from 'd3-geo';
import './world-countries.json';
import './samples.json';
import styles from './index.scss';

// TODO: IMPLEMENT ZOOM
const RADIUS = 50;
const d3 = { ...d3Core, ...d3Geo };
class WorldView extends Component {
  constructor() {
    super();
    this.mousePanning = false;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }
  componentDidMount() {
    const { rotation, scale } = this.props;
    this.rootEl = d3.select(`#${styles.root}`);
    this.rootGlobeEl = this.rootEl.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', RADIUS)
      .attr('id', styles.rootGlobe);
    this.projection = d3
      .geoOrthographic()
      .translate([0, 0])
      .scale(RADIUS);
    this.path = d3.geoPath().projection(this.projection);
    this.rootCountriesEl = this.rootEl.append('g');
    this.rootSamplesEl = this.rootEl.append('g');
    d3.json('world-countries.json', countries => {
      this.rootCountriesEl
        .selectAll(`.${styles.rootCountriesFeature}`)
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', styles.rootCountriesFeature)
        .attr('d', d => this.path(d));
      this.rootCountriesElSelection =
        this.rootCountriesEl
        .selectAll(`.${styles.rootCountriesFeature}`)
        .data(countries.features);
      d3.json('samples.json', samples => {
        this.rootSamplesEl
          .selectAll(`.${styles.rootSamplesFeature}`)
          .data(samples.features)
          .enter()
          .append('path')
          .attr('class', styles.rootSamplesFeature)
          .attr('d', d => this.path(d));
        this.rootSamplesElSelection =
          this.rootSamplesEl
          .selectAll(`.${styles.rootSamplesFeature}`)
          .data(samples.features);
        this.d3Render(rotation, scale);
        this.rootEl.node().addEventListener('mousedown', this.handleMouseDown);
        this.rootEl.node().addEventListener('mousemove', this.handleMouseMove);
        this.rootEl.node().addEventListener('mouseup', this.handleMouseUp);
        this.rootEl.node().addEventListener('touchstart', this.handleTouchStart);
        this.rootEl.node().addEventListener('touchmove', this.handleTouchMove);
        this.rootEl.node().addEventListener('touchend', this.handleTouchEnd);
      });
    });
  }
  componentWillReceiveProps({ rotation, scale }) {
    this.d3Render(rotation, scale);
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    this.rootEl.node().removeEventListener('mousedown', this.handleMouseDown);
    this.rootEl.node().removeEventListener('mousemove', this.handleMouseMove);
    this.rootEl.node().removeEventListener('mouseup', this.handleMouseUp);
    this.rootEl.node().removeEventListener('touchstart', this.handleTouchStart);
    this.rootEl.node().removeEventListener('touchmove', this.handleTouchMove);
    this.rootEl.node().removeEventListener('touchend', this.handleTouchEnd);
  }
  d3Render(rotation, scale) {
    if (this.rootCountriesElSelection === undefined) return;
    this.projection.rotate(rotation);
    this.projection.scale(RADIUS * scale);
    window.requestAnimationFrame(() => {
      this.rootGlobeEl.attr('r', this.projection.scale());
      this.rootCountriesElSelection.attr('d', d => this.path(d));
      this.rootSamplesElSelection.attr('d', d => this.path(d));
    });
  }
  handleMouseDown(e) {
    this.mousePanning = true;
    this.mouseLastX = e.pageX;
    this.mouseLastY = e.pageY;
  }
  handleMouseMove(e) {
    if (!this.mousePanning) return;
    const { rotation, setRotation } = this.props;
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    setRotation([
      (rotation[0] + ((mouseX - this.mouseLastX) / 3)) % 360,
      (rotation[1] - ((mouseY - this.mouseLastY) / 3)) % 360,
      0,
    ]);
    this.mouseLastX = mouseX;
    this.mouseLastY = mouseY;
  }
  handleMouseUp() {
    this.mousePanning = false;
  }
  handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    this.touchOneLastX = e.touches[0].pageX;
    this.touchOneLastY = e.touches[0].pageY;
  }
  handleTouchMove(e) {
    const { rotation, setRotation } = this.props;
    const touchOneX = e.touches[0].pageX;
    const touchOneY = e.touches[0].pageY;
    setRotation([
      (rotation[0] + ((touchOneX - this.touchOneLastX) / 3)) % 360,
      (rotation[1] - ((touchOneY - this.touchOneLastY) / 3)) % 360,
      0,
    ]);
    this.touchOneLastX = touchOneX;
    this.touchOneLastY = touchOneY;
  }
  handleTouchEnd() {
  }
  render() {
    return (
      <svg
        id={styles.root}
        viewBox={`-${RADIUS} -${RADIUS} ${RADIUS * 2} ${RADIUS * 2}`}
      />
    );
  }
}
WorldView.propTypes = {
  rotation: PropTypes.array.isRequired,
  scale: PropTypes.number.isRequired,
  setRotation: PropTypes.func.isRequired,
};
export default WorldView;