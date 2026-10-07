require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const { commandeRemise } = require("./commands/remise");
const { commandeExamen } = require("./commands/examen");
const { commandeSalut, commandeScuse } = require("./commands/salut");
const { demarrerRappels, verifierRappels } = require("./services/rappels");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Bot connecté comme ${client.user.tag}`);

    demarrerRappels(client);
});

client.on("messageCreate", (message) => {

    if (message.author.bot) return;

    const commande = message.content.toLowerCase().trim();

    if (commande === "!remise") {
        commandeRemise(message);
    }

    if (commande === "!examen") {
        commandeExamen(message);
    }

    if (commande.includes("salut")) {
        commandeSalut(message);
    }
    if (commande.includes("scuse")){
        commandeScuse(message);
    }
    if (commande === "!testrappel") {
    console.log("Commande !testrappel reçue");
    verifierRappels(client);
    }
});

client.login(process.env.DISCORD_TOKEN);