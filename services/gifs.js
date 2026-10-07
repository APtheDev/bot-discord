async function envoyerGifRandom(message) {

    try {
        const apiKey = process.env.GIPHY_API_KEY;

        const recherche = "reaction";

        const response = await fetch(
            `https://api.giphy.com/v1/gifs/search` +
            `?api_key=${apiKey}` +
            `&q=${encodeURIComponent(recherche)}` +
            `&limit=50` +
            `&rating=pg-13`
        );

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            console.log("Aucun GIF trouvé.");
            return;
        }

        const gifRandom =
            data.data[Math.floor(Math.random() * data.data.length)];

        const urlGif = gifRandom.images.original.url;

        await message.reply(urlGif);

    } catch (error) {
        console.error("Erreur GIPHY :", error);
    }
}

module.exports = {
    envoyerGifRandom
};