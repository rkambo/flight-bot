# Flight Bot

## Description

A bot to add to your Discord server to find cheap flights

## Requirements

Access to the [Amadeus API](https://developers.amadeus.com) and your own Discord Server. You can set up a Discord App and Bot [here](https://discord.com/developers/docs/getting-started).

## Env Structure

```
#Discord

APP_ID=[app-id-or-client-id]
DISCORD_TOKEN=[discord-access-token]
PUBLIC_KEY=[discord-public-key]
SERVER_ID=[discord-server-id]

#Amadeus Flight API

CLIENT_ID=[client-id]
CLIENT_SECRET=[client-secret]
TOKEN_ENDPOINT=https://test.api.amadeus.com/v1/security/oauth2/token
OFFER_ENDPOINT=https://test.api.amadeus.com/v2/shopping/flight-offers
```
