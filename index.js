const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [

    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency'),

    new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin'),

    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get user avatar')

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
    }

    if (interaction.commandName === 'coinflip') {
        const result = Math.random() > 0.5 ? "🪙 Heads" : "🪙 Tails";
        return interaction.reply(result);
    }

    if (interaction.commandName === 'avatar') {
        return interaction.reply(interaction.user.displayAvatarURL({ dynamic: true }));
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

