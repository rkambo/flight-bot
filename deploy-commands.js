import { REST, Routes } from "discord.js";
import "dotenv/config";
import { ping } from "./commands.js";

const commands = [];
// Grab all the command files from the commands directory you created earlier

if ("data" in ping && "execute" in ping) {
  commands.push(ping.data.toJSON());
} else {
  console.log(
    `[WARNING] The command is missing a required "data" or "execute" property.`
  );
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.APP_ID,
        process.env.SERVER_ID
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
