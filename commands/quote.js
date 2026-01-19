const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quote")
        .setDescription("replies with a random quote"),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await fetch('https://dune-quotes.blzng.dev/api/random');
            const data = await response.json();
            await interaction.editReply(`> ${data.text}\n— ${data.author}\n-# ${data.book},${typeof data.chapter === "number" ? " Chapter" : ""} ${data.chapter}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('Failed to fetch a quote.');
        }
    },
};
