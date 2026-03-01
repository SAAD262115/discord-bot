const { 
    Client, 
    GatewayIntentBits, 
    SlashCommandBuilder, 
    Routes, 
    REST,
    PermissionFlagsBits 
} = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "1456625724285784168";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const commands = [

    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check latency'),

    new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin'),

    new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a number 1-100'),

    new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('What should I say?')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

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
        return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
    }

    if (interaction.commandName === 'coinflip') {
        const result = Math.random() > 0.5 ? "🪙 Heads" : "🪙 Tails";
        return interaction.reply(result);
    }

    if (interaction.commandName === 'roll') {
        const number = Math.floor(Math.random() * 100) + 1;
        return interaction.reply(`🎲 You rolled: ${number}`);
    }

    if (interaction.commandName === 'say') {
        const text = interaction.options.getString('text');
        await interaction.reply({ content: 'Done', ephemeral: true });
        await interaction.channel.send(text);
    }

    if (interaction.commandName === 'clear') {
        const amount = interaction.options.getInteger('amount');
        await interaction.channel.bulkDelete(amount, true);
        return interaction.reply({ content: `Deleted ${amount} messages`, ephemeral: true });
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

