/**
 * Flightapi.js
 *
 * Makes calls to the Amadeus API for flight information
 */
import "dotenv/config";
import fetch from "node-fetch";

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    this.response = response;
  }
}

/**
 *
 * @param {Response} response
 * @returns Response
 *
 * Checks if API response is valid
 */
const checkStatus = (response) => {
  if (response.ok) {
    // response.status >= 200 && response.status < 300
    return response;
  } else {
    throw new HTTPResponseError(response);
  }
};

/**
 * Retrieves the access token from the Amadeus API
 *
 * @returns String
 */
async function getBearerToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  try {
    const response = await fetch(process.env.TOKEN_ENDPOINT, {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    checkStatus(response);
    const data = await response.json();

    return data.access_token;
  } catch (error) {
    const errorBody = await error.response.text();
    console.error(`Error body: ${errorBody}`);
  }
}

/**
 *
 * @param {String} origin
 * @param {String} destination
 * @param {String} departureDate
 * @param {String} departureTime
 * @returns String
 *
 * Makes callout to API for flight offer information
 */
async function getFlightOffersData(
  origin,
  destination,
  departureDate,
  departureTime
) {
  const bearerToken = await getBearerToken();
  const reqBody = {
    currencyCode: "CAD",
    originDestinations: [
      {
        id: "1",
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDateTimeRange: {
          date: departureDate,
          time: departureTime,
        },
      },
    ],
    travelers: [
      {
        id: "1",
        travelerType: "ADULT",
      },
    ],
    sources: ["GDS"],
    searchCriteria: {
      maxFlightOffers: 2,
      flightFilters: {
        cabinRestrictions: [
          {
            cabin: "ECONOMY",
            coverage: "MOST_SEGMENTS",
            originDestinationIds: ["1"],
          },
        ],
      },
    },
  };

  try {
    const response = await fetch(process.env.OFFER_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });
    checkStatus(response);
    return response.json();
  } catch (error) {
    const errorBody = await error.response.text();
    console.error(`Error body: ${errorBody}`);
  }
}

/**
 *
 * @param {String} response
 * @returns String[]
 *
 * Builds an array of offers in a format usable by the discord commands
 */
const parseData = (response) => {
  const offers = [];
  if (!response) {
    return [];
  }
  for (const offer of response.data) {
    const pkg = {};
    pkg.price = offer.price.grandTotal;
    for (const itinerary of offer.itineraries) {
      pkg.duration = itinerary.duration;
      pkg.segments = [];
      for (const segmentRaw of itinerary.segments) {
        const seg = {};
        seg.departure = {};
        seg.arrival = {};

        seg.departure.originAirport = segmentRaw.departure.iataCode;
        seg.departure.departureTime = segmentRaw.departure.at;

        seg.arrival.destAirport = segmentRaw.arrival.iataCode;
        seg.arrival.arrivalTime = segmentRaw.arrival.at;

        seg.carrierCode = segmentRaw.carrierCode;
        seg.flightNumber = segmentRaw.number;
        seg.duration = segmentRaw.duration;
        console.log(segmentRaw);
        pkg.segments.push(seg);
      }
    }
    offers.push(pkg);
  }
  return offers;
};

/**
 *
 * @param {String} origin
 * @param {String} destination
 * @param {String} departureDate
 * @param {String} departureTime
 * @returns
 *
 * Wraps the flight information API call and exposes the function to be used by Discord
 */
export const getFlightOffers = async (
  origin,
  destination,
  departureDate,
  departureTime
) => {
  return parseData(
    await getFlightOffersData(origin, destination, departureDate, departureTime)
  );
};
