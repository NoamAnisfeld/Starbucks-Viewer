import { Style, Circle, Fill, Stroke } from 'ol/style.js';
import { Geometry, MultiPoint } from 'ol/geom.js';
import { getVectorContext } from 'ol/render.js';
import { map, tileLayer } from './map';
import type { Coordinate } from 'ol/coordinate';

export {
    drawCountryBoundary,
    drawLandmarks,
};

const imageStyle = new Style({
    image: new Circle({
        radius: 3,
        fill: new Fill({ color: 'yellow' }),
        stroke: new Stroke({ color: 'red', width: 1 }),
    }),
});

let countryBoundary: Geometry | undefined;
let landmarksCoordinates: Coordinate[] = [];

tileLayer.on('postrender', function (event) {

    const vectorContext = getVectorContext(event);

    if (countryBoundary) {
        vectorContext.setStyle(new Style({ fill: new Fill({ color: 'green' }) }));
        vectorContext.drawGeometry(countryBoundary);
    }

    vectorContext.setStyle(imageStyle);
    vectorContext.drawGeometry(new MultiPoint(landmarksCoordinates));
});

function drawCountryBoundary(newCountryBoundary?: Geometry | undefined) {
    countryBoundary = newCountryBoundary;
    map.render();
}

function drawLandmarks(newCoordinates: Coordinate[]) {
    landmarksCoordinates = newCoordinates;
    map.render();
}