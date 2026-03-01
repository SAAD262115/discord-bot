const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = "!";
client.commands = new Collection();

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.on("messageCreate", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  command.execute(message, args);
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    if (interaction.customId === 'ban_button') {

        if (!interaction.member.permissions.has('BanMembers')) {
            return interaction.reply({ content: "❌ ما عندك صلاحية.", ephemeral: true });
        }

        await interaction.reply({ content: "🔨 منشن العضو اللي تبي تبنده.", ephemeral: true });
    }

});

client.login(process.env.TOKEN);
