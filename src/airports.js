/**
 *  Airports.js
 *
 *  Utility functions to interface with the json files in the asset folder
 *
 */
import iataCodes from "../assets/airports.json" assert { type: "json" };
import activeAirports from "../assets/activeAirports.json" assert { type: "json" };
import airports from "../assets/newAirports.json" assert { type: "json" };
import * as fs from "fs";

/**
 * Checks the codes in activeAirports.json and adds the related value from airports.json to newAirports.json
 */
export const writeToAirportFile = () => {
  const newAirportsJson = [];
  for (const code of iataCodes) {
    if (code.name == "All Airports" || activeAirports.includes(code.iata)) {
      newAirportsJson.push({
        name: code.name,
        city: code.city,
        country: code.country,
        iata: code.iata,
        timezone: code.timezone,
        dst: code.dst,
        tz: code.tz,
      });
    }
  }
  fs.writeFile("newAirports.json", JSON.stringify(newAirportsJson), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

/**
 *
 * @param {String} city
 * @returns String
 *
 * Gets the airport name corresponding to the passed in city
 */
export function getAirport(city) {
  city = city.toLowerCase();
  let ap;

  for (const code of airports) {
    if (code.city.toLowerCase() == city) {
      if (code.name == "All Airports") {
        ap = code;
        break;
      } else {
        ap = code;
      }
    }
  }
  return ap;
}

/**
 *
 * @param {String} airportCode
 * @returns
 *
 * Gets the city name corresponding to the passed in airport
 */
export function getCity(airportCode) {
  for (const code of airports) {
    if (code.iata == airportCode) {
      return code.city;
    }
  }

  return null;
}
