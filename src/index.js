/**
 * Index.js
 *
 * Entry file that gets executed
 */

import "dotenv/config";
// Require the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { ping } from "./commands.js";
// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("ready", () => {
  console.log(`${client.user.tag}`);
});
client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "fly") ping.execute(interaction);
  }
});

async function main() {
  try {
    client.login(process.env.discordToken);
  } catch (err) {
    console.log(err);
  }
}
main();
