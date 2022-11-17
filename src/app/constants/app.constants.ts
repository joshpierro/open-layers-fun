import {Fill, Stroke, Style, Text, Circle as CircleStyle} from 'ol/style';

export const INITIAL_ZOOM = 18; 
export const MAX_ZOOM = 18; 
export const INITIAL_CENTER = [-73.9944418,40.7196407];
export const BASEMAP_TYPE = 'terrain';
export const MAP_DIV_ID = 'map';
export const DRAW_LINESTRING = 'LineString';
export const DEFAULT_DRAWING_STYLE = new Style(
  {  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.4)',
  }),
  stroke: new Stroke({
    color: '#ff0000',
    width: 2,
  }),
  image: new CircleStyle({
    radius: 1,
    fill: new Fill({color: 'rgba(255, 0, 0, 0.1)'}),
    stroke: new Stroke({color: 'rgba(0, 0, 0, 0)', width: 1}),
  })
});

export const LABEL_STYLE = new Style({
  text: new Text({
    font: '22px Arial,sans-serif',
    fill: new Fill({
      color: 'red',
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 2,
    }),
  }),
});

export const FREEHAND = 'freehand';
export const DRAW_POINT = 'Point';
export const BUSY_INDICATOR_TITLE = 'Map Annotations';
export const BUSY_INDICATOR_MESSAGE = 'Creating edits and sending to mapping team...';