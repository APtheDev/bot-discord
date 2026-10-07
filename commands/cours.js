const { remises, examens } = require("../dates");

function normaliserTexte(texte) {
    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function commandeCours(message) {

    const contenu = message.content.trim();

    // Enlever "!cours" du début
    const nomRecherche = contenu.slice(6).trim();

if (!nomRecherche) {

    const tousLesCours = [
        ...remises.map(remise => remise.cours),
        ...examens.map(examen => examen.cours)
    ];

    const coursUniques = [...new Set(tousLesCours)];

    let texte = "❌ Tu dois préciser un cours.\n\n";
    texte += "📚 **Cours disponibles :**\n";

    coursUniques.forEach(cours => {
        texte += `• ${cours}\n`;
    });

    texte += "\nExemple : `!cours génie logiciel`";

    message.reply(texte);
    return;
}

    const rechercheNormalisee = normaliserTexte(nomRecherche);

    const remisesCours = remises.filter(remise =>
        normaliserTexte(remise.cours).includes(rechercheNormalisee)
    );

    const examensCours = examens.filter(examen =>
        normaliserTexte(examen.cours).includes(rechercheNormalisee)
    );

    if (remisesCours.length === 0 && examensCours.length === 0) {
        message.reply(
            `❌ Aucun cours trouvé pour **${nomRecherche}**.`
        );
        return;
    }

    // Récupérer le vrai nom du cours
    const nomCours =
        remisesCours[0]?.cours ||
        examensCours[0]?.cours;

    let texte = `📚 **${nomCours}**\n\n`;

    // =========================
    // REMISES
    // =========================

    if (remisesCours.length > 0) {

        texte += "📝 **Remises**\n";

        remisesCours
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .forEach(remise => {

                const dateFormatee =
                    new Date(remise.date).toLocaleString("fr-CA", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                texte +=
                    `• ${remise.travail} ` +
                    `(${remise.ponderation}) — ${dateFormatee}\n`;
            });

        texte += "\n";
    }


    // =========================
    // EXAMENS
    // =========================

    if (examensCours.length > 0) {

        texte += "🧪 **Examens**\n";

        examensCours
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .forEach(examen => {

                const dateFormatee =
                    new Date(examen.date).toLocaleString("fr-CA", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                texte +=
                    `• ${examen.examen} ` +
                    `(${examen.ponderation}) — ${dateFormatee}\n`;
            });
    }

    message.reply(texte);
}

module.exports = {
    commandeCours
};  