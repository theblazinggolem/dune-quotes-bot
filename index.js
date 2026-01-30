const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ quiet: true });

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});
const token = process.env.DISCORD_TOKEN;
const keepAlive = require('./keep_alive');

keepAlive();

console.log('Initializing client...');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

console.log('Loading commands...');
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    console.log(`- Loading command: ${file}`);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

console.log('Loading events...');
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    console.log(`- Loading event: ${file}`);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

console.log('Checking token...');
const cleanToken = token ? token.trim() : '';
if (!cleanToken) {
    console.error('ERROR: DISCORD_TOKEN is missing or empty!');
} else {
    console.log(`Token Info - Length: ${cleanToken.length}, Prefix: ${cleanToken.substring(0, 10)}... (Original Length: ${token.length})`);

    // Connectivity test
    fetch('https://discord.com/api/v10/gateway').then(res => {
        console.log(`- Connectivity test: ${res.status} ${res.statusText}`);
    }).catch(err => {
        console.error('- Connectivity test failed:', err.message);
    });

    client.on('debug', info => console.log(`[DEBUG] ${info}`));
    client.on('warn', warning => console.warn(`[WARN] ${warning}`));
    client.on('error', error => console.error(`[ERROR] ${error}`));
    client.on('shardReady', shardId => console.log(`[SHARD READY] Shard ${shardId}`));

    console.log('Attempting to log in...');
    client.login(cleanToken).then(() => {
        console.log('Login successful');
    }).catch(err => {
        console.error('Login failed:', err);
    });
}