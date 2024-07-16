import { Style, Circle, Fill, Stroke } from 'ol/style.js';
import { MultiPoint } from 'ol/geom.js';
import { getVectorContext } from 'ol/render.js';
import { map, tileLayer } from './map';
import type { Coordinate } from 'ol/coordinate';

export { updateMarkedCoordinates };

const imageStyle = new Style({
    image: new Circle({
        radius: 3,
        fill: new Fill({ color: 'yellow' }),
        stroke: new Stroke({ color: 'red', width: 1 }),
    }),
});

let coordinates: Coordinate[] = [];

tileLayer.on('postrender', function (event) {
    const vectorContext = getVectorContext(event);
    vectorContext.setStyle(imageStyle);
    vectorContext.drawGeometry(new MultiPoint(coordinates));
});

function updateMarkedCoordinates(newCoordinates: Coordinate[]) {
    coordinates = newCoordinates;
    map.render();
}