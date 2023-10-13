import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { EmbedBuilder } from "discord.js";
import { VerifyDiscordRequest } from "./utils.js";
import { getAirport } from "./airports.js";
import { getFlightOffers } from "./flightapi.js";

const testFunc = () => {};

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === "test") {
      const embedArr = [];
      const origin = getAirport("Toronto");
      const dest = getAirport("Seattle");

      const offers = await getFlightOffers(
        origin.iata,
        dest.iata,
        "Dec 14 2023"
      );

      for (const offer of offers) {
        const embed = new EmbedBuilder();
        for (const segment of offer.segments) {
          embed.addFields(
            {
              name: "Origin",
              value: segment.departure.originAirport,
            },
            { name: "Destination", value: segment.arrival.destAirport },

            { name: "Duration", value: segment.duration }
          );
        }
        embed.addFields({ name: "Total Duration", value: offer.duration });
        embed.addFields({ name: "Price", value: offer.price });
        embed.setTimestamp();

        embedArr.push(embed);
      }

      // const exampleEmbed = new EmbedBuilder()
      //   .setColor(0x0099ff)
      //   .setTitle("Some title")
      //   .setURL("https://discord.js.org/")
      //   .setAuthor({
      //     name: "Some name",
      //     iconURL: "https://i.imgur.com/AfFp7pu.png",
      //     url: "https://discord.js.org",
      //   })
      //   .setDescription("Some description here")
      //   .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      //   .addFields(
      //     { name: "Regular field title", value: "Some value here" },
      //     { name: "\u200B", value: "\u200B" },
      //     {
      //       name: "Inline field title",
      //       value: "Some value here",
      //       inline: true,
      //     },
      //     { name: "Inline field title", value: "Some value here", inline: true }
      //   )
      //   .addFields({
      //     name: "Inline field title",
      //     value: "Some value here",
      //     inline: true,
      //   })
      //   .setImage("https://i.imgur.com/AfFp7pu.png")
      //   .setTimestamp()
      //   .setFooter({
      //     text: "Some footer text here",
      //     iconURL: "https://i.imgur.com/AfFp7pu.png",
      //   });

      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { embeds: embedArr },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
