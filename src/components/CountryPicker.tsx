import countries from '../assets/countries.json'
import { filterMarksByCountry } from '../map/markStarbucksStores'

export default function CountryPicker() {

    return (
        <label>
            {"Select a country: "}
            <select onChange={e => filterMarksByCountry(e.target.value)}>
                <option value="">All</option>
                {countries.map((country) =>
                    <option key={country.code || country.name} value={country.code || country.name}>
                        {country.name}
                    </option>)}
            </select>
        </label>
    )
}