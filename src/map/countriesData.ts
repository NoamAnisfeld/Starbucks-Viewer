import GeoJSON from 'ol/format/GeoJSON';
import type { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import type { Coordinate } from 'ol/coordinate';
import { useEffect, useState } from 'react';

export {
    getCountryBoundary,
    filterCoordinates as filterCoordinatesByCountry,
    useCountries,
};

type Country = {
    name: string;
    code: string;
}

let countriesGeoJSON: Feature<Geometry>[] = [];
let countries: Country[] = [];
const subscribersToCountriesList: ((countries: Country[]) => void)[] = [];

fetchCountriesGeoJSON()
    .then(result => {
        countriesGeoJSON = result;
        countries = countriesGeoJSON.map(country => ({
            name: country.getProperties().ADMIN,
            code: country.getProperties().ISO_A3
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
        onCountriesListReady(countries);
    })
    .catch(() => {
        console.error('unable to retrieve countries data');
    });

async function fetchCountriesGeoJSON() {
    const url = '/countries.geojson';
    const data = await fetch(url);
    const text = await data.text();
    const features = new GeoJSON().readFeatures(text);
    return features;
}

function getCountryBoundary(countryCodeOrName: string) {

    if (!countryCodeOrName) {
        throw Error('A country code or name is missing');
    }

    const countryGeometry =
        countriesGeoJSON
            .find((country) =>
                countryCodeOrName === country.getProperties().ISO_A3 // code
                || countryCodeOrName === country.getProperties().ADMIN // name
            )
            ?.getGeometry();

    if (!countryGeometry) {
        console.error(`unable to extract country's geometry: ${countryCodeOrName}`);
        return;
    }
    return countryGeometry;
}

function filterCoordinates(coordinates: Coordinate[], boundary: Geometry): Coordinate[] {

    const filteredCoordinates = coordinates.filter(point => {
        return boundary.containsXY(point[0], point[1]);
    });
    return filteredCoordinates;
}

function subscribeToCountriesList(onCountriesListReady: (countries: Country[]) => void) {
    subscribersToCountriesList.push(onCountriesListReady);
}

function unsubscribeFromCountriesList(onCountriesListReady: (countries: Country[]) => void) {
    subscribersToCountriesList.splice(subscribersToCountriesList.indexOf(onCountriesListReady), 1);
}

function onCountriesListReady(countries: Country[]) {
    for (const subscriber of subscribersToCountriesList) {
        subscriber(countries);
    }
}

function useCountries() {

    const [countries, setCountries] = useState<Country[]>([]);
    useEffect(() => {
        subscribeToCountriesList(setCountries);
        return () => unsubscribeFromCountriesList(setCountries);
    }, []);

    return countries;
}