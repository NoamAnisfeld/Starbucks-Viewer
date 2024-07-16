import { updateMarkedCoordinates } from './markLocations';

import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat, toLonLat } from 'ol/proj';
import type { Coordinate } from 'ol/coordinate';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';

export { filterMarksByCountry };

let countriesGeoJSON: Feature<Geometry>[] = [];
fetchCountriesGeoJSON().then(result =>
    countriesGeoJSON = result
);

let coordinates: Coordinate[] = [];
fetchStarbucksStoresCoordinates().then(result => {
    coordinates = result;
    updateMarkedCoordinates(coordinates);
});

async function fetchCountriesGeoJSON() {
    const url = '/countries.geojson';
    const data = await fetch(url);
    const text = await data.text();
    const features = new GeoJSON().readFeatures(text);
    return features;
}

async function fetchStarbucksStoresCoordinates() {
    const url = 'https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json';
    const data = await fetch(url);
    const json = await data.json();
    const coordinates = json.map(({ longitude, latitude }) => fromLonLat([longitude, latitude]));
    return coordinates;
}

function filterCoordinatesByCountry(countryCodeOrName: string): Coordinate[] {

    if (!countryCodeOrName) return coordinates;

    const countryGeometry =
        countriesGeoJSON
            .find((country) =>
                countryCodeOrName === country.getProperties().ISO_A3 // code
                || countryCodeOrName === country.getProperties().ADMIN // name
            )
            ?.getGeometry();

    if (!countryGeometry) {
        console.error(`unable to extract country's geometry: ${countryCodeOrName}`);
        return coordinates;
    }

    const filteredCoordinates = coordinates.filter(point => {
        const pointLonLat = toLonLat(point);
        return countryGeometry.containsXY(pointLonLat[0], pointLonLat[1]);
    });
    return filteredCoordinates;
}

function filterMarksByCountry(countryCode: string): void {
    updateMarkedCoordinates(filterCoordinatesByCountry(countryCode));
}
