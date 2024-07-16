import { useCountries } from '../map/countriesData'
import { updateCountry } from '../map/defineLandmarks'

export default function CountryPicker() {

    const countries = useCountries();

    return (
        <label>
            {"Select a country: "}
            {countries.length
                ? <select defaultValue="" onChange={e => updateCountry(e.target.value)}>
                    <option value="">All</option>
                    {countries.map((country) => {
                        const code = country.code && country.code !== '-99'
                            ? country.code
                            : country.name;
                        return (<option key={code} value={code}>
                            {country.name}
                        </option>)
                    })}
                </select>
                : <select disabled>
                    <option value="">Waiting for list of countries...</option>
                </select>
            }
        </label>
    )
}