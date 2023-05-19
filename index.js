require("dotenv").config();
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const fs = require("fs");

const responsesPath = "./data.json";
let messageResponses = {};
const prefix = "!"; // Change this to your desired command prefix
const commands = new Collection();

// Load responses from JSON file
function restart() {
  fs.readFile(responsesPath, (err, data) => {
    if (err) {
      console.error("Failed to load responses:", err);
      return;
    }
    messageResponses = JSON.parse(data);
    console.log("Responses loaded successfully!");
  });
}

client.on(Events.MessageCreate, (message, err) => {
  const { content } = message;
  let i;
  if (message.content.startsWith(`${prefix}catat`)) {
    const args = message.content.slice(1).trim().split(" ");
    let value = "";
    args.forEach((element, num) => {
      if (num > 1) {
        value += `${args[num]} `;
      }
    });
    const key = `${args[1]}`;
    // Read the existing JSON file
    const jsonData = fs.readFileSync(responsesPath, "utf8");
    const data = JSON.parse(jsonData);

    // Modify the JavaScript object by adding the new value to the appropriate key
    if (data[key]) {
      message.channel.send("Sudah ada brow, cari yang lain aja");
      return console.log("Duplicate entry!");
    }
    data[key] = value;

    // Write the updated JavaScript object back to the JSON file
    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(responsesPath, updatedData, "utf8");
    message.channel.send("Siap Dimengerti!");
    delete require.cache[require.resolve(responsesPath)];
    console.log(`File ${responsesPath} Reloaded!`);
    messageResponses = {};
    return restart();
  }
  //   console.log(message);
  const response = messageResponses[content];
  console.log(`Konten Pesan : ${messageResponses[content]}`);
  if (response) {
    message.channel.send(response);
    console.log(`Respon : ${messageResponses[content]}`);
  }

  if (err) return console.log(err);
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in ${c.user.tag}`);
  restart();
});

client.login(process.env.TOKEN);
