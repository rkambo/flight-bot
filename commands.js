import { SlashCommandBuilder, EmbedBuilder, hyperlink, bold } from "discord.js";
import { getAirport, getCity } from "./airports.js";
import { getFlightOffers } from "./flightapi.js";
import dayjs from "dayjs";

const formatDuration = (duration) => {
  return duration.replace("PT", "").replace("H", "H ");
};
const buildEmbeds = (offers) => {
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
    console.log("Title: [" + title + "]");
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

const inputErrors = {
  INVALIDDATE: "Couldn't understand the date you entered! Please try again!",
  PASTDATE: "The date you entered is in the past! Please try again!",
  INVALIDORIGIN: "The origin city is invalid!",
  INVALIDDEST: "The destination city is invalid!",
};
const existInputErrors = (origin, destination, date) => {
  if (isNaN(dayjs(date))) return inputErrors.INVALIDDATE;
  if (dayjs(date) < Date.now()) return inputErrors.PASTDATE;
  if (getAirport(origin) == null) return inputErrors.INVALIDORIGIN;
  if (getAirport(destination) == null) return inputErrors.INVALIDDEST;
  return "";
};

const something = (origin) => {
  origin = "Goodbye";
};
export const ping = {
  data: new SlashCommandBuilder()
    .setName("fly")
    .setDescription("Let's fly!")
    .addStringOption((option) =>
      option
        .setName("origin")
        .setDescription("The city that you will be flying from.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("destination")
        .setDescription("The city you want to fly to.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("departure")
        .setDescription("When do you want to leave?")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const originInput = interaction.options.get("origin").value;
    const destInput = interaction.options.get("destination").value;
    const departureInput = interaction.options.get("departure").value;

    console.log("Date: [" + dayjs(departureInput) + "]");
    const err = existInputErrors(originInput, destInput, departureInput);
    console.log("Error: [" + err + "]");
    if (err) {
      await interaction.editReply(err);
    } else {
      const departure = dayjs(departureInput);
      const deptDate = departure.format("YYYY-MM-DD");
      const deptTime = departure.format("HH:mm:ss");

      const offers = await getFlightOffers(
        getAirport(originInput).iata,
        getAirport(destInput).iata,
        deptDate,
        deptTime
      );
      const embedArr = buildEmbeds(offers);
      await interaction.editReply({ embeds: embedArr });
      await interaction.editReply("Call was successful");
    }
  },
};
