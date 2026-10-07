function commandeSalut(message) {
    message.reply("Pourquoi tu me parles?");
}
function commandeScuse(message){
    message.reply("Scorrect mais recommence pas !");
}

module.exports = {
    commandeSalut,
    commandeScuse
};