import { useCountries } from '../map/countriesData'
import { filterMarksByCountry } from '../map/markStarbucksStores'

export default function CountryPicker() {

    const countries = useCountries();

    return (
        <label>
            {"Select a country: "}
            {countries.length
                ? <select onChange={e => filterMarksByCountry(e.target.value)}>
                    <option value="">All</option>
                    {countries.map((country) =>
                        <option key={country.code || country.name} value={country.code || country.name}>
                            {country.name}
                        </option>)
                    }
                </select>
                : <select disabled>
                    <option selected>Waiting for list of countries...</option>
                </select>
            }
        </label>
    )
}