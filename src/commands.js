import { SlashCommandBuilder, EmbedBuilder, hyperlink, bold } from "discord.js";
import { getAirport } from "./airports.js";
import { getFlightOffers } from "./flightapi.js";
import { existInputErrors, buildEmbeds } from "./utils.js";
import dayjs from "dayjs";

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

    const err = existInputErrors(originInput, destInput, departureInput);
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
    }
  },
};
