import React, { useState, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiOptions, GEO_API_URL } from "../api";
import axios from "axios";

const Search = ({ fetchWeatherData }) => {
  const [search, setSearch] = useState("Montreal");

  // const loadOptions = async (inputValue) => {
  //   return fetch(
  //     `${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`,
  //     geoApiOptions
  //   )
  //     .then((response) => response.json())
  //     .then((response) => {
  //       return {
  //         options: response.data.map((city) => {
  //           return {
  //             value: `${city.latitude} ${city.longitude}`,
  //             label: `${city.name}, ${city.countryCode}`,
  //           };
  //         }),
  //       };
  //     });
  // };

  const loadOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`,
        geoApiOptions
      );

      return {
        options: response.data.data.map((city) => ({
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        })),
      };
    } catch (error) {
      console.error("Error fetching cities:", error);
      return { options: [] }; // Return an empty array in case of an error
    }
  };

  const handleChange = (data) => {
    setSearch(data);
    fetchWeatherData(data);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={1000}
      value={search}
      onChange={handleChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
