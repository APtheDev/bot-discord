const cron = require("node-cron");
const { remises, examens } = require("../dates");

async function verifierRappels(client) {

    console.log("Vérification des rappels...");

    try {

        const channel = await client.channels.fetch(
            process.env.GENERAL_CHANNEL_ID
        );

        if (!channel) {
            console.log("Salon de rappels introuvable.");
            return;
        }

        const aujourdHui = new Date();
        aujourdHui.setHours(0, 0, 0, 0);

        for (const remise of remises) {

            const dateRemise = new Date(remise.date);

            const dateRemiseJour = new Date(dateRemise);
            dateRemiseJour.setHours(0, 0, 0, 0);

            const differenceMs =
                dateRemiseJour.getTime() - aujourdHui.getTime();

            const joursRestants = Math.round(
                differenceMs / (1000 * 60 * 60 * 24)
            );

            console.log(
                `REMise : ${remise.cours} - ${remise.travail} : ${joursRestants} jours`
            );

            if (joursRestants < 7) {

                const dateFormatee =
                    dateRemise.toLocaleString("fr-CA", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
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
        for (const examen of examens) {

            const dateExamen = new Date(examen.date);

            const dateExamenJour = new Date(dateExamen);
            dateExamenJour.setHours(0, 0, 0, 0);

            const differenceMs =
                dateExamenJour.getTime() - aujourdHui.getTime();

            const joursRestants = Math.round(
                differenceMs / (1000 * 60 * 60 * 24)
            );

            console.log(
                `EXAMEN : ${examen.cours} - ${examen.examen} : ${joursRestants} jours`
            );

            if (joursRestants < 7){

                const dateFormatee =
                    dateExamen.toLocaleString("fr-CA", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                await channel.send(
                    `@everyone 🧪 **Rappel d'examen**\n\n` +
                    `📚 **${examen.cours}**\n` +
                    `📝 ${examen.examen}\n` +
                    `📊 Pondération : ${examen.ponderation}\n` +
                    `📅 Examen : ${dateFormatee}\n` +
                    `⏳ Il reste **${joursRestants} jour${joursRestants > 1 ? "s" : ""}** !`
                );
            }
        }

    } catch (error) {

        console.error(
            "Erreur pendant les rappels :",
            error
        );
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