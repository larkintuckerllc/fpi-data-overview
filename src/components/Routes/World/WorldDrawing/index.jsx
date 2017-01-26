import React, { Component, PropTypes } from 'react';
import * as d3Core from 'd3';
import * as d3Geo from 'd3-geo';
import { MIN_SCALE, MAX_SCALE } from '../../../../strings';
import './world-countries.json';
import './fisheries.json';
import styles from './index.scss';

const CIRCLE_RADIUS = 0.75;
const RADIUS = 50;
const d3 = { ...d3Core, ...d3Geo };
const circle = d3.geoCircle();
class WorldDrawing extends Component {
  constructor() {
    super();
    this.mousePanning = false;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
  }
  componentDidMount() {
    const { removeSelected, rotation, scale, selected, setSelected } = this.props;
    this.rootEl = d3.select(`#${styles.root}`);
    this.rootGlobeEl = this.rootEl.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', RADIUS)
      .attr('id', styles.rootGlobe)
      .on('click', () => {
        removeSelected();
      });
    const rootCountriesEl = this.rootEl.append('g');
    const rootFisheriesEl = this.rootEl.append('g');
    this.projection = d3
      .geoOrthographic()
      .translate([0, 0])
      .scale(RADIUS);
    this.path = d3.geoPath().projection(this.projection);
    d3.json('world-countries.json', countries => {
      rootCountriesEl
        .selectAll(`.${styles.rootCountriesFeature}`)
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', styles.rootCountriesFeature)
        .attr('d', d => this.path(d))
        .on('click', removeSelected);
      this.rootCountriesElSelection =
        rootCountriesEl
        .selectAll(`.${styles.rootCountriesFeature}`)
        .data(countries.features);
      d3.json('fisheries.json', fisheries => {
        const fisheriesWithGeoJSON = fisheries.map(o => (
          { fishery: o, geoJSON: circle.center([o.latlng[1], o.latlng[0]]).radius(CIRCLE_RADIUS)() }
        ));
        rootFisheriesEl
          .selectAll(`.${styles.rootFisheriesFeature}`)
          .data(fisheriesWithGeoJSON)
          .enter()
          .append('path')
          .attr('class', d => (
            selected !== null && selected.id === d.fishery.id ?
              `${styles.rootFisheriesFeature} ${styles.rootFisheriesFeatureSelected}` :
              styles.rootFisheriesFeature
          ))
          .attr('d', d => this.path(d.geoJSON))
          .on('click', (d) => {
            setSelected(d.fishery);
          });
        this.rootFisheriesElSelection =
          rootFisheriesEl
          .selectAll(`.${styles.rootFisheriesFeature}`)
          .data(fisheriesWithGeoJSON);
        this.d3Render(rotation, scale, selected);
        this.rootEl.node().addEventListener('mousedown', this.handleMouseDown);
        this.rootEl.node().addEventListener('mousemove', this.handleMouseMove);
        this.rootEl.node().addEventListener('mouseup', this.handleMouseUp);
        this.rootEl.node().addEventListener('touchstart', this.handleTouchStart);
        this.rootEl.node().addEventListener('touchmove', this.handleTouchMove);
        this.rootEl.node().addEventListener('touchend', this.handleTouchEnd);
        this.rootEl.node().addEventListener('wheel', this.handleWheel);
      });
    });
  }
  componentWillReceiveProps({ rotation, scale, selected }) {
    this.d3Render(rotation, scale, selected);
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
    this.rootEl.node().removeEventListener('wheel', this.handleWheel);
  }
  d3Render(rotation, scale, selected) {
    if (this.rootCountriesElSelection === undefined) return;
    this.projection.rotate(rotation);
    this.projection.scale(RADIUS * scale);
    window.requestAnimationFrame(() => {
      this.rootGlobeEl.attr('r', this.projection.scale());
      this.rootCountriesElSelection.attr('d', d => this.path(d));
      this.rootFisheriesElSelection
        .attr('class', d => (
          selected !== null && selected.id === d.fishery.id ?
          `${styles.rootFisheriesFeature} ${styles.rootFisheriesFeatureSelected}` :
          styles.rootFisheriesFeature
        ))
        .attr('d', d => this.path(d.geoJSON));
    });
  }
  handleMouseDown(e) {
    this.mousePanning = true;
    this.mouseLastX = e.pageX;
    this.mouseLastY = e.pageY;
  }
  handleMouseMove(e) {
    if (!this.mousePanning) return;
    const { rotation, scale, setRotation } = this.props;
    const speed = (0.25) * (1 / scale);
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    setRotation([
      (rotation[0] + ((mouseX - this.mouseLastX) * speed)) % 360,
      (rotation[1] - ((mouseY - this.mouseLastY) * speed)) % 360,
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
    const { rotation, scale, setRotation } = this.props;
    const speed = (0.25) * (1 / scale);
    const touchOneX = e.touches[0].pageX;
    const touchOneY = e.touches[0].pageY;
    setRotation([
      (rotation[0] + ((touchOneX - this.touchOneLastX) * speed)) % 360,
      (rotation[1] - ((touchOneY - this.touchOneLastY) * speed)) % 360,
      0,
    ]);
    this.touchOneLastX = touchOneX;
    this.touchOneLastY = touchOneY;
  }
  handleTouchEnd() {
  }
  handleWheel(e) {
    const { scale, setScale } = this.props;
    if (e.deltaY <= 0) {
      setScale(
        scale < MAX_SCALE ? scale * 2 : MAX_SCALE
      );
    } else {
      setScale(
        scale > MIN_SCALE ? scale / 2 : MIN_SCALE
      );
    }
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
WorldDrawing.propTypes = {
  removeSelected: PropTypes.func.isRequired,
  rotation: PropTypes.array.isRequired,
  scale: PropTypes.number.isRequired,
  selected: PropTypes.object,
  setRotation: PropTypes.func.isRequired,
  setScale: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};
export default WorldDrawing;
