const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const prefix = "!";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // HELP
    if (commandName === "help") {
        return message.reply(`
📜 الأوامر:

!ban @user
!kick @user
!clear رقم
!avatar
!coinflip
        `);
    }

    // BAN
    if (commandName === "ban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply("❌ ما عندك صلاحية.");

        const member = message.mentions.members.first();
        if (!member) return message.reply("❌ منشن عضو.");

        await member.ban();
        return message.reply("🔨 تم تبنيد العضو.");
    }

    // KICK
    if (commandName === "kick") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("❌ ما عندك صلاحية.");

        const member = message.mentions.members.first();
        if (!member) return message.reply("❌ منشن عضو.");

        await member.kick();
        return message.reply("👢 تم طرد العضو.");
    }

    // CLEAR
    if (commandName === "clear") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
            return message.reply("❌ ما عندك صلاحية.");

        const amount = parseInt(args[0]);
        if (!amount) return message.reply("❌ اكتب رقم.");

        await message.channel.bulkDelete(amount);
        return message.reply(`🧹 تم حذف ${amount} رسالة.`);
    }

    // AVATAR
    if (commandName === "avatar") {
        const user = message.mentions.users.first() || message.author;
        return message.reply(user.displayAvatarURL({ dynamic: true, size: 1024 }));
    }

    // COINFLIP
    if (commandName === "coinflip") {
        const result = Math.random() > 0.5 ? "🪙 صورة" : "🪙 كتابة";
        return message.reply(result);
    }

});

client.login(process.env.TOKEN);

