const { 
    Client, 
    GatewayIntentBits, 
    SlashCommandBuilder, 
    Routes, 
    REST,
    PermissionFlagsBits,
    EmbedBuilder
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
        .setName('بنق')
        .setDescription('عرض سرعة البوت'),

    new SlashCommandBuilder()
        .setName('عملة')
        .setDescription('قلب عملة'),

    new SlashCommandBuilder()
        .setName('رقم')
        .setDescription('اختيار رقم من 1 الى 100'),

    new SlashCommandBuilder()
        .setName('حظر')
        .setDescription('حظر عضو')
        .addUserOption(option =>
            option.setName('عضو')
                .setDescription('العضو المراد حظره')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    new SlashCommandBuilder()
        .setName('طرد')
        .setDescription('طرد عضو')
        .addUserOption(option =>
            option.setName('عضو')
                .setDescription('العضو المراد طرده')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    new SlashCommandBuilder()
        .setName('تايم')
        .setDescription('إعطاء تايم أوت')
        .addUserOption(option =>
            option.setName('عضو')
                .setDescription('العضو')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('دقائق')
                .setDescription('مدة التايم بالدقائق')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    new SlashCommandBuilder()
        .setName('مسح')
        .setDescription('حذف رسائل')
        .addIntegerOption(option =>
            option.setName('عدد')
                .setDescription('عدد الرسائل')
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
        console.log('تم تسجيل الاوامر');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'بنق') {
        return interaction.reply(`🏓 السرعة: ${client.ws.ping}ms`);
    }

    if (commandName === 'عملة') {
        const result = Math.random() > 0.5 ? "🪙 صورة" : "🪙 كتابة";
        return interaction.reply(result);
    }

    if (commandName === 'رقم') {
        const number = Math.floor(Math.random() * 100) + 1;
        return interaction.reply(`🎲 الرقم: ${number}`);
    }

    if (commandName === 'حظر') {
        const user = interaction.options.getUser('عضو');
        await interaction.guild.members.ban(user.id);
        return interaction.reply(`🚫 تم حظر ${user.tag}`);
    }

    if (commandName === 'طرد') {
        const user = interaction.options.getUser('عضو');
        await interaction.guild.members.kick(user.id);
        return interaction.reply(`👢 تم طرد ${user.tag}`);
    }

    if (commandName === 'تايم') {
        const user = interaction.options.getMember('عضو');
        const minutes = interaction.options.getInteger('دقائق');
        await user.timeout(minutes * 60 * 1000);
        return interaction.reply(`⏳ تم إعطاء ${minutes} دقيقة تايم`);
    }

    if (commandName === 'مسح') {
        const amount = interaction.options.getInteger('عدد');
        await interaction.channel.bulkDelete(amount, true);
        return interaction.reply({ content: `🗑️ تم حذف ${amount} رسالة`, ephemeral: true });
    }

});

client.once('ready', () => {
    console.log(`تم تشغيل البوت: ${client.user.tag}`);
});

client.login(TOKEN);

