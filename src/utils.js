/**
 * Utils.js
 *
 * Utility methods
 */
import { getAirport, getCity } from "./airports.js";
import dayjs from "dayjs";
import { EmbedBuilder } from "discord.js";

const inputErrors = {
  INVALIDDATE: "Couldn't understand the date you entered! Please try again!",
  PASTDATE: "The date you entered is in the past! Please try again!",
  INVALIDORIGIN: "The origin city is invalid!",
  INVALIDDEST: "The destination city is invalid!",
};

/**
 *
 * @param {*} offers
 * @returns EmbedBuilder[]
 *
 * Builds the embeds for Discord messages from the flight offers
 */
export const buildEmbeds = (offers) => {
  const embedArr = [];
  for (const offer of offers) {
    const embed = new EmbedBuilder();
    let title = "";
    for (const segment of offer.segments) {
      if (title.length != 0) title = title.concat("\n");
      title = title.concat(
        `${getCity(segment.departure.originAirport)} ➡️ ${getCity(
          segment.arrival.destAirport
        )}`
      );
      embed.addFields(
        {
          name: "Flight Number",
          value: `${segment.carrierCode}-${segment.flightNumber}`,
        },

        {
          name: "Origin",
          value: `${getCity(segment.departure.originAirport)} \n ${
            segment.departure.originAirport
          }`,
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "Destination",
          value: `${getCity(segment.arrival.destAirport)} \n ${
            segment.arrival.destAirport
          }`,
          inline: true,
        },
        {
          name: "Departure",
          value: formatTimestamp(segment.departure.departureTime),
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "Arrival",
          value: formatTimestamp(segment.arrival.arrivalTime),
          inline: true,
        },

        {
          name: "Duration",
          value: formatDuration(segment.duration),
          inline: true,
        },
        { name: "\u200B", value: "\u200B" }
      );
    }
    embed.addFields({
      name: "Total Duration",
      value: formatDuration(offer.duration),
      inline: true,
    });
    embed.addFields({
      name: "Price",
      value: `$${offer.price}`,
      inline: true,
    });
    embed.setTimestamp();
    embed.setTitle(title);
    // embed.setTitle("Seattle ➡️ Toronto\nToronto ➡️ Boston");
    embedArr.push(embed);
  }
  return embedArr;
};

/**
 *
 * @param {String} origin
 * @param {String} destination
 * @param {String} date
 * @returns String
 *
 * Validates user input
 */
export const existInputErrors = (origin, destination, date) => {
  if (isNaN(dayjs(date))) return inputErrors.INVALIDDATE;
  if (dayjs(date) < Date.now()) return inputErrors.PASTDATE;
  if (getAirport(origin) == null) return inputErrors.INVALIDORIGIN;
  if (getAirport(destination) == null) return inputErrors.INVALIDDEST;
  return "";
};

/**
 *
 * @param {String} duration
 * @returns String
 *
 * Formats duration string for readibility
 */
const formatDuration = (duration) => {
  return duration.replace("PT", "").replace("H", "H ");
};

/**
 *
 * @param {String} datetime
 * @returns String
 *
 * Formats date time string for readibility
 */
const formatTimestamp = (datetime) => {
  return dayjs(datetime).format("MMM DD, YYYY \nh:mm a");
};
