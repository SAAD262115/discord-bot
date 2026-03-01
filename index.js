
const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "1456625724285784168";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );
        console.log('Commands registered');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);
