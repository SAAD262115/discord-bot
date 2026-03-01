const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'panel',
    description: 'Admin Panel',
    execute(message) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ ما عندك صلاحية.");
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ban_button')
                    .setLabel('🔨 Ban')
                    .setStyle(ButtonStyle.Danger)
            );

        message.channel.send({
            content: "🎛 لوحة التحكم",
            components: [row]
        });
    }
};
