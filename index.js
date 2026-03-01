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

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [

    // ===== Moderation =====
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    // ===== Fun =====
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency'),

    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get user avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select user')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin'),

    // ===== Apply System =====
    new SlashCommandBuilder()
        .setName('apply')
        .setDescription('Application system')
        .addSubcommand(sub =>
            sub.setName('setup')
                .setDescription('Setup application system'))
        .addSubcommand(sub =>
            sub.setName('clear')
                .setDescription('Clear applications'))
        .addSubcommand(sub =>
            sub.setName('status')
                .setDescription('Check system status'))

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
        const user = interaction.options.getUser('user') || interaction.user;
        return interaction.reply(user.displayAvatarURL({ dynamic: true, size: 1024 }));
    }

    if (interaction.commandName === 'ban') {

