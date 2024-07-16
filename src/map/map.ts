import './map.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export const tileLayer = new TileLayer({
    source: new OSM(),
});

export const map = new Map({
    layers: [tileLayer],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

map.render();