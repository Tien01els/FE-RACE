import { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Autocomplete, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

interface AutoCompleteOption {
    id: string;
    label: string;
}

interface StringOptions {
    [key: string]: string;
}

export default function Filters() {
    const navigate = useNavigate();
    const { year, apiType, keyId, keyName } = useParams();

    const prevYear = useRef<string>(year || "");
    const prevApiType = useRef<string>(apiType || "");
    const prevKey = useRef<string>(apiType === 'team' ? `${keyId}` : `${keyId}/${keyName}`);
    const isFirst = useRef<boolean>(true);

    const [years, setYears] = useState<string[]>([]);
    const [apiTypes, setApiTypes] = useState<AutoCompleteOption[]>([]);
    const [keys, setKeys] = useState<AutoCompleteOption[]>([]);

    const [currentYear, setCurrentYear] = useState<string | null | undefined>(year);
    const [currentApiType, setCurrentApiType] = useState<AutoCompleteOption | null | undefined>(() => {
        const idApiType = prevApiType.current
        const labelApiType = prevApiType.current === 'team' ? 'TEAMS' : prevApiType.current === 'fastest-laps' ? 'DHL FASTEST LAP AWARD' : prevApiType.current.toUpperCase()
        return { id: idApiType, label: labelApiType }
    });
    const [currentKey, setCurrentKey] = useState<AutoCompleteOption | null | undefined>({ id: '', label: 'ALL' });

    const options: StringOptions = useMemo(() => ({
        races: "meetingKey",
        drivers: "driverRef",
        team: "teamKey"
    }), [])

    useEffect(() => {
        const fetchRaceResults = async () => {
            try {
                // const proxyURL = `https://api.allorigins.win/raw?url=`
                const proxyURL = `https://cors-get-proxy.sirjosh.workers.dev/?url=`
                const formulaURL = `https://www.formula1.com/en/results.html/${currentYear}${(currentApiType && currentApiType.id && '/' + currentApiType.id) || ""}${(currentKey && currentKey.id && '/' + currentKey.id) || ""}.html`
                const response = await axios.get(
                    `${proxyURL}${formulaURL}`
                );
                console.log(formulaURL)
                const $ = cheerio.load(response.data);

                const years = $(`a[data-name="year"]`)
                    .map((_, element) => {
                        const valueYear = element.attribs["data-value"]
                        return valueYear
                    }).get()
                setYears(years)

                const apiTypes = $(`a[data-name="apiType"]`)
                    .map((_, element) => {
                        const name = $(element).find('span.clip').text();
                        const valueApiType: AutoCompleteOption = {
                            id: element.attribs["data-value"],
                            label: name.toUpperCase()
                        }
                        return valueApiType
                    }).get()
                setApiTypes(apiTypes)

                if (currentApiType) {
                    const keys = $(`a[data-name=${options[currentApiType.id]}]`)
                        .map((_, element) => {
                            const name = $(element).find('span.clip').text();
                            const valueKey: AutoCompleteOption = {
                                id: element.attribs["data-value"],
                                label: name.toUpperCase()
                            }
                            return valueKey
                        }).get()
                    setKeys(keys)
                }
            } catch (error) {
                console.error("Error fetching race results:", error);
            }
        };
        fetchRaceResults();
    }, [options, currentApiType, currentKey, currentYear]);

    useEffect(() => {
        if (!isFirst.current) {
            if (currentYear && currentApiType && currentApiType.id && currentKey && currentKey.id) {
                navigate(`/${currentYear}/${currentApiType.id}/${currentKey.id}`);
            } else if (currentYear && currentApiType && currentApiType.id) {
                navigate(`/${currentYear}/${currentApiType.id}`);
            } else if (currentYear) {
                navigate(`/${currentYear}`);
            }
        }
    }, [currentYear, currentApiType, currentKey, navigate]);

    useEffect(() => {
        if (isFirst && isFirst.current && years.length && apiTypes.length && keys.length) {
            if (prevYear && years.includes(prevYear.current)) {
                setCurrentYear(year)
            }
            const apiTypeFinded = apiTypes.find(apiTypeValue => apiTypeValue.id === prevApiType.current)
            if (apiTypeFinded) {
                setCurrentApiType(apiTypeFinded)
            }
            const keyFinded = keys.find(keyValue => keyValue.id === prevKey.current)
            if (keyFinded) {
                setCurrentKey(keyFinded)
            }
            isFirst.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [years, apiTypes, keys])

    return (
        <div className='flex justify-center align-center p-4'>
            <div className="flex gap-4">
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={years}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Year" />}
                    isOptionEqualToValue={(option, value) => option === value}
                    value={currentYear}
                    onChange={(event: any, newValue: string | null) => {
                        if (currentYear && newValue !== currentYear) {
                            setCurrentYear(newValue)
                            setCurrentKey({ id: '', label: 'ALL' })
                        }
                    }}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={apiTypes}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Types" />}
                    value={currentApiType}
                    isOptionEqualToValue={(option, value) => option.id === value.id && option.label === value.label}
                    onChange={(event: any, newValue: AutoCompleteOption | null) => {
                        if (currentApiType && newValue && newValue.id !== currentApiType.id) {
                            setCurrentApiType(newValue)
                            setCurrentKey({ id: '', label: 'ALL' })
                        }
                    }}
                />
                {currentApiType &&
                    currentApiType.id !== 'fastest-laps' &&
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={keys}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Races" />}
                        value={currentKey}
                        isOptionEqualToValue={(option, value) => option.id === value.id && option.label === value.label}
                        onChange={(event: any, newValue: AutoCompleteOption | null) => {
                            if (currentKey && newValue && newValue.id !== currentKey.id)
                                setCurrentKey(newValue)
                        }}
                    />
                }
            </div>
        </div>
    );
}

