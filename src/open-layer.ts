import './open-layer.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { MultiPoint } from 'ol/geom.js';
import { getVectorContext } from 'ol/render.js';
import { fromLonLat } from 'ol/proj';

const tileLayer = new TileLayer({
    source: new OSM(),
});

const map = new Map({
    layers: [tileLayer],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

const imageStyle = new Style({
    image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: 'yellow' }),
        stroke: new Stroke({ color: 'red', width: 1 }),
    }),
});

const dataUrl = 'https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json';
const data = await fetch(dataUrl);
const json = await data.json();
const coordinates = json.map(({ longitude, latitude }) => fromLonLat([longitude, latitude]));
map.render();

tileLayer.on('postrender', function (event) {

    if (!coordinates) return;

    const vectorContext = getVectorContext(event);
    vectorContext.setStyle(imageStyle);
    vectorContext.drawGeometry(new MultiPoint(coordinates));
});