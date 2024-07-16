import { updateMarkedCoordinates } from './markLocations';
import { filterCoordinatesByCountry } from './countriesData';
import { starbucksStoreInfoSchema } from './schema-validation';
import { visibleErrorMessage } from '../utils';

import { fromLonLat } from 'ol/proj';
import type { Coordinate } from 'ol/coordinate';

export { filterMarksByCountry };

let coordinates: Coordinate[] = [];
fetchStarbucksStoresCoordinates()
    .then(result => {
        coordinates = result;
        updateMarkedCoordinates(coordinates);
    })
    .catch(visibleErrorMessage);

async function fetchStarbucksStoresCoordinates() {
    try {
        const url = 'https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json';
        const data = await fetch(url);
        const json = await data.json();
        const storesInfo = starbucksStoreInfoSchema.array().parse(json);
        const coordinates = storesInfo.map(({ longitude, latitude }) => fromLonLat([longitude, latitude]));
        return coordinates;
    } catch (error) {
        throw Error('Unable to retrieve starbucks stores info');
    }
}

function filterMarksByCountry(countryCodeOrName: string): void {
    if (!countryCodeOrName) {
        updateMarkedCoordinates(coordinates);
    } else {
        updateMarkedCoordinates(filterCoordinatesByCountry(coordinates, countryCodeOrName));
    }
}
