import iataCodes from "./airports.json" assert { type: "json" };
import activeAirports from "./activeairports.json" assert { type: "json" };
import airports from "./newAirports.json" assert { type: "json" };
import * as fs from "fs";

// const newAirportsJson = [];

// for (const code of iataCodes) {
//   if (code.name == "All Airports" || activeAirports.includes(code.iata)) {
//     newAirportsJson.push({
//       name: code.name,
//       city: code.city,
//       country: code.country,
//       iata: code.iata,
//       timezone: code.timezone,
//       dst: code.dst,
//       tz: code.tz,
//     });
//   }
// }

// fs.writeFile("newAirports.json", JSON.stringify(newAirportsJson), (err) => {
//   if (err) {
//     console.log(err);
//   }
// });

export function getAirport(city) {
  let ap;

  for (const code of airports) {
    if (code.city == city) {
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
