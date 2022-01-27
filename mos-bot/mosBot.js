const tmi = require('tmi.js');
const Secrets = require('./secrets.js');

const LangBot = require('./other-bot-commands/langBot.js');
// Define configuration options
const opts = {
  identity: {
    username: Secrets.twitchInfo.identity.username,
    password: Secrets.twitchInfo.identity.password,
  },
  channels: [
    Secrets.twitchChannels[0],
    Secrets.twitchChannels[1],
    Secrets.twitchChannels[2],
    Secrets.twitchChannels[3],
    Secrets.twitchChannels[4],
    Secrets.twitchChannels[5]
  ],
    // Automatic reconnection
    connection: { reconnect: true }
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(channel, userState, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  msg = msg.trim();
  if (msg[0] != '!') return; //if first character in msg is not an exclamation stop program

  const commandArray = msg.split(" ");

  // Remove whitespace from chat message
  const commandName = commandArray[0];

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(channel, `${userState.username} rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!tr') {
    LangBot.languageBotCommands(client, channel, userState, msg, self, commandArray)
  }
}

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
