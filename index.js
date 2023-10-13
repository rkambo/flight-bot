import "dotenv/config";
// Require the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { ping } from "./commands.js";
// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// for (const file of commandFiles) {
//   const filePath = path.join(commandsPath, file);
//   import command from filePath;
//   // Set a new item in the Collection with the key as the command name and the value as the exported module
//   if ("data" in command && "execute" in command) {
//     client.commands.set(command.data.name, command);
//   } else {
//     console.log(
//       `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
//     );
//   }
// }
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
// client.once(Events.ClientReady, (c) => {
//   console.log(`Ready! Logged in as ${c.user.tag}`);
// });

// Log in to Discord with your client's token
// client.login(process.env.discordToken);

client.on("ready", () => {
  console.log(`${client.user.tag}`);
});
client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "fly") ping.execute(interaction);
  }
});

async function main() {
  const commands = [
    {
      name: "order",
      description: "test order..",
    },
  ];
  try {
    // console.log("Started refreshing application (/) commands");
    // await restart.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
    //   body: commands,
    // });
    client.login(process.env.discordToken);
  } catch (err) {
    console.log(err);
  }
}
main();
// client.on(Events.InteractionCreate, async (interaction) => {
//   console.log(client);
//   if (!interaction.isChatInputCommand()) return;

//   const command = interaction.client.commands.get(interaction.commandName);

//   if (!command) {
//     console.error(`No command matching ${interaction.commandName} was found.`);
//     return;
//   }

//   try {
//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({
//         content: "There was an error while executing this command!",
//         ephemeral: true,
//       });
//     } else {
//       await interaction.reply({
//         content: "There was an error while executing this command!",
//         ephemeral: true,
//       });
//     }
//   }
// });
