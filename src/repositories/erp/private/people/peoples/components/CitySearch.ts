import type { ICity } from "src/repositories/erp/private/people/cities/Interface";

import { useState, useCallback } from "react";

import { CityService } from "src/repositories/erp/private/people/cities/CityService";


export const CitySearch = () => {
    const [cities, setCities] = useState<ICity[]>([]);
    const [loadingCity, setLoadingCity] = useState(false);
    const [cityName, setCityName] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

    const fetchCities = useCallback(async (inputValue: string) => {
        if (inputValue.length > 2) {
            setLoadingCity(true);
            const response = await CityService.getAll(1, inputValue, 5);
            if (response instanceof Error) {
                console.error(response.message);
            } else {
                setCities(response.data);
            }
            setLoadingCity(false);
        } else {
            setCities([]);
        }
    }, []);
    return {
        cities,
        loadingCity,
        cityName,
        setCityName,
        fetchCities,
        selectedCity,
        setSelectedCity,
    };
};