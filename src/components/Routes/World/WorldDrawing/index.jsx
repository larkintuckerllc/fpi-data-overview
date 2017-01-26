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
    const { rotation, scale, selected, setSelected } = this.props;
    this.rootEl = d3.select(`#${styles.root}`);
    this.rootSpaceEl = this.rootEl.append('rect')
      .attr('x', -1 * RADIUS)
      .attr('y', -1 * RADIUS)
      .attr('width', RADIUS * 2)
      .attr('height', RADIUS * 2)
      .attr('id', styles.rootSpace);
    this.rootGlobeEl = this.rootEl.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', RADIUS)
      .attr('id', styles.rootGlobe);
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
        .attr('style', `stroke-width: ${scale * 0.25}`)
        .attr('d', d => this.path(d));
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
          .on('click', d => {
            if (this.mousePanned) return;
            setSelected(d.fishery);
          });
        this.rootFisheriesElSelection =
          rootFisheriesEl
          .selectAll(`.${styles.rootFisheriesFeature}`)
          .data(fisheriesWithGeoJSON);
        this.d3Render(rotation, scale, selected);
        this.rootEl.on('mousedown', this.handleMouseDown);
        this.rootEl.on('mousemove', this.handleMouseMove);
        this.rootEl.on('mouseup', this.handleMouseUp);
        this.rootEl.on('mouseleave', this.handleMouseUp);
        this.rootEl.on('touchstart', this.handleTouchStart);
        this.rootEl.on('touchmove', this.handleTouchMove);
        this.rootEl.on('touchend', this.handleTouchEnd);
        this.rootEl.on('wheel', this.handleWheel);
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
    this.rootFisheriesElSelection.on('click', null);
    this.rootEl.on('mousedown', null);
    this.rootEl.on('mousemove', null);
    this.rootEl.on('mouseup', null);
    this.rootEl.on('mouseleave', null);
    this.rootEl.on('touchstart', null);
    this.rootEl.on('touchmove', null);
    this.rootEl.on('touchend', null);
    this.rootEl.on('wheel', null);
  }
  d3Render(rotation, scale, selected) {
    if (this.rootCountriesElSelection === undefined) return;
    this.projection.rotate(rotation);
    this.projection.scale(RADIUS * scale);
    window.requestAnimationFrame(() => {
      this.rootGlobeEl.attr('r', this.projection.scale());
      this.rootCountriesElSelection
        .attr('style', `stroke-width: ${scale * 0.25}`)
        .attr('d', d => this.path(d));
      this.rootFisheriesElSelection
        .attr('class', d => (
          selected !== null && selected.id === d.fishery.id ?
          `${styles.rootFisheriesFeature} ${styles.rootFisheriesFeatureSelected}` :
          styles.rootFisheriesFeature
        ))
        .attr('d', d => this.path(d.geoJSON));
    });
  }
  handleMouseDown() {
    const { removeSelected } = this.props;
    if (this.touchPanning) return;
    removeSelected();
    this.mousePanning = true;
    this.mousePanned = false;
    this.lastPosition = d3Core.mouse(this.rootEl.node());
    this.startPosition = this.lastPosition;
  }
  handleMouseMove() {
    if (!this.mousePanning) return;
    const { rotation, scale, setRotation } = this.props;
    const position = d3Core.mouse(this.rootEl.node());
    const speed = 1 / scale;
    if (
      Math.abs(position[0] - this.startPosition[0]) > RADIUS / 10 ||
      Math.abs(position[1] - this.startPosition[1]) > RADIUS / 10
    ) {
      this.mousePanned = true;
    }
    setRotation([
      (rotation[0] + ((position[0] - this.lastPosition[0]) * speed)) % 360,
      (rotation[1] - ((position[1] - this.lastPosition[1]) * speed)) % 360,
      0,
    ]);
    this.lastPosition = position;
  }
  handleMouseUp() {
    if (!this.mousePanning) return;
    this.mousePanning = false;
  }
  handleTouchStart() {
    const { removeSelected } = this.props;
    if (this.mousePanning) return;
    const touches = d3Core.touches(this.rootEl.node());
    removeSelected();
    if (touches.length > 1) return;
    this.touchPanning = true;
    this.lastPosition = touches[0];
  }
  handleTouchMove() {
    if (!this.touchPanning) return;
    const { rotation, scale, setRotation } = this.props;
    const position = d3Core.touches(this.rootEl.node())[0];
    const speed = 1 / scale;
    setRotation([
      (rotation[0] + ((position[0] - this.lastPosition[0]) * speed)) % 360,
      (rotation[1] - ((position[1] - this.lastPosition[1]) * speed)) % 360,
      0,
    ]);
    this.lastPosition = position;
  }
  handleTouchEnd() {
    if (!this.touchPanning) return;
    const touches = d3Core.touches(this.rootEl.node());
    if (touches.length > 1) return;
    if (touches.length === 1) {
      this.lastPosition = touches[0];
      return;
    }
    this.touchPanning = false;
  }
  handleWheel() {
    const { removeSelected, scale, setScale } = this.props;
    removeSelected();
    const e = d3Core.event;
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
