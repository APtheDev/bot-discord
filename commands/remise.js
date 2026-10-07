const { remises } = require("../dates");

function commandeRemise(message) {

    let texte = "📚 **Prochaines remises de TP**\n\n";

    remises.forEach(remise => {

        const dateRemise = new Date(remise.date);

        const dateFormatee = dateRemise.toLocaleString("fr-CA", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        });

        texte +=
            `• **${remise.cours}** - ${remise.travail} ` +
            `(${remise.ponderation}) : ${dateFormatee}\n`;
    });

    message.reply(texte);
}

module.exports = {
    commandeRemise
};