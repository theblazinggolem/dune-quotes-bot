const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        const statuses = [
            { name: 'looking for wormsign', type: ActivityType.Custom },
        ];

        let i = 0;
        setInterval(() => {
            const status = statuses[i];
            client.user.setActivity(status.name, { type: status.type });
            i = (i + 1) % statuses.length;
        }, 600000);
    },
};
