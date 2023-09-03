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

async function getFlightOffers(origin, destination, startDate, endDate) {
  const bearerToken = await getBearerToken();
  const reqBody = {
    currencyCode: "USD",
    originDestinations: [
      {
        id: "1",
        originLocationCode: "NYC",
        destinationLocationCode: "MAD",
        departureDateTimeRange: {
          date: "2023-11-01",
          time: "10:00:00",
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
            cabin: "BUSINESS",
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
    const data = await response.json();
    console.log(data);
  } catch (error) {
    const errorBody = await error.response.text();
    console.error(`Error body: ${errorBody}`);
  }
}

getFlightOffers();
