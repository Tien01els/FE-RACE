import { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Autocomplete, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { IAutoCompleteOption, IStringOptions, IInformationTable } from '../../interface';

export default function Filters(props: { setInformationOfFormula: (details: IInformationTable) => void }) {
    const navigate = useNavigate();
    const { year, apiType, keyId, keyName } = useParams();

    const prevYear = useRef<string>(year || "");
    const prevApiType = useRef<string>(apiType || "");
    const prevKey = useRef<string>(apiType === 'team' ? `${keyId}` : `${keyId}/${keyName}`);
    const isFirst = useRef<boolean>(true);

    const [years, setYears] = useState<IAutoCompleteOption[]>([]);
    const [apiTypes, setApiTypes] = useState<IAutoCompleteOption[]>([]);
    const [keys, setKeys] = useState<IAutoCompleteOption[]>([]);

    const [currentYear, setCurrentYear] = useState<IAutoCompleteOption | null | undefined>(() => {
        const year = prevApiType.current || '2023';
        return { id: year, label: year };
    });
    const [currentApiType, setCurrentApiType] = useState<IAutoCompleteOption | null | undefined>(() => {
        const idApiType = prevApiType.current || 'races'
        const labelApiType = prevApiType.current === 'team' ? 'TEAMS' : prevApiType.current === 'fastest-laps' ? 'DHL FASTEST LAP AWARD' : prevApiType.current.toUpperCase() || 'RACES'
        return { id: idApiType, label: labelApiType }
    });
    const [currentKey, setCurrentKey] = useState<IAutoCompleteOption | null | undefined>(() => {
        const idKey = prevApiType.current && prevApiType.current !== 'races' ? 'all' : ''
        return { id: idKey, label: 'ALL' }
    });

    const options: IStringOptions = useMemo(() => ({
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
                const $ = cheerio.load(response.data);

                const years = $(`a[data-name="year"]`)
                    .map((_, element) => {
                        const valueYear: IAutoCompleteOption = {
                            id: element.attribs["data-value"],
                            label: element.attribs["data-value"]
                        }
                        return valueYear
                    }).get()
                setYears(years)

                const apiTypes = $(`a[data-name="apiType"]`)
                    .map((_, element) => {
                        const name = $(element).find('span.clip').text().trim();
                        const valueApiType: IAutoCompleteOption = {
                            id: element.attribs["data-value"],
                            label: name.toUpperCase()
                        }
                        return valueApiType
                    }).get()
                setApiTypes(apiTypes)

                if (currentApiType && currentApiType.id) {
                    const keys = $(`a[data-name=${options[currentApiType.id]}]`)
                        .map((_, element) => {
                            const name = $(element).find('span.clip').text().trim();
                            const valueKey: IAutoCompleteOption = {
                                id: element.attribs["data-value"],
                                label: name.toUpperCase()
                            }
                            return valueKey
                        }).get()
                    setKeys(keys)

                    const informationHead = $(`.resultsarchive-table`)
                        .first()
                        .find("thead th:not(.limiter)")
                        .map((_, element) => {
                            return $(element).text().trim();
                        }).get()

                    const informationBody = $(`.resultsarchive-table`)
                        .first()
                        .find("tbody")
                        .map((_, element) => {
                            return $(element).find('tr').map((_, elementTr) => {
                                return [$(elementTr).find("td:not(.limiter)").map((_, elementTd) => {
                                    if ($(elementTd).children().length) {
                                        if ($(elementTd).find('a').length) {
                                            const href = $(elementTd).find('a').attr('href');
                                            const text = $(elementTd).find('a').text().trim();
                                            return {
                                                href,
                                                text
                                            }
                                        } else {
                                            const tagSpanElement = $(elementTd).find('span')
                                            if (tagSpanElement.length) {
                                                const textArray: string[] = []
                                                tagSpanElement.each((_, elementTd) => {
                                                    textArray.push($(elementTd).text().trim())
                                                })
                                                return $(elementTd).text();
                                            }
                                        }
                                    }
                                    return $(elementTd).text().trim()
                                }).get()]
                            }).get()

                        }).get();
                    props.setInformationOfFormula({
                        headInfo: informationHead,
                        bodyInfo: informationBody
                    })
                }
            } catch (error) {
                console.error("Error fetching race results:", error);
            }
        };
        fetchRaceResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, currentApiType, currentKey, currentYear]);

    useEffect(() => {
        if (!isFirst.current) {
            if (currentYear && currentApiType && currentApiType.id && currentKey && currentKey.id) {
                navigate(`/${currentYear.id}/${currentApiType.id}/${currentKey.id}`);
            } else if (currentYear && currentApiType && currentApiType.id) {
                navigate(`/${currentYear.id}/${currentApiType.id}`);
            } else if (currentYear) {
                navigate(`/${currentYear.id}`);
            }
        }
    }, [currentYear, currentApiType, currentKey, navigate]);

    useEffect(() => {
        if (isFirst && isFirst.current && years.length && apiTypes.length && keys.length) {
            const yearFinded = years.find(year => year.id === prevYear.current)
            if (yearFinded) {
                setCurrentYear(yearFinded)
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
        <div className='flex justify-center align-center px-12 pt-4 pb-2'>
            <div className="flex max-md:flex-col gap-4 w-full">
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={years}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Year" />}
                    isOptionEqualToValue={(option, value) => option === value}
                    value={currentYear}
                    onChange={(event: any, newValue: IAutoCompleteOption | null) => {
                        if (currentYear && newValue && newValue.id !== currentYear.id) {
                            setCurrentYear(newValue)
                            const idKey = currentApiType && currentApiType.id && currentApiType.id !== 'races' ? 'all' : ''
                            setCurrentKey({ id: idKey, label: 'ALL' })
                        }
                    }}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={apiTypes}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Types" />}
                    value={currentApiType}
                    isOptionEqualToValue={(option, value) => option.id === value.id && option.label === value.label}
                    onChange={(event: any, newValue: IAutoCompleteOption | null) => {
                        if (currentApiType && newValue && newValue.id !== currentApiType.id) {
                            setCurrentApiType(newValue)
                            const idKey = newValue.id && newValue.id !== 'races' ? 'all' : ''
                            setCurrentKey({ id: idKey, label: 'ALL' })
                        }
                    }}
                />
                {currentApiType &&
                    currentApiType.id !== 'fastest-laps' ?
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={keys}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="" />}
                        value={currentKey}
                        isOptionEqualToValue={(option, value) => option.id === value.id && option.label === value.label}
                        onChange={(event: any, newValue: IAutoCompleteOption | null) => {
                            if (currentKey && newValue && newValue.id !== currentKey.id)
                                setCurrentKey(newValue)
                        }}
                    /> : <div className="w-[100%]"></div>
                }
            </div>
        </div>
    );
}

