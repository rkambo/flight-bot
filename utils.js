import { getAirport, getCity } from "./airports.js";
import dayjs from "dayjs";
import {EmbedBuilder} from "discord.js";


const inputErrors = {
    INVALIDDATE: "Couldn't understand the date you entered! Please try again!",
    PASTDATE: "The date you entered is in the past! Please try again!",
    INVALIDORIGIN: "The origin city is invalid!",
    INVALIDDEST: "The destination city is invalid!",
  };

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


export const existInputErrors = (origin, destination, date) => {
    if (isNaN(dayjs(date))) return inputErrors.INVALIDDATE;
    if (dayjs(date) < Date.now()) return inputErrors.PASTDATE;
    if (getAirport(origin) == null) return inputErrors.INVALIDORIGIN;
    if (getAirport(destination) == null) return inputErrors.INVALIDDEST;
    return "";
  };

  
 const formatDuration = (duration) => {
    return duration.replace("PT", "").replace("H", "H ");
  };