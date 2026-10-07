require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const { commandeRemise } = require("./commands/remise");
const { commandeExamen } = require("./commands/examen");
const { commandeSalut, commandeScuse } = require("./commands/salut");
const { demarrerRappels, verifierRappels } = require("./services/rappels");
const { commandeProchain } = require("./commands/prochain");
const { commandeCours } = require("./commands/cours");
const { envoyerGifRandom } = require("./services/gifs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("clientReady", () => {
    console.log(`Bot connecté comme ${client.user.tag}`);

    demarrerRappels(client);
});

client.on("messageCreate", (message) => {

    if (message.author.bot) return;

    const commande = message.content.toLowerCase().trim();

    // =========================
    // DÉTECTION GIF
    // =========================

const contenu = message.content.toLowerCase();

const gifDansTexte =
    contenu.includes(".gif") ||
    contenu.includes("giphy.com") ||
    contenu.includes("tenor.com") ||
    contenu.includes("klipy.com");

const gifDansEmbed = message.embeds.some(embed => {
    return (
        embed.data?.type === "gifv" ||
        embed.url?.includes("giphy.com") ||
        embed.url?.includes("tenor.com") ||
        embed.url?.includes("klipy.com") ||
        embed.image?.url?.includes(".gif")
    );
});

const gifDansAttachment = message.attachments.some(attachment => {
    return (
        attachment.contentType === "image/gif" ||
        attachment.url?.includes(".gif")
    );
});

if (gifDansTexte || gifDansEmbed || gifDansAttachment) {
    console.log("GIF détecté !");
    envoyerGifRandom(message);
}
    // =========================
    // COMMANDES
    // =========================

    if (commande === "!remise") {
        commandeRemise(message);
    }

    if (commande === "!examen") {
        commandeExamen(message);
    }

    if (commande === "!prochain") {
        commandeProchain(message);
    }

    if (commande.startsWith("!cours")) {
        commandeCours(message);
    }

    if (commande.includes("salut")) {
        commandeSalut(message);
    }

    if (commande.includes("scuse")) {
        commandeScuse(message);
    }

    if (commande === "!testrappel") {
        console.log("Commande !testrappel reçue");
        verifierRappels(client);
    }
});

client.login(process.env.DISCORD_TOKEN);