require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const { remises, examens } = require("./dates");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Bot connecté comme ${client.user.tag}`);
});

client.on("messageCreate", (message) => {

    if (message.author.bot) return;

    const commande = message.content.toLowerCase().trim();

    if (commande === "!remise") {

        let texte = "📚 **Prochaines remises de TP**\n\n";

        remises.forEach(remise => {

            const dateFormatee = new Date(remise.date + "T12:00:00")
                .toLocaleDateString("fr-CA", {
                    day: "numeric",
                    month: "long"
                });

            texte += `• **${remise.cours}** - ${remise.travail} (${remise.ponderation}) : ${dateFormatee}\n`;
        });

        message.reply(texte);
    }

    if (commande === "!examen") {

        let texte = "📝 **Prochains examens**\n\n";

        examens.forEach(examen => {

            const dateFormatee = new Date(examen.date + "T12:00:00")
                .toLocaleDateString("fr-CA", {
                    day: "numeric",
                    month: "long"
                });

            texte += `• **${examen.cours}** - ${examen.examen} (${examen.ponderation}) : ${dateFormatee}\n`;
        });

        message.reply(texte);
    }
        if (commande === "!salut") {

        let texte = "Pourquoi tu me parle?";

        message.reply(texte);
    }

});

client.login(process.env.DISCORD_TOKEN);