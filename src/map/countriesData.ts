import GeoJSON from 'ol/format/GeoJSON';
import { toLonLat } from 'ol/proj';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import type { Coordinate } from 'ol/coordinate';
import { useEffect, useState } from 'react';

export {
    filterCoordinatesByCountry,
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
        }));
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

function filterCoordinatesByCountry(coordinates: Coordinate[], countryCodeOrName: string): Coordinate[] {

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
        return [];
    }

    const filteredCoordinates = coordinates.filter(point => {
        const pointLonLat = toLonLat(point);
        return countryGeometry.containsXY(pointLonLat[0], pointLonLat[1]);
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