import { SlashCommandBuilder, time } from "discord.js";
import dayjs from "dayjs";
// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("ping")
//     .setDescription("Replies with Pong!"),
//   async execute(interaction) {
//     await interaction.reply("Pong!");
//   },
// };

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
    )
    .addStringOption((option) =>
      option
        .setName("return")
        .setDescription("When do you want to come back?")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    console.log("Date Entered: " + interaction.options.get("departure").value);
    const date = dayjs(interaction.options.get("departure").value);
    console.log(date);
    await interaction.editReply("Let's go!");
  },
};
// export const data = new SlashCommandBuilder()
//   .setName("ping")
//   .setDescription("Replies with Pong!");
// export async function execute(interaction) {
//   await interaction.reply("Pong!");
// }
