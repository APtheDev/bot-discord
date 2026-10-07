const cron = require("node-cron");
const { remises } = require("../dates");

async function verifierRappels(client) {

    console.log("Vérification des rappels de remise...");

    try {
        const channel = await client.channels.fetch(
            process.env.GENERAL_CHANNEL_ID
        );

        if (!channel) {
            console.log("Salon général introuvable.");
            return;
        }

        const aujourdHui = new Date();
        aujourdHui.setHours(0, 0, 0, 0);

        for (const remise of remises) {

            const dateRemise = new Date(
                remise.date + "T00:00:00"
            );

            const differenceMs =
                dateRemise.getTime() - aujourdHui.getTime();

            const joursRestants = Math.round(
                differenceMs / (1000 * 60 * 60 * 24)
            );

            console.log(
                `${remise.cours} - ${remise.travail} : ${joursRestants} jours`
            );

            if (
                joursRestants === 7 ||
                joursRestants === 3 ||
                joursRestants === 2 ||
                joursRestants === 1
            ) {

                const dateFormatee =
                    dateRemise.toLocaleDateString("fr-CA", {
                        day: "numeric",
                        month: "long"
                    });

                await channel.send(
                    `@everyone 🚨 **Rappel de remise**\n\n` +
                    `📚 **${remise.cours}**\n` +
                    `📝 ${remise.travail}\n` +
                    `📊 Pondération : ${remise.ponderation}\n` +
                    `📅 Remise : ${dateFormatee}\n` +
                    `⏳ Il reste **${joursRestants} jour${joursRestants > 1 ? "s" : ""}** !`
                );
            }
        }

    } catch (error) {
        console.error("Erreur pendant les rappels :", error);
    }
}


function demarrerRappels(client) {

    cron.schedule("0 9 * * *", async () => {
        await verifierRappels(client);
    }, {
        timezone: "America/Toronto"
    });

}


module.exports = {
    demarrerRappels,
    verifierRappels
};