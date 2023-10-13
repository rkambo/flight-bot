import "dotenv/config";
import fetch from "node-fetch";

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    this.response = response;
  }
}

const checkStatus = (response) => {
  if (response.ok) {
    // response.status >= 200 && response.status < 300
    return response;
  } else {
    throw new HTTPResponseError(response);
  }
};

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

const formatDate = (stringDate) => {
  let dt = new Date(stringDate);
  dt.toISOString().split("T")[0];
  const offset = dt.getTimezoneOffset();
  dt = new Date(dt.getTime() - offset * 60 * 1000);
  return dt.toISOString().split("T")[0];
};

async function getFlightOffersData(origin, destination, departure) {
  const bearerToken = await getBearerToken();
  const reqBody = {
    currencyCode: "CAD",
    originDestinations: [
      {
        id: "1",
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDateTimeRange: {
          date: departure,
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

        pkg.segments.push(seg);
      }
    }
    offers.push(pkg);
  }
  return offers;
};

export const getFlightOffers = async (origin, destination, departure) => {
  return parseData(await getFlightOffersData(origin, destination, departure));
};

// parseData(await getFlightOffers());
