const { Events, ActivityType } = require('discord.js');
const keepAlive = require('../keep_alive');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        keepAlive();

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
