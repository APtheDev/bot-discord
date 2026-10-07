const { remises, examens } = require("../dates");

function commandeProchain(message) {

    const maintenant = new Date();

    const evenements = [];

    // Ajouter les remises
    remises.forEach(remise => {

        const date = new Date(remise.date);

        if (date > maintenant) {
            evenements.push({
                type: "remise",
                cours: remise.cours,
                nom: remise.travail,
                ponderation: remise.ponderation,
                date: date
            });
        }
    });

    // Ajouter les examens
    examens.forEach(examen => {

        const date = new Date(examen.date);

        if (date > maintenant) {
            evenements.push({
                type: "examen",
                cours: examen.cours,
                nom: examen.examen,
                ponderation: examen.ponderation,
                date: date
            });
        }
    });

    if (evenements.length === 0) {
        message.reply("🎉 Il n'y a plus rien à venir !");
        return;
    }

    // Trier du plus proche au plus loin
    evenements.sort((a, b) => a.date - b.date);

    const prochain = evenements[0];

    const dateFormatee = prochain.date.toLocaleString("fr-CA", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit"
    });

    const differenceMs =
        prochain.date.getTime() - maintenant.getTime();

    const heuresRestantes = Math.ceil(
        differenceMs / (1000 * 60 * 60)
    );

    const joursRestants = Math.floor(
        heuresRestantes / 24
    );

    const heures = heuresRestantes % 24;

    let tempsRestant = "";

    if (joursRestants > 0) {
        tempsRestant += `${joursRestants} jour${joursRestants > 1 ? "s" : ""}`;
    }

    if (heures > 0) {
        if (tempsRestant !== "") {
            tempsRestant += " et ";
        }

        tempsRestant += `${heures} heure${heures > 1 ? "s" : ""}`;
    }

    const emoji =
        prochain.type === "remise" ? "📝" : "🧪";

    const typeTexte =
        prochain.type === "remise" ? "Remise" : "Examen";

    message.reply(
        `⏰ **Prochaine échéance**\n\n` +
        `${emoji} **${typeTexte}**\n` +
        `📚 **${prochain.cours}**\n` +
        `📌 ${prochain.nom}\n` +
        `📊 Pondération : ${prochain.ponderation}\n` +
        `📅 ${dateFormatee}\n` +
        `⏳ Dans **${tempsRestant}**`
    );
}

module.exports = {
    commandeProchain
};