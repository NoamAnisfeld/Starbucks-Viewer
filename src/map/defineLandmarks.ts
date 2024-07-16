import { drawCountryBoundary, drawLandmarks } from './drawLandmarks';
import { filterCoordinatesByCountry, getCountryBoundary } from './countriesData';
import { starbucksStoreInfoSchema } from './schema-validation';
import { visibleErrorMessage } from '../utils';
import type { Coordinate } from 'ol/coordinate';

export { updateCountry };

let starbucksStoresCoordinates: Coordinate[] = [];
fetchStarbucksStoresCoordinates()
    .then(result => {
        starbucksStoresCoordinates = result;
        drawLandmarks(starbucksStoresCoordinates);
    })
    .catch(visibleErrorMessage);

async function fetchStarbucksStoresCoordinates() {
    try {
        const url = 'https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json';
        const data = await fetch(url);
        const json = await data.json();
        const storesInfo = starbucksStoreInfoSchema.array().parse(json);
        const coordinates = storesInfo.map(({ longitude, latitude }) => [longitude, latitude]);
        return coordinates;
    } catch (error) {
        throw Error('Unable to retrieve starbucks stores info');
    }
}

function updateCountry(countryCodeOrName: string): void {

    const countryBoundary = countryCodeOrName
        ? getCountryBoundary(countryCodeOrName)
        : undefined;

    if (!countryBoundary) {
        drawCountryBoundary();
        drawLandmarks(starbucksStoresCoordinates);
        return;
    }

    drawCountryBoundary(countryBoundary);
    drawLandmarks(filterCoordinatesByCountry(starbucksStoresCoordinates, countryBoundary));
}