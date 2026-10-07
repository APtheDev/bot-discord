const { examens } = require("../dates");

function commandeExamen(message) {

    let texte = "📝 **Prochains examens**\n\n";

    examens.forEach(examen => {

        const dateFormatee = new Date(examen.date + "T12:00:00")
            .toLocaleDateString("fr-CA", {
                day: "numeric",
                month: "long"
            });

        texte +=
            `• **${examen.cours}** - ${examen.examen} ` +
            `(${examen.ponderation}) : ${dateFormatee}\n`;
    });

    message.reply(texte);
}

module.exports = {
    commandeExamen
};